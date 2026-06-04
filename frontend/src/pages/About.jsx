import { useState } from 'react';

const T = {
    card: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.07)',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#475569',
};

const VISION = [
    { title: 'Cloud-Native Execution',  body: 'Every submission runs in a fully isolated JDoodle cloud sandbox. Zero local setup — just write, submit, and see real results in under two seconds.',  accent: '#10b981' },
    { title: 'Language Flexibility',    body: 'We support Python, JavaScript (Node.js), Java, C, and C++ — the primary languages used in technical interviews and competitive programming.',           accent: '#f59e0b' },
    { title: 'Secure by Architecture',  body: 'JWT-based session management with auto-rotating access and refresh tokens keeps your account, submissions, and history protected at every layer.',     accent: '#f43f5e' },
    { title: 'Developer-First Design',  body: 'The Monaco Editor — the same engine powering VS Code — provides an IDE-grade coding experience directly in your browser, fully configured out-of-the-box.', accent: '#06b6d4' },
];

const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 10,
    color: '#f1f5f9',
    fontSize: 13,
    padding: '11px 16px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
};

const About = () => {
    const [form,      setForm]      = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#070d1a' }}>

            {/* ── HERO ── */}
            <section style={{ maxWidth: 800, margin: '0 auto', padding: '72px 24px 48px', textAlign: 'center', animation: 'fade-in 0.35s ease-out' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center',
                    background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                    color: '#f59e0b', fontSize: 11, fontWeight: 700,
                    padding: '7px 16px', borderRadius: 100,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    marginBottom: 28,
                }}>
                    Our Mission
                </div>
                <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, color: T.textPrimary, margin: '0 0 20px', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                    Redefining How Developers{' '}
                    <span style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        Practice
                    </span>
                </h1>
                <p style={{ fontSize: 16, color: T.textSecondary, lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
                    OptimaCode was born from a simple belief: every developer deserves a world-class coding arena without the noise.
                    We built a cloud-native execution engine wrapped in a minimal, focused interface — so you can spend less time configuring and more time solving.
                </p>
            </section>

            {/* ── VISION CARDS ── */}
            <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 72px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                    {VISION.map(({ title, body, accent }) => (
                        <div key={title} style={{
                            background: T.card,
                            border: `1px solid ${T.border}`,
                            borderLeft: `3px solid ${accent}`,
                            borderRadius: '0 16px 16px 0',
                            padding: '24px 28px',
                            transition: 'transform 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary, margin: '0 0 10px' }}>{title}</h3>
                            <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.7, margin: 0 }}>{body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CONTACT FORM ── */}
            <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 80px' }}>
                <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: '36px 40px' }}>
                    <h2 style={{ fontSize: 24, fontWeight: 900, color: T.textPrimary, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                        System Support
                    </h2>
                    <p style={{ fontSize: 13, color: T.textMuted, margin: '0 0 32px', lineHeight: 1.6 }}>
                        Encountered a bug? Have a feature suggestion? Drop us a message and our team will respond within 24 hours.
                    </p>

                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>
                                ✅
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary, margin: '0 0 8px' }}>Message Received!</h3>
                            <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>We'll respond to your query within 24 hours.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 8 }}>Full Name</label>
                                    <input
                                        type="text" required
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        placeholder="John Doe"
                                        style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.5)'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 8 }}>Email Address</label>
                                    <input
                                        type="email" required
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        placeholder="you@example.com"
                                        style={inputStyle}
                                        onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.5)'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: 8 }}>Message</label>
                                <textarea
                                    required rows={5}
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    placeholder="Describe your issue or suggestion in detail…"
                                    style={{ ...inputStyle, resize: 'none' }}
                                    onFocus={e => e.target.style.borderColor = 'rgba(245,158,11,0.5)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                                />
                            </div>
                            <button
                                type="submit"
                                style={{
                                    padding: '13px',
                                    background: '#f59e0b',
                                    border: 'none',
                                    borderRadius: 10,
                                    color: '#070d1a',
                                    fontSize: 14, fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontFamily: 'inherit',
                                }}
                                onMouseEnter={e => { e.target.style.background = '#fbbf24'; e.target.style.boxShadow = '0 6px 20px rgba(245,158,11,0.3)'; }}
                                onMouseLeave={e => { e.target.style.background = '#f59e0b'; e.target.style.boxShadow = 'none'; }}
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
};

export default About;
