import { Link } from 'react-router-dom';

const T = {
    bg: '#070d1a',
    card: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.07)',
    green: '#10b981',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#475569',
};

const FEATURES = [
    {
        icon: '⚡',
        title: 'Lightning Fast Evaluation',
        desc: 'Submissions are compiled and tested against hidden test cases in milliseconds. Real-time runtime and memory metrics powered by JDoodle cloud infrastructure.',
        color: '#10b981',
    },
    {
        icon: '🖥️',
        title: 'Monaco Editor Integration',
        desc: 'Code in the same editor powering VS Code. Syntax highlighting, autocomplete, and full language support for 5+ languages built directly into your browser.',
        color: '#f59e0b',
    },
    {
        icon: '🔐',
        title: 'Secure JWT Isolation',
        desc: 'Every session is protected by rotating JWT access and refresh tokens. Your submissions, history, and progress remain private and encrypted.',
        color: '#f43f5e',
    },
];

const STATS = [
    { value: '100+', label: 'Curated Problems' },
    { value: '5',    label: 'Languages Supported' },
    { value: '<2s',  label: 'Avg Execution Time' },
];

const Home = () => (
    <div style={{ background: '#070d1a', minHeight: '100vh' }}>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: '100px 24px 80px', textAlign: 'center' }}>
            {/* Glows */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: '60%', left: '20%', width: 350, height: 350, background: 'radial-gradient(ellipse, rgba(245,158,11,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
                {/* Status pill */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                    color: '#10b981', fontSize: 11, fontWeight: 700,
                    padding: '7px 16px', borderRadius: 100,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    marginBottom: 32,
                }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                    Cloud Execution Engine Active
                </div>

                {/* Headline */}
                <h1 style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 900, color: T.textPrimary, lineHeight: 1.1, margin: '0 0 20px', letterSpacing: '-0.03em' }}>
                    Master the Art of{' '}
                    <span style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        Competitive
                    </span>
                    <br />Syntax
                </h1>

                <p style={{ fontSize: 18, color: T.textSecondary, lineHeight: 1.7, margin: '0 auto 40px', maxWidth: 560 }}>
                    Sharpen your algorithms. Benchmark your logic. Dominate the leaderboard.
                    OptimaCode is the premium online judge built for developers who take their craft seriously.
                </p>

                {/* CTAs */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/problems" style={{
                        display: 'inline-block',
                        textDecoration: 'none',
                        padding: '14px 32px',
                        background: '#10b981',
                        color: '#070d1a',
                        fontWeight: 800, fontSize: 14,
                        borderRadius: 12,
                        letterSpacing: '0.02em',
                        boxShadow: '0 8px 32px rgba(16,185,129,0.3)',
                        transition: 'all 0.2s',
                    }}>
                        Start Coding Now →
                    </Link>
                    <Link to="/about" style={{
                        display: 'inline-block',
                        textDecoration: 'none',
                        padding: '14px 32px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: T.textSecondary,
                        fontWeight: 600, fontSize: 14,
                        borderRadius: 12,
                        transition: 'all 0.2s',
                    }}>
                        Learn More
                    </Link>
                </div>
            </div>
        </section>

        {/* ── STATS BAR ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ maxWidth: 700, margin: '0 auto', padding: '36px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, textAlign: 'center' }}>
                {STATS.map(({ value, label }) => (
                    <div key={label}>
                        <div style={{ fontSize: 36, fontWeight: 900, color: T.textPrimary, lineHeight: 1 }}>{value}</div>
                        <div style={{ fontSize: 13, color: T.textMuted, marginTop: 6 }}>{label}</div>
                    </div>
                ))}
            </div>
        </div>

        {/* ── FEATURES BENTO ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: T.textPrimary, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                    The Platform. <span style={{ color: '#10b981' }}>Engineered.</span>
                </h2>
                <p style={{ fontSize: 15, color: T.textMuted, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                    Every feature was designed from the ground up to help you write better code, faster. No fluff — just raw tooling.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {FEATURES.map(({ icon, title, desc, color }) => (
                    <div key={title} style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 20,
                        padding: 32,
                        transition: 'transform 0.2s, border-color 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${color}40`; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                    >
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>
                            {icon}
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: T.textPrimary, margin: '0 0 10px' }}>{title}</h3>
                        <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.7, margin: 0 }}>{desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
                    {/* Brand */}
                    <div>
                        <div style={{ fontWeight: 900, fontSize: 16, color: T.textPrimary, letterSpacing: '0.08em', marginBottom: 12 }}>
                            <span style={{ color: '#10b981' }}>&lt;/&gt;</span> OPTIMA<span style={{ color: '#10b981' }}>CODE</span>
                        </div>
                        <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.7, maxWidth: 280, margin: '0 0 16px' }}>
                            A premium, cloud-based online judge platform for developers who code with precision and purpose.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                            <span style={{ fontSize: 12, color: T.textMuted }}>All systems operational</span>
                        </div>
                    </div>

                    {/* Platform */}
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Platform</div>
                        {[['Problems', '/problems'], ['Dashboard', '/dashboard'], ['About', '/about']].map(([l, to]) => (
                            <div key={l} style={{ marginBottom: 10 }}>
                                <Link to={to} style={{ fontSize: 13, color: T.textMuted, textDecoration: 'none', transition: 'color 0.15s' }}
                                    onMouseEnter={e => e.target.style.color = T.textSecondary}
                                    onMouseLeave={e => e.target.style.color = T.textMuted}
                                >{l}</Link>
                            </div>
                        ))}
                    </div>

                    {/* Support */}
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Support</div>
                        {['API Docs', 'Contact Us', 'Report a Bug', 'Changelog'].map(item => (
                            <div key={item} style={{ fontSize: 13, color: T.textMuted, marginBottom: 10, cursor: 'pointer' }}>{item}</div>
                        ))}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <span style={{ fontSize: 12, color: '#1e293b' }}>© 2025 OptimaCode. All rights reserved.</span>
                    <span style={{ fontSize: 12, color: '#1e293b' }}>Built with React + Express + MongoDB Atlas</span>
                </div>
            </div>
        </footer>
    </div>
);

export default Home;
