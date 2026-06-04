import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

/* ─── Design tokens ──────────────────────────────────────────── */
const T = {
    bg: '#070d1a',
    card: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.07)',
    borderHover: 'rgba(255,255,255,0.12)',
    green: '#10b981',
    amber: '#f59e0b',
    red: '#f43f5e',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#475569',
    textDim: '#334155',
};

/* ─── Helpers ─────────────────────────────────────────────────── */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const DIFFICULTY = [
    { label: 'Easy',   color: '#10b981' },
    { label: 'Medium', color: '#f59e0b' },
    { label: 'Hard',   color: '#f43f5e' },
];

const STATUS_MAP = {
    'Accepted':             { bg:'rgba(16,185,129,0.12)', color:'#10b981', border:'rgba(16,185,129,0.25)' },
    'Wrong Answer':         { bg:'rgba(244,63,94,0.12)',  color:'#f87171', border:'rgba(244,63,94,0.25)'  },
    'Compilation Error':    { bg:'rgba(245,158,11,0.12)', color:'#fbbf24', border:'rgba(245,158,11,0.25)' },
    'Runtime Error':        { bg:'rgba(249,115,22,0.12)', color:'#fb923c', border:'rgba(249,115,22,0.25)' },
    'Time Limit Exceeded':  { bg:'rgba(168,85,247,0.12)', color:'#c084fc', border:'rgba(168,85,247,0.25)' },
    'Pending':              { bg:'rgba(100,116,139,0.1)', color:'#94a3b8', border:'rgba(100,116,139,0.2)' },
};

const heatColor = (n) => {
    if (!n || n === 0) return 'rgba(255,255,255,0.04)';
    if (n === 1)        return 'rgba(16,185,129,0.22)';
    if (n <= 3)         return 'rgba(16,185,129,0.48)';
    if (n <= 6)         return 'rgba(16,185,129,0.72)';
    return '#10b981';
};

const generateYearDays = () => {
    const year = new Date().getFullYear();
    const days = [];
    const d    = new Date(year, 0, 1);
    while (d.getFullYear() === year) {
        days.push(new Date(d).toISOString().slice(0, 10));
        d.setDate(d.getDate() + 1);
    }
    return days;
};

/* ─── Shared styles ──────────────────────────────────────────── */
const card = {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 20,
    padding: 28,
};

const label = {
    fontSize: 11,
    fontWeight: 700,
    color: T.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 20,
};

