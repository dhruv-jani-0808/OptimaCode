import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import API from '../services/api';

/* ── Design tokens ─────────────────────────────────────────── */
const DIFF_STYLE = {
    Easy:   { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
    Medium: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
    Hard:   { bg: 'rgba(244,63,94,0.15)',  color: '#f87171', border: 'rgba(244,63,94,0.3)'  },
};

const LANG_MONACO_MAP = {
    javascript: 'javascript',
    python:     'python',
};

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript (Node)' },
    { value: 'python',     label: 'Python 3'          },
];

/* ── Result parser ─────────────────────────────────────────── */
const parseResult = (submission) => {
    const accepted = submission.status === 'Accepted';
    return {
        accepted,
        status:  submission.status,
        runtime: submission.runtime ?? null,
        memory:  submission.memory  ?? null,
        stdout:  submission.stdout  || null,
        stderr:  submission.stderr  || null,
    };
};

/* ─────────────────────────────────────────────────────────── */
const Workspace = () => {
    const { problemId }  = useParams();
    const [problem,      setProblem]    = useState(null);
    const [language,     setLanguage]   = useState('javascript');
    const [code,         setCode]       = useState('// Write your solution here...\n');
    const [leftTab,      setLeftTab]    = useState('problem'); // 'problem' | 'editorial'
    const [result,       setResult]     = useState(null);   // null | parsed result object
    const [status,       setStatus]     = useState('idle'); // 'idle' | 'loading' | 'running' | 'done' | 'error'
    const [loading,      setLoading]    = useState(true);

    /* ── Fetch problem ── */
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res  = await API.get(`/problems/${problemId}`);
                const data = res.data.problem || res.data;
                setProblem(data);
                if (data.boilerplate?.[language]) {
                    setCode(data.boilerplate[language]);
                }
            } catch {
                setStatus('error');
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [problemId]);

    /* ── Language change ── */
    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setLanguage(lang);
        if (problem?.boilerplate?.[lang]) {
            setCode(problem.boilerplate[lang]);
        } else {
            setCode(`// ${lang} solution\n`);
        }
    };

    /* ── Submit ── */
    const handleSubmit = async () => {
        setStatus('running');
        setResult(null);
        try {
            const res = await API.post('/submissions', { problemId, language, code });
            setResult(parseResult(res.data.submission));
            setStatus('done');
        } catch {
            setStatus('error');
        }
    };

    /* ── Loading screen ── */
    if (loading) return (
        <div style={{ height: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070d1a' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 36, height: 36, border: '3px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                <p style={{ color: '#475569', fontSize: 13 }}>Loading problem…</p>
            </div>
        </div>
    );

    const diff = DIFF_STYLE[problem?.difficulty] || DIFF_STYLE.Medium;

    return (
        <div style={{
            display: 'flex',
            height: 'calc(100vh - 60px)',
            width: '100%',
            overflow: 'hidden',
            background: '#070d1a',
            color: '#f1f5f9',
            fontFamily: 'Inter, system-ui, sans-serif',
        }}>

            {/* ════════════════════════════════════════════
                LEFT PANEL — Problem Details & Editorial
            ════════════════════════════════════════════ */}
            <div style={{
                width: '42%',
                minWidth: 340,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid rgba(255,255,255,0.07)',
                background: '#0a1120',
            }}>
                {/* ── Left Panel Tabs ── */}
                <div style={{
                    display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.015)'
                }}>
                    <button
                        onClick={() => setLeftTab('problem')}
                        style={{
                            flex: 1, padding: '12px', background: 'transparent', border: 'none',
                            borderBottom: leftTab === 'problem' ? '2px solid #10b981' : '2px solid transparent',
                            color: leftTab === 'problem' ? '#f1f5f9' : '#94a3b8',
                            fontSize: 12, fontWeight: leftTab === 'problem' ? 700 : 500,
                            textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.15s'
                        }}
                    >
                        Problem
                    </button>
                    <button
                        onClick={() => setLeftTab('editorial')}
                        style={{
                            flex: 1, padding: '12px', background: 'transparent', border: 'none',
                            borderBottom: leftTab === 'editorial' ? '2px solid #10b981' : '2px solid transparent',
                            color: leftTab === 'editorial' ? '#f1f5f9' : '#94a3b8',
                            fontSize: 12, fontWeight: leftTab === 'editorial' ? 700 : 500,
                            textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.15s'
                        }}
                    >
                        Editorial Code
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 40px' }}>
                    {leftTab === 'problem' ? (
                        <>
                            {/* ── Difficulty badge ── */}
                    <div style={{ marginBottom: 14 }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            background: diff.bg,
                            border: `1px solid ${diff.border}`,
                            color: diff.color,
                            fontSize: 11, fontWeight: 800,
                            borderRadius: 100,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                        }}>
                            {problem?.difficulty || 'Medium'}
                        </span>
                    </div>

                    {/* ── Title ── */}
                    <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', margin: '0 0 20px', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
                        {problem?.title || 'Untitled Problem'}
                    </h1>

                    {/* ── Description ── */}
                    <div style={{
                        fontSize: 14, color: '#94a3b8', lineHeight: 1.8,
                        marginBottom: 28, whiteSpace: 'pre-line',
                    }}>
                        {problem?.description || 'No description provided.'}
                    </div>

                    {/* ── Sample Test Cases ── */}
                    {problem?.examples?.length > 0 && (
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
                                Sample Test Cases
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {problem.examples.map((ex, i) => (
                                    <div key={i} style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                    }}>
                                        {/* Case header */}
                                        <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                                Example {i + 1}
                                            </span>
                                        </div>
                                        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {/* Input */}
                                            <div>
                                                <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Input</div>
                                                <div style={{
                                                    background: '#070d1a',
                                                    border: '1px solid rgba(255,255,255,0.06)',
                                                    borderRadius: 8,
                                                    padding: '10px 14px',
                                                    fontFamily: '"Fira Code", "Cascadia Code", monospace',
                                                    fontSize: 13, color: '#94a3b8',
                                                    whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                                                }}>
                                                    {ex.input}
                                                </div>
                                            </div>
                                            {/* Output */}
                                            <div>
                                                <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Output</div>
                                                <div style={{
                                                    background: '#070d1a',
                                                    border: '1px solid rgba(16,185,129,0.15)',
                                                    borderRadius: 8,
                                                    padding: '10px 14px',
                                                    fontFamily: '"Fira Code", "Cascadia Code", monospace',
                                                    fontSize: 13, color: '#10b981',
                                                    whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                                                }}>
                                                    {ex.output}
                                                </div>
                                            </div>
                                            {/* Explanation */}
                                            {ex.explanation && (
                                                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                                                    <span style={{ fontWeight: 600, color: '#475569' }}>Explanation: </span>
                                                    {ex.explanation}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Complexity ── */}
                    {(problem?.timeComplexity || problem?.spaceComplexity) && (
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
                                Expected Complexity
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                {problem.timeComplexity && (
                                    <div style={{
                                        flex: 1, background: 'rgba(245,158,11,0.06)',
                                        border: '1px solid rgba(245,158,11,0.15)',
                                        borderRadius: 10, padding: '12px 16px',
                                    }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Time</div>
                                        <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#f59e0b' }}>{problem.timeComplexity}</div>
                                    </div>
                                )}
                                {problem.spaceComplexity && (
                                    <div style={{
                                        flex: 1, background: 'rgba(6,182,212,0.06)',
                                        border: '1px solid rgba(6,182,212,0.15)',
                                        borderRadius: 10, padding: '12px 16px',
                                    }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#164e63', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Space</div>
                                        <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#06b6d4' }}>{problem.spaceComplexity}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Topics ── */}
                    {problem?.topic?.length > 0 && (
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                                Topics
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {problem.topic.map(tag => (
                                    <span key={tag} style={{
                                        padding: '5px 12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.09)',
                                        borderRadius: 8,
                                        fontSize: 12, fontWeight: 500,
                                        color: '#64748b',
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                        </>
                    ) : (
                        <>
                            {/* ── Editorial Tab ── */}
                            <div style={{ marginBottom: 20 }}>
                                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px' }}>Editorial Solution</h2>
                                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                                    Here is the optimal approach for <span style={{ color: '#f59e0b', fontWeight: 600 }}>{problem?.title}</span> in your selected language.
                                </p>
                            </div>

                            {/* Complexity quick stats if available */}
                            {(problem?.timeComplexity || problem?.spaceComplexity) && (
                                <div style={{ display: 'flex', gap: 12, marginBottom: 24, padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Time Complexity</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace', marginTop: 4 }}>{problem.timeComplexity || '—'}</div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Space Complexity</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#06b6d4', fontFamily: 'monospace', marginTop: 4 }}>{problem.spaceComplexity || '—'}</div>
                                    </div>
                                </div>
                            )}

                            {/* Editorial Code Viewer */}
                            {problem?.editorialCode && problem.editorialCode[language] ? (
                                <div style={{
                                    background: '#070d1a',
                                    border: '1px solid rgba(16,185,129,0.2)',
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                }}>
                                    <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(16,185,129,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                                        <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                            {LANGUAGES.find(l => l.value === language)?.label || language} Solution
                                        </span>
                                    </div>
                                    <div style={{ padding: '16px', overflowX: 'auto' }}>
                                        <pre style={{
                                            margin: 0,
                                            fontFamily: '"Fira Code", "Cascadia Code", monospace',
                                            fontSize: 13,
                                            lineHeight: 1.6,
                                            color: '#e2e8f0',
                                        }}>
                                            {problem.editorialCode[language]}
                                        </pre>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ padding: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <p style={{ color: '#94a3b8', fontSize: 13 }}>No editorial code available for this language yet.</p>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </div>

            {/* ════════════════════════════════════════════
                RIGHT PANEL — Editor + Console
            ════════════════════════════════════════════ */}
            <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', background: '#0d1626', minWidth: 0 }}>

                {/* ── Editor toolbar ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 18px',
                    background: 'rgba(255,255,255,0.02)',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    gap: 12, flexShrink: 0,
                }}>
                    {/* Language select */}
                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8, color: '#f1f5f9',
                            fontSize: 12, fontWeight: 600,
                            padding: '7px 12px',
                            outline: 'none', cursor: 'pointer',
                            fontFamily: 'inherit',
                        }}
                    >
                        {LANGUAGES.map(({ value, label }) => (
                            <option key={value} value={value} style={{ background: '#0a1120', color: '#f1f5f9' }}>
                                {label}
                            </option>
                        ))}
                    </select>

                    {/* Status indicator + Submit button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {status === 'running' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#f59e0b' }}>
                                <div style={{ width: 14, height: 14, border: '2px solid rgba(245,158,11,0.3)', borderTopColor: '#f59e0b', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                Running…
                            </div>
                        )}
                        {status === 'done' && result && (
                            <div style={{
                                fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 8,
                                background: result.accepted ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
                                border: `1px solid ${result.accepted ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`,
                                color: result.accepted ? '#10b981' : '#f87171',
                            }}>
                                {result.accepted ? '✓ Accepted' : '✗ ' + result.status}
                            </div>
                        )}
                        <button
                            onClick={handleSubmit}
                            disabled={status === 'running'}
                            style={{
                                padding: '8px 22px',
                                background: status === 'running' ? 'rgba(16,185,129,0.35)' : '#10b981',
                                border: 'none', borderRadius: 9,
                                color: '#070d1a', fontSize: 13, fontWeight: 800,
                                cursor: status === 'running' ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit', transition: 'all 0.15s',
                                boxShadow: status === 'running' ? 'none' : '0 4px 14px rgba(16,185,129,0.25)',
                            }}
                            onMouseEnter={e => { if (status !== 'running') { e.target.style.background = '#34d399'; e.target.style.boxShadow = '0 6px 20px rgba(16,185,129,0.35)'; }}}
                            onMouseLeave={e => { if (status !== 'running') { e.target.style.background = '#10b981'; e.target.style.boxShadow = '0 4px 14px rgba(16,185,129,0.25)'; }}}
                        >
                            {status === 'running' ? 'Running…' : 'Submit Code'}
                        </button>
                    </div>
                </div>

                {/* ── Monaco Editor ── */}
                <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                    <Editor
                        height="100%"
                        language={LANG_MONACO_MAP[language] || language}
                        theme="vs-dark"
                        value={code}
                        onChange={(v) => setCode(v || '')}
                        options={{
                            minimap:          { enabled: false },
                            fontSize:         14,
                            lineHeight:       22,
                            automaticLayout:  true,
                            tabSize:          4,
                            scrollBeyondLastLine: false,
                            renderLineHighlight: 'line',
                            padding:          { top: 16 },
                            fontFamily:       '"Fira Code", "Cascadia Code", monospace',
                            fontLigatures:    true,
                        }}
                    />
                </div>

                {/* ── Console / Result Terminal ── */}
                <div style={{
                    height: 220, flexShrink: 0,
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', flexDirection: 'column',
                    background: '#070d1a',
                }}>
                    {/* Terminal header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 18px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        background: 'rgba(255,255,255,0.02)',
                        flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: 6 }}>
                                Console Output
                            </span>
                        </div>
                        {result && (
                            <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#334155' }}>
                                {result.runtime != null && <span>Runtime: <span style={{ color: '#f59e0b', fontFamily: 'monospace', fontWeight: 700 }}>{result.runtime} ms</span></span>}
                                {result.memory  != null && <span>Memory:  <span style={{ color: '#06b6d4', fontFamily: 'monospace', fontWeight: 700 }}>{result.memory} KB</span></span>}
                            </div>
                        )}
                    </div>

                    {/* Terminal body */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', fontFamily: '"Fira Code", "Cascadia Code", monospace', fontSize: 12, lineHeight: 1.7 }}>
                        {status === 'idle' && (
                            <span style={{ color: '#334155' }}>Your code output and test results will appear here after submitting.</span>
                        )}
                        {status === 'running' && (
                            <span style={{ color: '#f59e0b' }}>⏳ Compiling and running test cases…</span>
                        )}
                        {status === 'error' && !result && (
                            <span style={{ color: '#f87171' }}>⚠ An error occurred while submitting. Please try again.</span>
                        )}
                        {status === 'done' && result && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ color: result.accepted ? '#10b981' : '#f87171', fontWeight: 700, fontSize: 13 }}>
                                    {result.accepted ? '✓ All test cases passed!' : '✗ ' + result.status}
                                </div>
                                {result.stdout && (
                                    <div>
                                        <span style={{ color: '#475569' }}>stdout: </span>
                                        <span style={{ color: '#94a3b8' }}>{result.stdout}</span>
                                    </div>
                                )}
                                {result.stderr && (
                                    <div>
                                        <span style={{ color: '#f87171' }}>stderr: </span>
                                        <span style={{ color: '#fca5a5' }}>{result.stderr}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Workspace;