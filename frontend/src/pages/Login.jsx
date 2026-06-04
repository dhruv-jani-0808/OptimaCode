import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 10,
    color: '#f1f5f9',
    fontSize: 14,
    padding: '12px 16px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
};

const Login = () => {
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');
    const [error,    setError]    = useState('');
    const [loading,  setLoading]  = useState(false);

    const { login }  = useAuth();
    const navigate   = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await API.post('/auth/login', { email, password });
            const { accessToken, refreshToken, user: userData } = res.data;
            login(accessToken, refreshToken, userData);
            navigate('/problems');
        } catch {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#070d1a' }}>
            {/* Glow */}
            <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 400, background: 'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

            <div style={{ width: '100%', maxWidth: 420, position: 'relative', animation: 'fade-in 0.35s ease-out' }}>
                {/* Card */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '40px 36px' }}>

                    {/* Brand mark */}
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: '0.06em', color: '#f1f5f9', marginBottom: 8 }}>
                            <span style={{ color: '#10b981' }}>&lt;/&gt;</span> OPTIMA<span style={{ color: '#10b981' }}>CODE</span>
                        </div>
                        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Welcome back</h2>
                        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                            Log in to continue your coding streak
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f87171', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 20 }}>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Email Address</label>
                            <input
                                type="email" required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Password</label>
                            <input
                                type="password" required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.5)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: 4,
                                padding: '13px',
                                background: loading ? 'rgba(16,185,129,0.4)' : '#10b981',
                                border: 'none',
                                borderRadius: 10,
                                color: '#070d1a',
                                fontSize: 14, fontWeight: 800,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                fontFamily: 'inherit',
                                letterSpacing: '0.02em',
                            }}
                            onMouseEnter={e => { if (!loading) { e.target.style.background = '#34d399'; e.target.style.boxShadow = '0 6px 24px rgba(16,185,129,0.3)'; } }}
                            onMouseLeave={e => { if (!loading) { e.target.style.background = '#10b981'; e.target.style.boxShadow = 'none'; } }}
                        >
                            {loading ? 'Authenticating…' : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#64748b' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>
                            Create one here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;