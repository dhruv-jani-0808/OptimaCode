import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate         = useNavigate();
    const location         = useLocation();

    const NAV_ITEMS = [
        { label: 'Home',     to: '/' },
        { label: 'Problems', to: '/problems' },
        { label: 'About Us', to: '/about' },
    ];

    const isActive = (to) =>
        to === '/' ? location.pathname === '/' : location.pathname === to;

    const navLinkStyle = (to) => ({
        display: 'inline-block',
        textDecoration: 'none',
        padding: '7px 16px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: isActive(to) ? 700 : 500,
        color: isActive(to) ? '#070d1a' : '#94a3b8',
        background: isActive(to) ? '#10b981' : 'transparent',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
    });

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            height: 60,
            background: 'rgba(7,13,26,0.90)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
            {/*
              3-column grid:
                Col 1 (flex-start): Logo
                Col 2 (center):     Nav links  ← truly centered
                Col 3 (flex-end):   Auth area
            */}
            <div style={{
                maxWidth: 1200,
                width: '100%',
                height: '100%',
                margin: '0 auto',
                padding: '0 24px',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: 16,
            }}>

                {/* ── Col 1: Logo ── */}
                <Link to="/" style={{
                    textDecoration: 'none',
                    fontWeight: 900,
                    fontSize: 16,
                    letterSpacing: '0.08em',
                    color: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    userSelect: 'none',
                    justifySelf: 'start',
                }}>
                    <span style={{ color: '#10b981', fontSize: 18 }}>&lt;/&gt;</span>
                    OPTIMA<span style={{ color: '#10b981' }}>CODE</span>
                </Link>

                {/* ── Col 2: Nav links (naturally centered) ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {NAV_ITEMS.map(({ label, to }) => (
                        <Link
                            key={to}
                            to={to}
                            style={navLinkStyle(to)}
                            onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.color = '#f1f5f9'; }}
                            onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.color = '#94a3b8'; }}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* ── Col 3: Auth area ── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    justifySelf: 'end',
                }}>
                    {user ? (
                        <>
                            {/* Greeting */}
                            <span style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>
                                Hey,{' '}
                                <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{user.username}</span>
                            </span>

                            {/* OC Avatar → Dashboard */}
                            <Link
                                to="/dashboard"
                                title="Open Dashboard"
                                style={{
                                    width: 36, height: 36,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontWeight: 900, color: '#070d1a',
                                    textDecoration: 'none',
                                    flexShrink: 0,
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    boxShadow: location.pathname === '/dashboard'
                                        ? '0 0 0 2px #10b981, 0 0 14px rgba(16,185,129,0.4)'
                                        : '0 0 0 2px rgba(16,185,129,0.35)',
                                    transition: 'box-shadow 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 2px #10b981, 0 0 18px rgba(16,185,129,0.45)'; }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.boxShadow = location.pathname === '/dashboard'
                                        ? '0 0 0 2px #10b981, 0 0 14px rgba(16,185,129,0.4)'
                                        : '0 0 0 2px rgba(16,185,129,0.35)';
                                }}
                            >
                                OC
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                style={{ textDecoration: 'none', fontSize: 13, fontWeight: 500, color: '#94a3b8', padding: '7px 12px', borderRadius: 8, transition: 'color 0.15s' }}
                                onMouseEnter={e => e.target.style.color = '#f1f5f9'}
                                onMouseLeave={e => e.target.style.color = '#94a3b8'}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                style={{
                                    textDecoration: 'none',
                                    fontSize: 13, fontWeight: 700,
                                    background: '#10b981',
                                    color: '#070d1a',
                                    padding: '8px 20px',
                                    borderRadius: 8,
                                    transition: 'all 0.15s',
                                    boxShadow: '0 4px 14px rgba(16,185,129,0.25)',
                                }}
                                onMouseEnter={e => { e.target.style.background = '#34d399'; e.target.style.boxShadow = '0 6px 20px rgba(16,185,129,0.35)'; }}
                                onMouseLeave={e => { e.target.style.background = '#10b981'; e.target.style.boxShadow = '0 4px 14px rgba(16,185,129,0.25)'; }}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;