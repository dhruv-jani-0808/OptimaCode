import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const T = {
    card: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.07)',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#475569',
};

const DIFF_STYLE = {
    Easy:   { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.25)' },
    Medium: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
    Hard:   { bg: 'rgba(244,63,94,0.12)',  color: '#f87171', border: 'rgba(244,63,94,0.25)'  },
};

const ALL_TOPICS = ['Array','Hash Table','String','Sliding Window','Dynamic Programming','Graph','Tree','Binary Search'];

const Problems = () => {
    const [problems,    setProblems]    = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);
    const [search,      setSearch]      = useState('');
    const [diffFilter,  setDiffFilter]  = useState('All');
    const [topicFilter, setTopicFilter] = useState('All');

    useEffect(() => {
        const fetch_ = async () => {
            try {
                const res = await API.get('/problems');
                setProblems(Array.isArray(res.data) ? res.data : res.data.problems || []);
            } catch {
                setError('Failed to load problems. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetch_();
    }, []);

    const filtered = problems.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchDiff   = diffFilter  === 'All' || p.difficulty === diffFilter;
        const matchTopic  = topicFilter === 'All' || (p.topic && p.topic.includes(topicFilter));
        return matchSearch && matchDiff && matchTopic;
    });

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 36, height: 36, border: '3px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                <p style={{ color: T.textMuted, fontSize: 13 }}>Loading problems…</p>
            </div>
        </div>
    );

    const inputStyle = {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 10,
        color: T.textPrimary,
        fontSize: 13,
        padding: '10px 16px',
        outline: 'none',
        fontFamily: 'inherit',
        transition: 'border-color 0.15s',
    };

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px', animation: 'fade-in 0.35s ease-out' }}>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: T.textPrimary, margin: '0 0 6px', letterSpacing: '-0.02em' }}>Problem Set</h1>
                <p style={{ fontSize: 14, color: T.textMuted, margin: 0 }}>
                    Select a challenge to open the workspace and start coding.
                </p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="🔍  Search problems…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ ...inputStyle, flex: 1, minWidth: 200 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                />
                <select
                    value={diffFilter}
                    onChange={e => setDiffFilter(e.target.value)}
                    style={{ ...inputStyle, minWidth: 150, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                <select
                    value={topicFilter}
                    onChange={e => setTopicFilter(e.target.value)}
                    style={{ ...inputStyle, minWidth: 165, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                >
                    <option value="All">All Topics</option>
                    {ALL_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {error && (
                <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f87171', padding: '12px 18px', borderRadius: 10, fontSize: 13, marginBottom: 20 }}>
                    {error}
                </div>
            )}

            {/* Table card */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                            {['#', 'Title', 'Difficulty', 'Topics', 'Action'].map((h, i) => (
                                <th key={h} style={{
                                    padding: '14px 20px',
                                    textAlign: i === 4 ? 'right' : 'left',
                                    fontSize: 11, fontWeight: 700, color: T.textMuted,
                                    textTransform: 'uppercase', letterSpacing: '0.08em',
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '60px 24px', textAlign: 'center', color: T.textMuted, fontSize: 14 }}>
                                    {problems.length === 0
                                        ? '⚠️ No problems in database yet.'
                                        : '🔍 No problems match your current filters.'}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((p, i) => {
                                const ds = DIFF_STYLE[p.difficulty] || DIFF_STYLE.Medium;
                                return (
                                    <tr
                                        key={p._id}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '16px 20px', fontSize: 12, color: T.textMuted, fontFamily: 'monospace', width: 48 }}>{i + 1}</td>
                                        <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 600, color: T.textPrimary }}>{p.title}</td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '4px 12px',
                                                background: ds.bg, border: `1px solid ${ds.border}`,
                                                color: ds.color, fontSize: 12, fontWeight: 700,
                                                borderRadius: 100,
                                            }}>{p.difficulty}</span>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                {(p.topic || []).slice(0, 3).map(tag => (
                                                    <span key={tag} style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.06)', color: '#64748b', fontSize: 11, fontWeight: 500, borderRadius: 6 }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                            <Link
                                                to={`/workspace/${p._id}`}
                                                style={{
                                                    textDecoration: 'none',
                                                    display: 'inline-block',
                                                    padding: '8px 18px',
                                                    background: '#10b981',
                                                    color: '#070d1a',
                                                    fontSize: 12, fontWeight: 700,
                                                    borderRadius: 8,
                                                    transition: 'all 0.15s',
                                                }}
                                                onMouseEnter={e => { e.target.style.background = '#34d399'; e.target.style.boxShadow = '0 4px 16px rgba(16,185,129,0.3)'; }}
                                                onMouseLeave={e => { e.target.style.background = '#10b981'; e.target.style.boxShadow = 'none'; }}
                                            >
                                                Solve →
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer count */}
            <div style={{ textAlign: 'right', marginTop: 12, fontSize: 12, color: T.textMuted }}>
                Showing {filtered.length} of {problems.length} problems
            </div>
        </div>
    );
};

export default Problems;