/* ─── Sub-components ─────────────────────────────────────────── */
const StatCard = ({ title, value, sub, accent }) => (
    <div style={{
        ...card,
        background: `linear-gradient(135deg, rgba(${accent || '16,185,129'},0.08) 0%, rgba(255,255,255,0.02) 100%)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {title}
        </span>
        <span style={{ fontSize: 32, fontWeight: 900, color: T.textPrimary, lineHeight: 1.1 }}>
            {value}
        </span>
        {sub && <span style={{ fontSize: 12, color: T.textSecondary }}>{sub}</span>}
    </div>
);

/* ─── Main component ─────────────────────────────────────────── */
const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate             = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [problems,    setProblems]    = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);

    // Change password state
    const [cpForm,    setCpForm]    = useState({ current: '', next: '', confirm: '' });
    const [cpLoading, setCpLoading] = useState(false);
    const [cpMsg,     setCpMsg]     = useState(null); // { type: 'success'|'error', text }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setCpMsg(null);

        if (cpForm.next !== cpForm.confirm) {
            setCpMsg({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        if (cpForm.next.length < 6) {
            setCpMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
            return;
        }

        setCpLoading(true);
        try {
            await API.patch('/auth/change-password', {
                currentPassword: cpForm.current,
                newPassword:     cpForm.next,
            });
            setCpMsg({ type: 'success', text: 'Password updated successfully!' });
            setCpForm({ current: '', next: '', confirm: '' });
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to change password.';
            // 404 means backend route not yet implemented
            if (err.response?.status === 404) {
                setCpMsg({ type: 'error', text: 'Backend endpoint not yet implemented. Add PATCH /auth/change-password.' });
            } else {
                setCpMsg({ type: 'error', text: msg });
            }
        } finally {
            setCpLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const [sr, pr] = await Promise.all([
                    API.get('/submissions/user'),
                    API.get('/problems'),
                ]);
                setSubmissions(Array.isArray(sr.data) ? sr.data : []);
                setProblems(Array.isArray(pr.data) ? pr.data : pr.data?.problems || []);
            } catch {
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    /* ── Analytics ── */
    const stats = useMemo(() => {
        const diffMap = {};
        problems.forEach(p => { diffMap[p._id] = p.difficulty; });

        const totalByDiff = { Easy: 0, Medium: 0, Hard: 0 };
        problems.forEach(p => { if (p.difficulty in totalByDiff) totalByDiff[p.difficulty]++; });

        const accepted  = submissions.filter(s => s.status === 'Accepted');
        const solvedIds = new Set(accepted.map(s => s.problemId));

        const solvedByDiff = { Easy: 0, Medium: 0, Hard: 0 };
        solvedIds.forEach(id => {
            const d = diffMap[id];
            if (d in solvedByDiff) solvedByDiff[d]++;
        });

        const heatmap = {};
        submissions.forEach(s => {
            const day = new Date(s.createdAt).toISOString().slice(0, 10);
            heatmap[day] = (heatmap[day] || 0) + 1;
        });

        const acceptRate = submissions.length > 0
            ? Math.round((accepted.length / submissions.length) * 100)
            : 0;

        return {
            solved: solvedIds.size,
            total:  problems.length,
            solvedByDiff,
            totalByDiff,
            heatmap,
            acceptRate,
            acceptedCount: accepted.length,
        };
    }, [submissions, problems]);

    /* ── Heatmap weeks ── */
    const weeks = useMemo(() => {
        const days    = generateYearDays();
        const pad     = new Date(days[0]).getDay();
        const padded  = [...Array(pad).fill(null), ...days];
        const result  = [];
        for (let i = 0; i < padded.length; i += 7) result.push(padded.slice(i, i + 7));
        return result;
    }, []);

    const solvedPct = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;
    // SVG circumference of r=50: 2π*50 ≈ 314.16
    const circumference = 314.16;
    const dashArray = `${(solvedPct / 100) * circumference} ${circumference}`;

    /* ── Loading ── */
    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: 40, height: 40,
                    border: `3px solid rgba(16,185,129,0.2)`,
                    borderTopColor: '#10b981',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 16px',
                }} />
                <p style={{ color: T.textMuted, fontSize: 14 }}>Loading dashboard…</p>
            </div>
        </div>
    );

    if (error) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ padding: '20px 28px', background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.2)', borderRadius: 12, color:'#f87171', fontSize: 14 }}>{error}</div>
        </div>
    );

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px', animation: 'fade-in 0.35s ease-out' }}>

            {/* ── Page title ── */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: T.textPrimary, margin: 0 }}>Dashboard</h1>
                <p style={{ fontSize: 14, color: T.textMuted, margin: '6px 0 0' }}>Your coding journey at a glance.</p>
            </div>

            {/* ── Profile Banner ── */}
            <div style={{
                ...card,
                background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.05) 50%, rgba(255,255,255,0.02) 100%)',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                flexWrap: 'wrap',
                marginBottom: 20,
            }}>
                {/* Avatar */}
                <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, fontWeight: 900, color: '#070d1a',
                    boxShadow: '0 0 0 4px rgba(16,185,129,0.2), 0 8px 24px rgba(16,185,129,0.15)',
                    flexShrink: 0,
                }}>OC</div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: T.textPrimary, marginBottom: 4 }}>
                        {user?.username || 'Coder'}
                    </div>
                    <div style={{ fontSize: 13, color: T.textMuted }}>{user?.email || '—'}</div>
                </div>

                {/* Status pill */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)',
                    color: '#10b981', fontSize: 12, fontWeight: 600,
                    padding: '8px 16px', borderRadius: 100, flexShrink: 0,
                }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                    Active Coder
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                <StatCard title="Problems Available" value={stats.total}          accent="16,185,129" />
                <StatCard title="Problems Solved"    value={stats.solved}         accent="16,185,129" sub={`${solvedPct.toFixed(0)}% complete`} />
                <StatCard title="Total Submissions"  value={submissions.length}   accent="6,182,212" />
                <StatCard
                    title="Acceptance Rate"
                    value={`${stats.acceptRate}%`}
                    accent={stats.acceptRate >= 50 ? '16,185,129' : '245,158,11'}
                    sub={`${stats.acceptedCount} accepted`}
                />
            </div>

            {/* ── Progress + Heatmap ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 20 }}>

                {/* Completion */}
                <div style={card}>
                    <div style={label}>Completion</div>

                    {/* SVG Ring */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
                        <div style={{ position: 'relative', width: 130, height: 130 }}>
                            <svg width="130" height="130" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
                                <circle
                                    cx="60" cy="60" r="50"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="9"
                                    strokeLinecap="round"
                                    strokeDasharray={dashArray}
                                    style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
                                />
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 28, fontWeight: 900, color: T.textPrimary }}>{stats.solved}</span>
                                <span style={{ fontSize: 12, color: T.textMuted }}>of {stats.total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Difficulty bars */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {DIFFICULTY.map(({ label: dl, color }) => {
                            const solved = stats.solvedByDiff[dl] || 0;
                            const total  = stats.totalByDiff[dl]  || 0;
                            const pct    = total > 0 ? (solved / total) * 100 : 0;
                            return (
                                <div key={dl}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                                        <span style={{ fontSize: 12, fontWeight: 600, color }}>{dl}</span>
                                        <span style={{ fontSize: 12, color: T.textMuted }}>{solved}/{total}</span>
                                    </div>
                                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Heatmap */}
                <div style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={label}>Contribution Activity</div>
                        <span style={{ fontSize: 12, color: T.textDim, marginBottom: 20 }}>{new Date().getFullYear()}</span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <div style={{ display: 'flex', gap: 3, minWidth: 'max-content' }}>
                            {weeks.map((week, wi) => (
                                <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    {week.map((day, di) => (
                                        <div
                                            key={di}
                                            title={day ? `${day} — ${stats.heatmap[day] || 0} submission(s)` : ''}
                                            style={{
                                                width: 13, height: 13,
                                                borderRadius: 3,
                                                background: day ? heatColor(stats.heatmap[day] || 0) : 'transparent',
                                            }}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Month labels */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                            {MONTHS.map(m => (
                                <span key={m} style={{ fontSize: 10, color: T.textDim }}>{m}</span>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: 10, color: T.textDim }}>Less</span>
                        {[0, 1, 2, 4, 7].map(v => (
                            <div key={v} style={{ width: 13, height: 13, borderRadius: 3, background: heatColor(v) }} />
                        ))}
                        <span style={{ fontSize: 10, color: T.textDim }}>More</span>
                    </div>
                </div>
            </div>

            {/* ── Recent Submissions ── */}
            <div style={card}>
                <div style={label}>Recent Submissions</div>

                {submissions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: T.textDim }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>🖥️</div>
                        <p style={{ fontSize: 14, margin: 0 }}>No submissions yet — go solve a problem!</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    {['#', 'Language', 'Status', 'Runtime', 'Memory', 'Date'].map(h => (
                                        <th key={h} style={{ padding: '0 16px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.slice(0, 10).map((s, i) => {
                                    const st = STATUS_MAP[s.status] || STATUS_MAP['Pending'];
                                    return (
                                        <tr
                                            key={s._id}
                                            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '14px 16px', fontSize: 12, color: T.textDim, fontFamily: 'monospace' }}>{i + 1}</td>
                                            <td style={{ padding: '14px 16px', fontSize: 13, color: T.textSecondary, fontWeight: 500 }}>{s.language}</td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{
                                                    display: 'inline-block', padding: '4px 12px',
                                                    background: st.bg, border: `1px solid ${st.border}`,
                                                    color: st.color, fontSize: 12, fontWeight: 600,
                                                    borderRadius: 100,
                                                }}>{s.status}</span>
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: 12, color: T.textMuted, fontFamily: 'monospace' }}>
                                                {s.runtime != null ? `${s.runtime} ms` : '—'}
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: 12, color: T.textMuted, fontFamily: 'monospace' }}>
                                                {s.memory != null ? `${s.memory} KB` : '—'}
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: 12, color: T.textDim }}>
                                                {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* ── Account Settings ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginTop: 20 }}>

                {/* Change Password */}
                <div style={card}>
                    <div style={label}>Change Password</div>

                    {cpMsg && (
                        <div style={{
                            padding: '10px 16px', borderRadius: 10, fontSize: 13,
                            marginBottom: 20,
                            background: cpMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                            border: `1px solid ${cpMsg.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
                            color: cpMsg.type === 'success' ? '#10b981' : '#f87171',
                        }}>
                            {cpMsg.text}
                        </div>
                    )}

                    <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { key: 'current', label_: 'Current Password',  placeholder: '••••••••' },
                            { key: 'next',    label_: 'New Password',       placeholder: 'Min. 6 characters' },
                            { key: 'confirm', label_: 'Confirm New Password', placeholder: '••••••••' },
                        ].map(({ key, label_, placeholder }) => (
                            <div key={key}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 8 }}>
                                    {label_}
                                </label>
                                <input
                                    type="password"
                                    required
                                    placeholder={placeholder}
                                    value={cpForm[key]}
                                    onChange={e => setCpForm(prev => ({ ...prev, [key]: e.target.value }))}
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        background: 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${
                                            key === 'confirm' && cpForm.confirm && cpForm.confirm !== cpForm.next
                                                ? 'rgba(244,63,94,0.5)'
                                                : 'rgba(255,255,255,0.09)'
                                        }`,
                                        borderRadius: 10, color: T.textPrimary,
                                        fontSize: 14, padding: '11px 16px',
                                        outline: 'none', fontFamily: 'inherit',
                                        transition: 'border-color 0.15s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                                    onBlur={e => {
                                        e.target.style.borderColor =
                                            key === 'confirm' && cpForm.confirm && cpForm.confirm !== cpForm.next
                                                ? 'rgba(244,63,94,0.5)'
                                                : 'rgba(255,255,255,0.09)';
                                    }}
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={cpLoading}
                            style={{
                                marginTop: 4,
                                padding: '12px',
                                background: cpLoading ? 'rgba(16,185,129,0.4)' : '#10b981',
                                border: 'none', borderRadius: 10,
                                color: '#070d1a', fontSize: 14, fontWeight: 700,
                                cursor: cpLoading ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { if (!cpLoading) { e.target.style.background = '#34d399'; e.target.style.boxShadow = '0 6px 20px rgba(16,185,129,0.3)'; }}}
                            onMouseLeave={e => { if (!cpLoading) { e.target.style.background = '#10b981'; e.target.style.boxShadow = 'none'; }}}
                        >
                            {cpLoading ? 'Updating…' : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* Log Out */}
                <div style={{ ...card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={label}>Session</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 13, fontWeight: 900, color: '#070d1a', flexShrink: 0,
                            }}>OC</div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary }}>{user?.username}</div>
                                <div style={{ fontSize: 12, color: T.textMuted }}>{user?.email}</div>
                            </div>
                        </div>
                        <div style={{
                            fontSize: 12, color: T.textMuted,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 8, padding: '10px 14px',
                            lineHeight: 1.6,
                        }}>
                            Your session is protected by JWT rotation. Logging out invalidates your current access token.
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            marginTop: 24,
                            width: '100%', padding: '13px',
                            background: 'rgba(244,63,94,0.1)',
                            border: '1px solid rgba(244,63,94,0.2)',
                            borderRadius: 10,
                            color: '#f87171', fontSize: 14, fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.target.style.background = 'rgba(244,63,94,0.18)'; e.target.style.borderColor = 'rgba(244,63,94,0.4)'; }}
                        onMouseLeave={e => { e.target.style.background = 'rgba(244,63,94,0.1)';  e.target.style.borderColor = 'rgba(244,63,94,0.2)'; }}
                    >
                        Log Out
                    </button>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
