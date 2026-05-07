// Conversational chat-style guided flow (LangGraph-inspired).
// Used as alternative input mode.
const { useState: useStateChat, useEffect: useEffectChat, useRef: useRefChat } = React;

const CHAT_FLOW = [
  { key: 'name', q: "Hi! I'm here to help build your child's actor resume. What's their full name as it should appear on the resume?", path: ['actor', 'name'] },
  { key: 'union', q: "What's their union status?", path: ['actor', 'union'], options: ["Non-Union", "SAG-Eligible", "SAG-AFTRA", "AEA", "Financial Core"] },
  { key: 'height', q: "Their current height? (e.g. 4'8\")", path: ['actor', 'height'] },
  { key: 'age', q: "What age range do they play? (e.g. 8–11)", path: ['actor', 'age'] },
  { key: 'hair', q: "Hair color?", path: ['actor', 'hair'] },
  { key: 'eyes', q: "Eye color?", path: ['actor', 'eyes'] },
  { key: 'rep_yn', q: "Do they have representation (an agent or manager)?", options: ["Yes", "No"] },
  { key: 'tv_yn', q: "Any television credits to add now? You can always add more later in the form panel.", options: ["Skip — keep demo", "Start fresh"] },
  { key: 'done', q: "🎬 Beautiful. Their resume is ready in the preview. Tweak fonts and layout from the right panel, or keep editing details directly in the form. Click ⌄ on any answer above to revisit." },
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

function ChatPanel({ data, setData, onSwitchToForm }) {
  const [step, setStep] = useStateChat(0);
  const [input, setInput] = useStateChat('');
  const [answers, setAnswers] = useStateChat({});
  const scrollerRef = useRefChat(null);

  useEffectChat(() => {
    scrollerRef.current?.scrollTo({ top: 9999, behavior: 'smooth' });
  }, [step]);

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
        {CHAT_FLOW.slice(0, step + 1).map((node, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: `center/cover no-repeat url(assets/childactor101-logo.jpeg)`,
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
      {step < CHAT_FLOW.length - 1 && (
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
                placeholder="Type your answer…"
                style={{
                  flex: 1, background: 'rgba(255,255,255,.05)',
                  border: '1px solid rgba(212,184,118,.3)', color: '#f5efe3',
                  padding: '10px 12px', borderRadius: 4, outline: 'none',
                  fontFamily: 'Manrope, sans-serif', fontSize: 13,
                }} />
              <button type="submit" style={{
                padding: '10px 16px', background: 'var(--burgundy)',
                border: '1px solid var(--burgundy-soft)', color: '#fff',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1.5,
                cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase',
              }}>Send</button>
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
      )}
      {step >= CHAT_FLOW.length - 1 && (
        <div style={{ padding: 14, borderTop: '1px solid rgba(212,184,118,.15)' }}>
          <button onClick={onSwitchToForm} style={{
            width: '100%', padding: '10px', background: 'var(--burgundy)',
            border: '1px solid var(--burgundy-soft)', color: '#fff',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1.5,
            cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase',
          }}>Open Full Editor</button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ChatPanel });
