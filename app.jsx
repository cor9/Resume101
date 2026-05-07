// Top-level app shell.
const { useState: useStateApp, useEffect: useEffectApp, useRef: useRefApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "fontPair": "classic",
  "layout": "classic",
  "accent": "#14233c",
  "inputMode": "form",
  "etsyChrome": true
} /*EDITMODE-END*/;

// ─── Ecosystem products ────────────────────────────────────────────────────────
const ECOSYSTEM = [
  {
    id: 'review',
    label: 'Resume Review by Corey',
    price: '$35',
    tagline: 'Personalized industry feedback from a Hollywood youth talent manager.',
    cta: 'Get a Review',
    url: 'https://buy.stripe.com/6oUeVdg4De23d2Rb8u2wV0i',
    highlight: true,
  },
  {
    id: 'consult',
    label: 'Materials Review / Career Consultation',
    price: '$195',
    tagline: '45-minute private session. Goals, planning, and full materials review.',
    cta: 'Book Consultation',
    url: 'https://buy.stripe.com/6oE6q5fOr0Ep7mgg1T',
  },
  {
    id: 'twoscenes',
    label: 'Two Scenes Demo Reel Program',
    price: '$199',
    tagline: 'Custom coached scenes for casting profiles — 4 private sessions.',
    cta: 'Learn More',
    url: 'https://buy.stripe.com/8x2aEX19JaPR5ApekG2wV0j',
  },
  {
    id: 'onescene',
    label: 'One Scene',
    price: '$101',
    tagline: 'One coached and perfected scene for your casting profile.',
    cta: 'Get Started',
    url: 'https://buy.stripe.com/bJe5kD05F9LN6Et5Oa2wV0k',
  },
  {
    id: 'prep101',
    label: 'Prep101',
    price: null,
    tagline: 'Industry-standard audition preparation.',
    cta: 'Visit Prep101',
    url: 'https://prep101.site',
  },
  {
    id: 'reader101',
    label: 'Reader101',
    price: null,
    tagline: 'Scene reading support for parents.',
    cta: 'Visit Reader101',
    url: 'https://reader101.site',
  },
  {
    id: 'bold',
    label: 'Bold Choices',
    price: null,
    tagline: 'Stronger audition choices for young actors.',
    cta: 'Visit Bold Choices',
    url: 'https://boldchoices.site',
  },
  {
    id: 'training',
    label: '101 Training Program',
    price: null,
    tagline: 'Online classes from Child Actor 101.',
    cta: 'View Classes',
    url: 'https://101training.childactor101.com',
  },
  {
    id: 'coaching',
    label: 'Private Coaching with Corey',
    price: null,
    tagline: 'One-on-one online coaching sessions.',
    cta: 'Book Coaching',
    url: 'https://coaching.childactor101.com',
  },
  {
    id: 'directory',
    label: 'Child Actor 101 Directory',
    price: null,
    tagline: 'Find headshot photographers, coaches, self-tape services & more.',
    cta: 'Browse Directory',
    url: 'https://directory.childactor101.com',
  },
];

const AGE_RANGES = ['5–7', '8–10', '11–13', '14–17', '18+'];

