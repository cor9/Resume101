// Conversational chat-style guided flow + AI-powered "Ask Corey" mode.
const { useState: useStateChat, useEffect: useEffectChat, useRef: useRefChat } = React;

const CHAT_FLOW = [
  { key: 'name', q: "Hi! I'm here to help build your child's actor resume. What's their full name as it should appear on the resume?", path: ['actor', 'name'] },
  { key: 'union', q: "What's their union status?", path: ['actor', 'union'], options: ["Non-Union", "SAG-Eligible", "SAG-AFTRA", "AEA", "Financial Core"] },
  { key: 'height', q: "Their current height? (e.g. 4'8\")", path: ['actor', 'height'] },
  { key: 'dob', q: "What is your actor's date of birth? (appears on the resume)", path: ['actor', 'dob'], inputType: 'date' },
  { key: 'hair', q: "Hair color?", path: ['actor', 'hair'] },
  { key: 'eyes', q: "Eye color?", path: ['actor', 'eyes'] },
  { key: 'rep_yn', q: "Do they have representation (an agent or manager)?", options: ["Yes", "No"] },
  { key: 'tv_yn', q: "Any television credits to add now? You can always add more later in the form panel.", options: ["Skip — keep demo", "Start fresh"] },
  { key: 'done', q: null }, // handled by AiChat below
];

function TipCard({ tip }) {
  const [open, setOpen] = useStateChat(false);
  return (
    <div style={{
      border: '1px solid rgba(212,184,118,.25)',
      borderRadius: 4, marginTop: 6,
      background: 'rgba(212,184,118,.04)',
      overflow: 'hidden',
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', textAlign: 'left', background: 'transparent',
        border: 'none', color: '#d4b876', padding: '7px 10px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'Manrope, sans-serif', fontSize: 11.5, lineHeight: 1.3,
      }}>
        <span style={{ fontSize: 9, opacity: .7 }}>{open ? '▼' : '▶'}</span>
        <span style={{ fontStyle: 'italic' }}>{tip.q}</span>
      </button>
      {open && (
        <div style={{
          padding: '0 12px 10px 28px', fontSize: 11.5,
          color: 'rgba(232,223,202,.85)', lineHeight: 1.5,
        }}>{tip.a}</div>
      )}
    </div>
  );
}

