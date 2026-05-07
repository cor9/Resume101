// Top-level app shell.
const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "fontPair": "classic",
  "layout": "classic",
  "accent": "#14233c",
  "inputMode": "form",
  "etsyChrome": true
} /*EDITMODE-END*/;

function exportPDF() {
  // Trigger browser print dialog scoped to the resume paper.
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
    <script>window.onload=()=>setTimeout(()=>window.print(),350)</script>
    </body></html>`);
  w.document.close();
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [data, setData] = useStateApp(window.billyDemo);
  const [inputMode, setInputMode] = useStateApp('form'); // 'form' | 'chat'
  const [previewScale, setPreviewScale] = useStateApp(0.78);

  // auto-fit preview
  useEffectApp(() => {
    function fit() {
      const stage = document.getElementById('preview-stage');
      if (!stage) return;
      const w = stage.clientWidth - 60;
      const h = stage.clientHeight - 60;
      const paperW = 8.5 * 96; // 816
      const paperH = 11 * 96; // 1056
      setPreviewScale(Math.min(w / paperW, h / paperH, 1.1));
    }
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [tweaks.layout]);

  const accentOptions = [
  { v: '#14233c', l: 'Navy' },
  { v: '#6b1f2a', l: 'Burgundy' },
  { v: '#1a3d2e', l: 'Forest' },
  { v: '#2a2a2a', l: 'Charcoal' }];


  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'grid',
      gridTemplateColumns: '380px 1fr',
      background: '#0a1220',
      color: '#f5efe3'
    }}>
      {/* LEFT: Builder column */}
      <div style={{
        background: 'linear-gradient(180deg, #14233c 0%, #0d1a30 100%)',
        borderRight: '1px solid rgba(212,184,118,.18)',
        display: 'flex', flexDirection: 'column',
        height: '100vh', overflow: 'hidden'
      }}>
        {/* Brand header */}
        <div style={{
          padding: '18px 20px 16px',
          borderBottom: '1px solid rgba(212,184,118,.2)',
          background: 'rgba(0,0,0,.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 4, color: 'rgba(212,184,118,.7)', fontFamily: 'JetBrains Mono, monospace' }}>
                CHILD ACTOR 101 · PRESENTS
              </div>
              <div style={{
                fontFamily: "'Playfair Display', serif", fontSize: 24,
                color: '#f5efe3', letterSpacing: .5, lineHeight: 1.1, marginTop: 2
              }}>Resume101</div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: '#d4b876', marginTop: 2, fontStyle: 'italic' }}>Industry Standard Youth Actor Resume Builder

              </div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #d4b876, #8a6a2a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Playfair Display', serif", color: '#14233c', fontWeight: 700,
              border: '1px solid rgba(212,184,118,.5)'
            }}>S</div>
          </div>
          {/* Mode toggle */}
          <div style={{
            display: 'flex', marginTop: 14, padding: 3,
            background: 'rgba(0,0,0,.3)', borderRadius: 4,
            border: '1px solid rgba(212,184,118,.15)'
          }}>
            {['form', 'chat'].map((m) =>
            <button key={m} onClick={() => setInputMode(m)} style={{
              flex: 1, padding: '7px 10px',
              background: inputMode === m ? 'var(--burgundy)' : 'transparent',
              color: inputMode === m ? '#fff' : 'rgba(232,223,202,.6)',
              border: 'none', borderRadius: 3, cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 1.5,
              textTransform: 'uppercase'
            }}>{m === 'form' ? '☰  Editor' : '◐  Guided Chat'}</button>
            )}
          </div>
        </div>
        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {inputMode === 'form' ?
          <BuilderPanel data={data} setData={setData} /> :
          <ChatPanel data={data} setData={setData} onSwitchToForm={() => setInputMode('form')} />}
        </div>
        {/* Footer actions */}
        <div style={{
          borderTop: '1px solid rgba(212,184,118,.18)',
          padding: 12, background: 'rgba(0,0,0,.25)',
          display: 'flex', gap: 8
        }}>
          <button onClick={exportPDF} style={{
            flex: 1, padding: '10px',
            background: 'var(--burgundy)',
            border: '1px solid var(--burgundy-soft)', color: '#fff',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1.5,
            cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
          }}>
            <span>⬇</span> Export PDF
          </button>
          <button onClick={() => {if (confirm('Reset to demo?')) setData(window.billyDemo);}} style={{
            padding: '10px 14px',
            background: 'transparent',
            border: '1px solid rgba(212,184,118,.3)', color: 'rgba(232,223,202,.7)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1.5,
            cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase'
          }}>Reset</button>
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
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Top toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 22px',
          borderBottom: '1px solid rgba(212,184,118,.12)',
          background: 'rgba(10,18,32,.7)', backdropFilter: 'blur(6px)'
        }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 2,
              color: 'rgba(232,223,202,.5)'
            }}>● LIVE PREVIEW</div>
            <div style={{
              fontFamily: "'Playfair Display', serif", fontSize: 14,
              color: 'rgba(232,223,202,.85)'
            }}>{data.actor.name || 'Untitled'}</div>
            <div style={{
              fontSize: 10, letterSpacing: 2, color: '#d4b876',
              fontFamily: 'JetBrains Mono, monospace', padding: '3px 8px',
              border: '1px solid rgba(212,184,118,.3)', borderRadius: 2
            }}>8.5 × 11 IN · LETTER</div>
          </div>

          {/* Layout chooser */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(232,223,202,.5)', fontFamily: 'JetBrains Mono, monospace' }}>LAYOUT</span>
            {[
            { v: 'classic', l: 'Classic' },
            { v: 'banner', l: 'Banner' },
            { v: 'side', l: 'Sidebar' }].
            map((o) =>
            <button key={o.v} onClick={() => setTweak('layout', o.v)} style={{
              padding: '6px 12px', fontSize: 11, letterSpacing: 1,
              background: tweaks.layout === o.v ? 'rgba(212,184,118,.15)' : 'transparent',
              color: tweaks.layout === o.v ? '#d4b876' : 'rgba(232,223,202,.65)',
              border: `1px solid ${tweaks.layout === o.v ? 'rgba(212,184,118,.5)' : 'rgba(212,184,118,.15)'}`,
              borderRadius: 3, cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase'
            }}>{o.l}</button>
            )}
          </div>
        </div>

        {/* Stage */}
        <div id="preview-stage" style={{ flex: 1, position: 'relative', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30 }}>
          <div style={{
            transform: `scale(${previewScale})`,
            transformOrigin: 'center center',
            transition: 'transform .25s ease'
          }}>
            <Resume data={data} tweaks={tweaks} />
          </div>
        </div>

        {/* Bottom strip: font + accent + zoom */}
        <div style={{
          padding: '10px 22px',
          borderTop: '1px solid rgba(212,184,118,.12)',
          background: 'rgba(10,18,32,.7)',
          display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(232,223,202,.5)', fontFamily: 'JetBrains Mono, monospace' }}>FONT PAIR</span>
            <select value={tweaks.fontPair} onChange={(e) => setTweak('fontPair', e.target.value)} style={{
              background: 'rgba(255,255,255,.04)', color: '#f5efe3',
              border: '1px solid rgba(212,184,118,.25)', padding: '5px 8px',
              borderRadius: 3, fontFamily: 'JetBrains Mono, monospace', fontSize: 11
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
              boxShadow: tweaks.accent === a.v ? '0 0 0 2px rgba(212,184,118,.2)' : 'none'
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
    </div>);

}

const zoomBtn = {
  width: 26, height: 26,
  background: 'rgba(255,255,255,.04)',
  border: '1px solid rgba(212,184,118,.25)',
  color: '#d4b876', cursor: 'pointer', borderRadius: 3,
  fontFamily: 'JetBrains Mono, monospace', fontSize: 14
};

ReactDOM.createRoot(document.getElementById('app')).render(<App />);