// ─── Email Gate Modal ──────────────────────────────────────────────────────────
function EmailGateModal({ onSubmit, onClose }) {
  const [form, setForm] = useStateApp({ parentName: '', email: '', actorName: '', ageRange: '' });
  const [loading, setLoading] = useStateApp(false);
  const [error, setError] = useStateApp('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.parentName.trim() || !form.email.trim() || !form.actorName.trim() || !form.ageRange) {
      setError('Please fill in the required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { parentName, email, actorName, ageRange } = form;
      const res = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentName, email, actorName, ageRange }),
      });
      if (!res.ok) throw new Error('Submission failed');
      localStorage.setItem('r101_lead', JSON.stringify({ email: form.email, ts: Date.now() }));
      onSubmit();
    } catch {
      // still allow export if API is down — don't block the user
      localStorage.setItem('r101_lead', JSON.stringify({ email: form.email, ts: Date.now() }));
      onSubmit();
    }
    setLoading(false);
  }

  const fieldStyle = {
    width: '100%',
    background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(212,184,118,.28)',
    color: '#f5efe3',
    fontFamily: 'Manrope, sans-serif',
    fontSize: 13,
    padding: '9px 12px',
    borderRadius: 4,
    outline: 'none',
    boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', marginBottom: 12 };
  const labelTextStyle = {
    fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
    color: 'rgba(232,223,202,.55)', marginBottom: 4, fontWeight: 600,
    display: 'block',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(5,10,20,.88)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #14233c 0%, #0d1a2e 100%)',
        border: '1px solid rgba(212,184,118,.3)',
        borderRadius: 8, maxWidth: 420, width: '100%',
        boxShadow: '0 40px 80px rgba(0,0,0,.7)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(212,184,118,.08)',
          borderBottom: '1px solid rgba(212,184,118,.18)',
          padding: '20px 24px 16px',
        }}>
          <div style={{ fontSize: 8.5, letterSpacing: 3, color: '#d4b876', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
            CHILD ACTOR 101 · RESUME101
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#f5efe3', lineHeight: 1.2 }}>
            Get Your Professional PDF
          </div>
          <div style={{ fontSize: 12.5, color: 'rgba(232,223,202,.65)', marginTop: 6, lineHeight: 1.5 }}>
            Enter your details below to download your resume and receive helpful industry resources from Child Actor 101.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Your First Name *</span>
              <input style={fieldStyle} value={form.parentName} onChange={e => set('parentName', e.target.value)}
                placeholder="e.g. Jennifer" autoFocus />
            </label>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Actor's First Name *</span>
              <input style={fieldStyle} value={form.actorName} onChange={e => set('actorName', e.target.value)}
                placeholder="e.g. Billy" />
            </label>
          </div>

          <label style={labelStyle}>
            <span style={labelTextStyle}>Your Email *</span>
            <input style={fieldStyle} type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="you@example.com" />
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>Actor's Age Range *</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {AGE_RANGES.map(r => (
                <button key={r} type="button" onClick={() => set('ageRange', r)} style={{
                  padding: '6px 13px', fontSize: 12,
                  background: form.ageRange === r ? 'var(--burgundy)' : 'rgba(255,255,255,.04)',
                  color: form.ageRange === r ? '#fff' : 'rgba(232,223,202,.75)',
                  border: `1px solid ${form.ageRange === r ? 'var(--burgundy-soft)' : 'rgba(212,184,118,.25)'}`,
                  borderRadius: 4, cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace', letterSpacing: .5,
                }}>{r}</button>
              ))}
            </div>
          </label>

          {error && (
            <div style={{ fontSize: 11.5, color: '#b8525c', marginBottom: 10 }}>{error}</div>
          )}

          {/* Consent */}
          <div style={{
            fontSize: 10.5, color: 'rgba(232,223,202,.45)', lineHeight: 1.55,
            borderTop: '1px solid rgba(212,184,118,.12)', paddingTop: 12, marginTop: 12, marginBottom: 14,
          }}>
            Your information is used to generate your resume, save your progress, and send helpful Child Actor 101 resources. We never sell your information.{' '}
            <a href="https://www.childactor101.com/privacy-policy" target="_blank" rel="noopener"
              style={{ color: 'rgba(212,184,118,.6)', textDecoration: 'underline' }}>Privacy Policy</a>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px',
            background: loading ? 'rgba(107,31,42,.5)' : 'var(--burgundy)',
            border: '1px solid var(--burgundy-soft)', color: '#fff',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: 1.5,
            cursor: loading ? 'default' : 'pointer', borderRadius: 4, textTransform: 'uppercase',
          }}>
            {loading ? 'Saving…' : '⬇  Send Me My Professional PDF'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <button type="button" onClick={onClose} style={{
              background: 'transparent', border: 'none',
              color: 'rgba(232,223,202,.35)', fontSize: 10,
              fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1,
              cursor: 'pointer', textDecoration: 'underline',
            }}>skip for now</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Ecosystem Upsell Card ─────────────────────────────────────────────────────
function UpsellCard({ item }) {
  return (
    <a href={item.url} target="_blank" rel="noopener" style={{ textDecoration: 'none' }}>
      <div style={{
        padding: '11px 14px',
        background: item.highlight ? 'rgba(107,31,42,.22)' : 'rgba(255,255,255,.025)',
        border: `1px solid ${item.highlight ? 'rgba(184,82,92,.45)' : 'rgba(212,184,118,.12)'}`,
        borderRadius: 5,
        marginBottom: 7,
        cursor: 'pointer',
        transition: 'background .15s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = item.highlight ? 'rgba(107,31,42,.35)' : 'rgba(255,255,255,.05)'}
        onMouseLeave={e => e.currentTarget.style.background = item.highlight ? 'rgba(107,31,42,.22)' : 'rgba(255,255,255,.025)'}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <div style={{
            fontSize: 12, fontFamily: "'Playfair Display', serif",
            color: item.highlight ? '#e8dfca' : 'rgba(232,223,202,.85)',
            lineHeight: 1.25,
          }}>{item.label}</div>
          {item.price && (
            <div style={{
              fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
              color: item.highlight ? '#d4b876' : 'rgba(212,184,118,.65)',
              flexShrink: 0,
            }}>{item.price}</div>
          )}
        </div>
        <div style={{ fontSize: 10.5, color: 'rgba(232,223,202,.45)', marginTop: 3, lineHeight: 1.4 }}>
          {item.tagline}
        </div>
        <div style={{
          marginTop: 7, fontSize: 9.5, letterSpacing: 1.5, textTransform: 'uppercase',
          color: item.highlight ? '#d4b876' : 'rgba(212,184,118,.55)',
          fontFamily: 'JetBrains Mono, monospace',
        }}>{item.cta} →</div>
      </div>
    </a>
  );
}

// ─── Ecosystem Panel ───────────────────────────────────────────────────────────
function EcosystemPanel() {
  const [expanded, setExpanded] = useStateApp(false);
  const visible = expanded ? ECOSYSTEM : ECOSYSTEM.slice(0, 3);

  return (
    <div style={{
      borderTop: '1px solid rgba(212,184,118,.18)',
      padding: '14px 18px',
      background: 'rgba(0,0,0,.18)',
    }}>
      <div style={{
        fontSize: 8.5, letterSpacing: 3, color: 'rgba(212,184,118,.55)',
        fontFamily: 'JetBrains Mono, monospace', marginBottom: 10,
        textTransform: 'uppercase',
      }}>
        Child Actor 101 Ecosystem
      </div>
      {visible.map(item => <UpsellCard key={item.id} item={item} />)}
      <button onClick={() => setExpanded(x => !x)} style={{
        width: '100%', marginTop: 4, padding: '7px',
        background: 'transparent',
        border: '1px dashed rgba(212,184,118,.2)',
        color: 'rgba(212,184,118,.5)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5,
        letterSpacing: 1, cursor: 'pointer', borderRadius: 4,
        textTransform: 'uppercase',
      }}>
        {expanded ? '− Show Less' : `+ ${ECOSYSTEM.length - 3} More Resources`}
      </button>
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <a href="https://www.childactor101.com" target="_blank" rel="noopener"
          style={{ fontSize: 9.5, color: 'rgba(212,184,118,.35)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1 }}>
          childactor101.com
        </a>
      </div>
    </div>
  );
}

// ─── PDF Export (with gate) ────────────────────────────────────────────────────
function triggerPrint() {
  const node = document.getElementById('resume-paper');
  if (!node) return;
  const w = window.open('', '_blank', 'width=900,height=1100');
  if (!w) return alert('Pop-up blocked. Allow pop-ups to export PDF.');
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).
    map((el) => el.outerHTML).join('\n');
  w.document.write(`<!doctype html><html><head><title>Resume</title>${styles}
    <style>
      body { margin: 0; background: #fff; }
      @page { size: letter; margin: 0; }
      #wrap { display:flex; justify-content:center; padding:0; }
    </style></head><body><div id="wrap">${node.outerHTML}</div>
    <script>window.onload=()=>setTimeout(()=>window.print(),350)<\/script>
    </body></html>`);
  w.document.close();
}

function hasSubmittedGate() {
  try {
    const raw = localStorage.getItem('r101_lead');
    if (!raw) return false;
    const { ts } = JSON.parse(raw);
    // gate valid for 30 days
    return Date.now() - ts < 30 * 24 * 60 * 60 * 1000;
  } catch { return false; }
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [data, setData] = useStateApp(window.billyDemo);
  const [inputMode, setInputMode] = useStateApp('form');
  const [previewScale, setPreviewScale] = useStateApp(0.78);
  const [showGate, setShowGate] = useStateApp(false);

  useEffectApp(() => {
    function fit() {
      const stage = document.getElementById('preview-stage');
      if (!stage) return;
      const w = stage.clientWidth - 60;
      const h = stage.clientHeight - 60;
      const paperW = 8.5 * 96;
      const paperH = 11 * 96;
      setPreviewScale(Math.min(w / paperW, h / paperH, 1.1));
    }
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [tweaks.layout]);

  function handleExportClick() {
    if (hasSubmittedGate()) {
      triggerPrint();
    } else {
      setShowGate(true);
    }
  }

  const accentOptions = [
    { v: '#14233c', l: 'Navy' },
    { v: '#6b1f2a', l: 'Burgundy' },
    { v: '#1a3d2e', l: 'Forest' },
    { v: '#2a2a2a', l: 'Charcoal' },
  ];

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'grid',
      gridTemplateColumns: '380px 1fr',
      background: '#0a1220',
      color: '#f5efe3',
    }}>
      {showGate && (
        <EmailGateModal
          onSubmit={() => { setShowGate(false); triggerPrint(); }}
          onClose={() => { setShowGate(false); triggerPrint(); }}
        />
      )}

      {/* LEFT: Builder column */}
      <div style={{
        background: 'linear-gradient(180deg, #14233c 0%, #0d1a30 100%)',
        borderRight: '1px solid rgba(212,184,118,.18)',
        display: 'flex', flexDirection: 'column',
        height: '100vh', overflow: 'hidden',
      }}>
        {/* Brand header */}
        <div style={{
          padding: '16px 20px 14px',
          borderBottom: '1px solid rgba(212,184,118,.2)',
          background: 'rgba(0,0,0,.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: 'rgba(212,184,118,.7)', fontFamily: 'JetBrains Mono, monospace' }}>
                CHILD ACTOR 101 · PRESENTS
              </div>
              <div style={{
                fontFamily: "'Playfair Display', serif", fontSize: 24,
                color: '#f5efe3', letterSpacing: .5, lineHeight: 1.1, marginTop: 2,
              }}>Resume101</div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: '#d4b876', marginTop: 2, fontStyle: 'italic' }}>
                Industry Standard Youth Actor Resume Builder
              </div>
            </div>
            <a href="https://www.childactor101.com" target="_blank" rel="noopener">
              <img src="assets/101logo.jpeg" alt="Child Actor 101"
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid rgba(212,184,118,.5)',
                  display: 'block',
                }} />
            </a>
          </div>
          {/* Mode toggle */}
          <div style={{
            display: 'flex', marginTop: 14, padding: 3,
            background: 'rgba(0,0,0,.3)', borderRadius: 4,
            border: '1px solid rgba(212,184,118,.15)',
          }}>
            {['form', 'chat'].map((m) =>
              <button key={m} onClick={() => setInputMode(m)} style={{
                flex: 1, padding: '7px 10px',
                background: inputMode === m ? 'var(--burgundy)' : 'transparent',
                color: inputMode === m ? '#fff' : 'rgba(232,223,202,.6)',
                border: 'none', borderRadius: 3, cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>{m === 'form' ? '☰  Editor' : '◐  Guided Chat'}</button>
            )}
          </div>
        </div>

        {/* Body — scrollable builder */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {inputMode === 'form'
            ? <BuilderPanel data={data} setData={setData} />
            : <ChatPanel data={data} setData={setData} onSwitchToForm={() => setInputMode('form')} />}
        </div>

        {/* Footer actions */}
        <div style={{
          borderTop: '1px solid rgba(212,184,118,.18)',
          padding: 12, background: 'rgba(0,0,0,.25)',
          display: 'flex', gap: 8,
        }}>
          <button onClick={handleExportClick} style={{
            flex: 1, padding: '10px',
            background: 'var(--burgundy)',
            border: '1px solid var(--burgundy-soft)', color: '#fff',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1.5,
            cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <span>⬇</span> Export PDF
          </button>
          <button onClick={() => { if (confirm('Reset to demo?')) setData(window.billyDemo); }} style={{
            padding: '10px 14px',
            background: 'transparent',
            border: '1px solid rgba(212,184,118,.3)', color: 'rgba(232,223,202,.7)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1.5,
            cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase',
          }}>Reset</button>
        </div>

        {/* Ecosystem upsell */}
        <div style={{ overflow: 'auto', maxHeight: '38vh', flexShrink: 0 }}>
          <EcosystemPanel />
        </div>
      </div>

      {/* RIGHT: Preview */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: `
          radial-gradient(circle at 30% 20%, rgba(107,31,42,.28), transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(20,35,60,.5), transparent 60%),
          #050a14
        `,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Top toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 22px',
          borderBottom: '1px solid rgba(212,184,118,.12)',
          background: 'rgba(10,18,32,.7)', backdropFilter: 'blur(6px)',
        }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2,
              color: 'rgba(232,223,202,.5)',
            }}>● LIVE PREVIEW</div>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: 14,
              color: 'rgba(232,223,202,.85)',
            }}>{data.actor.name || 'Untitled'}</div>
            <div style={{
              fontSize: 10, letterSpacing: 2, color: '#d4b876',
              fontFamily: 'JetBrains Mono, monospace', padding: '3px 8px',
              border: '1px solid rgba(212,184,118,.3)', borderRadius: 2,
            }}>8.5 × 11 IN · LETTER</div>
          </div>

          {/* Layout chooser */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(232,223,202,.5)', fontFamily: 'JetBrains Mono, monospace' }}>LAYOUT</span>
            {[
              { v: 'classic', l: 'Classic' },
              { v: 'banner', l: 'Banner' },
              { v: 'side', l: 'Sidebar' },
            ].map((o) =>
              <button key={o.v} onClick={() => setTweak('layout', o.v)} style={{
                padding: '6px 12px', fontSize: 11, letterSpacing: 1,
                background: tweaks.layout === o.v ? 'rgba(212,184,118,.15)' : 'transparent',
                color: tweaks.layout === o.v ? '#d4b876' : 'rgba(232,223,202,.65)',
                border: `1px solid ${tweaks.layout === o.v ? 'rgba(212,184,118,.5)' : 'rgba(212,184,118,.15)'}`,
                borderRadius: 3, cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase',
              }}>{o.l}</button>
            )}
          </div>
        </div>

        {/* Stage */}
        <div id="preview-stage" style={{
          flex: 1, position: 'relative', overflow: 'auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30,
        }}>
          <div style={{
            transform: `scale(${previewScale})`,
            transformOrigin: 'center center',
            transition: 'transform .25s ease',
          }}>
            <Resume data={data} tweaks={tweaks} />
          </div>
        </div>

        {/* Bottom strip: font + accent + zoom */}
        <div style={{
          padding: '10px 22px',
          borderTop: '1px solid rgba(212,184,118,.12)',
          background: 'rgba(10,18,32,.7)',
          display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(232,223,202,.5)', fontFamily: 'JetBrains Mono, monospace' }}>FONT PAIR</span>
            <select value={tweaks.fontPair} onChange={(e) => setTweak('fontPair', e.target.value)} style={{
              background: 'rgba(255,255,255,.04)', color: '#f5efe3',
              border: '1px solid rgba(212,184,118,.25)', padding: '5px 8px',
              borderRadius: 3, fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            }}>
              {Object.entries(window.FONT_PAIRS).map(([k, v]) =>
                <option key={k} value={k} style={{ background: '#14233c' }}>{v.label}</option>
              )}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(232,223,202,.5)', fontFamily: 'JetBrains Mono, monospace' }}>ACCENT</span>
            {accentOptions.map((a) =>
              <button key={a.v} onClick={() => setTweak('accent', a.v)} title={a.l} style={{
                width: 22, height: 22, borderRadius: '50%',
                background: a.v, cursor: 'pointer',
                border: tweaks.accent === a.v ? '2px solid #d4b876' : '1px solid rgba(212,184,118,.25)',
                boxShadow: tweaks.accent === a.v ? '0 0 0 2px rgba(212,184,118,.2)' : 'none',
              }} />
            )}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(232,223,202,.5)', fontFamily: 'JetBrains Mono, monospace' }}>ZOOM</span>
            <button onClick={() => setPreviewScale((s) => Math.max(0.3, s - 0.1))} style={zoomBtn}>−</button>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#d4b876', minWidth: 38, textAlign: 'center' }}>
              {Math.round(previewScale * 100)}%
            </span>
            <button onClick={() => setPreviewScale((s) => Math.min(1.5, s + 0.1))} style={zoomBtn}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const zoomBtn = {
  width: 26, height: 26,
  background: 'rgba(255,255,255,.04)',
  border: '1px solid rgba(212,184,118,.25)',
  color: '#d4b876', cursor: 'pointer', borderRadius: 3,
  fontFamily: 'JetBrains Mono, monospace', fontSize: 14,
};

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