// ─── AI Chat (post guided-flow) ────────────────────────────────────────────────
function AiChat({ data, onSwitchToForm }) {
  const actorName = data.actor.name || 'your actor';
  const [messages, setMessages] = useStateChat([{
    role: 'assistant',
    content: `${actorName}'s resume is looking great in the preview. Feel free to ask me any industry questions — union status, credits, headshots, training, representation — or switch to the form editor to add more credits.`,
  }]);
  const [input, setInput] = useStateChat('');
  const [loading, setLoading] = useStateChat(false);
  const scrollerRef = useRefChat(null);

  useEffectChat(() => {
    scrollerRef.current?.scrollTo({ top: 9999, behavior: 'smooth' });
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, actorName: data.actor.name }),
      });
      const { content, error } = await res.json();
      setMessages(m => [...m, {
        role: 'assistant',
        content: content || error || "I'm having trouble connecting — try again in a moment.",
      }]);
    } catch {
      setMessages(m => [...m, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Switch to the form editor to keep building.",
      }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '10px 18px 8px',
        borderBottom: '1px solid rgba(212,184,118,.12)',
        background: 'rgba(212,184,118,.05)',
      }}>
        <div style={{ fontSize: 8.5, letterSpacing: 2.5, color: '#d4b876', fontFamily: 'JetBrains Mono, monospace' }}>
          ASK COREY — INDUSTRY Q&A
        </div>
        <div style={{ fontSize: 10.5, color: 'rgba(232,223,202,.5)', marginTop: 2 }}>
          Powered by Child Actor 101 knowledge base
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollerRef} style={{ flex: 1, overflow: 'auto', padding: '16px 18px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 10, marginBottom: 14, alignItems: 'flex-start',
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                background: `center/cover no-repeat url(assets/101logo.jpeg)`,
                border: '1px solid rgba(212,184,118,.35)',
              }} />
            )}
            <div style={{
              maxWidth: '80%',
              background: msg.role === 'user' ? 'var(--burgundy-2)' : 'rgba(255,255,255,.04)',
              border: msg.role === 'user' ? 'none' : '1px solid rgba(212,184,118,.15)',
              padding: '9px 13px',
              borderRadius: msg.role === 'user' ? '10px 10px 0 10px' : '0 10px 10px 10px',
              fontSize: 13, lineHeight: 1.5, color: '#f5efe3',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
              background: `center/cover no-repeat url(assets/101logo.jpeg)`,
              border: '1px solid rgba(212,184,118,.35)',
            }} />
            <div style={{
              background: 'rgba(255,255,255,.04)', border: '1px solid rgba(212,184,118,.15)',
              padding: '9px 13px', borderRadius: '0 10px 10px 10px',
              fontSize: 13, color: 'rgba(232,223,202,.4)', fontStyle: 'italic',
            }}>Thinking…</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid rgba(212,184,118,.15)', padding: 12, background: 'rgba(0,0,0,.2)' }}>
        <form onSubmit={send} style={{ display: 'flex', gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} autoFocus
            placeholder="Ask about credits, union status, headshots…"
            style={{
              flex: 1, background: 'rgba(255,255,255,.05)',
              border: '1px solid rgba(212,184,118,.3)', color: '#f5efe3',
              padding: '10px 12px', borderRadius: 4, outline: 'none',
              fontFamily: 'Manrope, sans-serif', fontSize: 13,
            }} />
          <button type="submit" disabled={loading || !input.trim()} style={{
            padding: '10px 16px', background: loading ? 'rgba(107,31,42,.5)' : 'var(--burgundy)',
            border: '1px solid var(--burgundy-soft)', color: '#fff',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1.5,
            cursor: loading ? 'default' : 'pointer', borderRadius: 4, textTransform: 'uppercase',
          }}>Ask</button>
        </form>
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <button onClick={onSwitchToForm} style={{
            background: 'transparent', border: 'none',
            color: 'rgba(212,184,118,.7)', cursor: 'pointer',
            textDecoration: 'underline', fontSize: 10,
            fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1,
          }}>open full editor →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Guided flow panel ─────────────────────────────────────────────────────────
function ChatPanel({ data, setData, onSwitchToForm }) {
  const [step, setStep] = useStateChat(0);
  const [input, setInput] = useStateChat('');
  const [answers, setAnswers] = useStateChat({});
  const scrollerRef = useRefChat(null);

  useEffectChat(() => {
    scrollerRef.current?.scrollTo({ top: 9999, behavior: 'smooth' });
  }, [step]);

  // Once guided flow is done, hand off to AI chat
  if (step >= CHAT_FLOW.length - 1) {
    return <AiChat data={data} onSwitchToForm={onSwitchToForm} />;
  }

  function commit(value) {
    const node = CHAT_FLOW[step];
    setAnswers({ ...answers, [node.key]: value });

    if (node.path) {
      const [obj, key] = node.path;
      setData({ ...data, [obj]: { ...data[obj], [key]: value } });
    }
    if (node.key === 'tv_yn' && value === 'Start fresh') {
      setData({
        ...data,
        television: [], film: [], theatre: [], commercial: [],
        newMedia: [], voiceover: [],
        training: [], skills: '',
      });
    }
    setInput('');
    setStep(s => Math.min(s + 1, CHAT_FLOW.length - 1));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div ref={scrollerRef} style={{ flex: 1, overflow: 'auto', padding: '20px 18px' }}>
        {CHAT_FLOW.slice(0, step + 1).filter(n => n.q).map((node, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: `center/cover no-repeat url(assets/101logo.jpeg)`,
                flexShrink: 0, border: '1px solid rgba(212,184,118,.35)',
              }} />
              <div style={{
                background: 'rgba(255,255,255,.04)',
                border: '1px solid rgba(212,184,118,.15)',
                padding: '10px 14px', borderRadius: '0 10px 10px 10px',
                fontSize: 13.5, lineHeight: 1.5, color: '#f5efe3', maxWidth: '85%',
              }}>{node.q}</div>
            </div>
            {(window.RESUME_TIPS?.[node.key] || []).length > 0 && i === step && answers[node.key] == null && (
              <div style={{ marginLeft: 38, marginTop: 8 }}>
                <div style={{
                  fontSize: 9, letterSpacing: 2, color: 'rgba(212,184,118,.55)',
                  fontFamily: 'JetBrains Mono, monospace', marginBottom: 4,
                }}>RESUME 101 TIPS</div>
                {window.RESUME_TIPS[node.key].map((tip, j) => (
                  <TipCard key={j} tip={tip} />
                ))}
              </div>
            )}
            {answers[node.key] != null && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <div style={{
                  background: 'var(--burgundy-2)', color: '#fff',
                  padding: '8px 12px', borderRadius: '10px 10px 0 10px',
                  fontSize: 13, maxWidth: '70%',
                }}>{answers[node.key]}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(212,184,118,.15)', padding: 12, background: 'rgba(0,0,0,.2)' }}>
        {CHAT_FLOW[step].options ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CHAT_FLOW[step].options.map(o => (
              <button key={o} onClick={() => commit(o)} style={{
                padding: '8px 14px', fontSize: 12,
                background: 'rgba(212,184,118,.1)', color: '#d4b876',
                border: '1px solid rgba(212,184,118,.4)',
                borderRadius: 4, cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1,
              }}>{o}</button>
            ))}
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); if (input.trim()) commit(input.trim()); }} style={{ display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} autoFocus
              type={CHAT_FLOW[step].inputType || 'text'}
              placeholder={CHAT_FLOW[step].inputType === 'date' ? '' : 'Type your answer…'}
              style={{
                flex: 1, background: 'rgba(255,255,255,.05)',
                border: '1px solid rgba(212,184,118,.3)', color: '#f5efe3',
                padding: '10px 12px', borderRadius: 4, outline: 'none',
                fontFamily: 'Manrope, sans-serif', fontSize: 13,
                colorScheme: 'dark',
              }} />
            <button type="submit" style={{
              padding: '10px 16px', background: 'var(--burgundy)',
              border: '1px solid var(--burgundy-soft)', color: '#fff',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1.5,
              cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase',
            }}>Next</button>
          </form>
        )}
        <div style={{ marginTop: 10, fontSize: 10, color: 'rgba(232,223,202,.4)', textAlign: 'center' }}>
          <button onClick={onSwitchToForm} style={{
            background: 'transparent', border: 'none', color: 'rgba(212,184,118,.7)',
            cursor: 'pointer', textDecoration: 'underline', fontSize: 10,
            fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1,
          }}>switch to form view →</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ChatPanel });
