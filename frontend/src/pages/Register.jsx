import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const Register = () => {
    const [username,        setUsername]        = useState('');
    const [email,           setEmail]           = useState('');
    const [password,        setPassword]        = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error,           setError]           = useState('');
    const [loading,         setLoading]         = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await API.post('/auth/register', { username, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const focusBorder = (e) => { e.target.style.borderColor = 'rgba(16,185,129,0.5)'; };
    const blurBorder  = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; };

    return (
        <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#070d1a' }}>
            {/* Glow */}
            <div style={{ position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(16,185,129,0.05) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

            <div style={{ width: '100%', maxWidth: 460, position: 'relative', animation: 'fade-in 0.35s ease-out' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '40px 36px' }}>

                    {/* Brand mark */}
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: '0.06em', color: '#f1f5f9', marginBottom: 8 }}>
                            <span style={{ color: '#10b981' }}>&lt;/&gt;</span> OPTIMA<span style={{ color: '#10b981' }}>CODE</span>
                        </div>
                        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Create Account</h2>
                        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
                            Join and start compiling answers
                        </p>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f87171', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 20 }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Username</label>
                            <input
                                type="text" required
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="coder_99"
                                style={inputStyle}
                                onFocus={focusBorder} onBlur={blurBorder}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Email Address</label>
                            <input
                                type="email" required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                style={inputStyle}
                                onFocus={focusBorder} onBlur={blurBorder}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Password</label>
                                <input
                                    type="password" required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={inputStyle}
                                    onFocus={focusBorder} onBlur={blurBorder}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Confirm</label>
                                <input
                                    type="password" required
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        ...inputStyle,
                                        borderColor: confirmPassword && confirmPassword !== password ? 'rgba(244,63,94,0.5)' : 'rgba(255,255,255,0.09)',
                                    }}
                                    onFocus={focusBorder} onBlur={blurBorder}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: 6,
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
                            onMouseEnter={e => { if (!loading) { e.target.style.background = '#34d399'; e.target.style.boxShadow = '0 6px 24px rgba(16,185,129,0.3)'; }}}
                            onMouseLeave={e => { if (!loading) { e.target.style.background = '#10b981'; e.target.style.boxShadow = 'none'; }}}
                        >
                            {loading ? 'Creating Account…' : 'Sign Up'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#64748b' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;