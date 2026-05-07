// Form-based builder panel — accordion sections.
const { useState, useRef } = React;

function Field({ label, value, onChange, placeholder, type = 'text', textarea, rows = 3 }) {
  const Cmp = textarea ? 'textarea' : 'input';
  return (
    <label style={{ display: 'block', marginBottom: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(232,223,202,.55)', marginBottom: 4, fontWeight: 600 }}>{label}</div>
      <Cmp
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={textarea ? rows : undefined}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,.04)',
          border: '1px solid rgba(212,184,118,.22)',
          color: '#f5efe3',
          fontFamily: 'Manrope, sans-serif',
          fontSize: 13,
          padding: '8px 10px',
          borderRadius: 4,
          outline: 'none',
          resize: textarea ? 'vertical' : 'none',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(212,184,118,.6)'}
        onBlur={e => e.target.style.borderColor = 'rgba(212,184,118,.22)'}
      />
    </label>
  );
}

function Accordion({ title, count, open, onToggle, children, accent = '#d4b876', tipKey }) {
  const tip = tipKey ? window.SECTION_TIPS?.[tipKey] : null;
  return (
    <div style={{ borderBottom: '1px solid rgba(212,184,118,.15)' }}>
      <button onClick={onToggle} style={{
        width: '100%', textAlign: 'left', background: 'transparent', border: 'none',
        color: '#f5efe3', padding: '14px 18px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: "'Playfair Display', serif", fontSize: 15, letterSpacing: .3,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: accent, fontSize: 11, transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .2s', display: 'inline-block', width: 10 }}>▶</span>
          {title}
          {count != null && (
            <span style={{ fontSize: 10, color: 'rgba(232,223,202,.45)', fontFamily: 'JetBrains Mono, monospace', marginLeft: 4 }}>
              {count}
            </span>
          )}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(232,223,202,.45)' }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding: '4px 18px 16px' }}>
          {tip && (
            <div style={{
              background: 'rgba(212,184,118,.08)',
              border: '1px solid rgba(212,184,118,.22)',
              borderLeft: '3px solid #d4b876',
              padding: '8px 12px', marginBottom: 12, borderRadius: 3,
              fontSize: 11.5, lineHeight: 1.55,
              color: 'rgba(232,223,202,.85)',
            }}>
              <div style={{ fontSize: 8.5, letterSpacing: 2.5, color: '#d4b876', marginBottom: 3, fontFamily: 'JetBrains Mono, monospace' }}>
                ⓘ RESUME 101 TIP
              </div>
              {tip}
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}

function CreditEditor({ items, setItems, projectLabel = 'Project', roleLabel = 'Role', studioLabel = 'Studio/Network' }) {
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} style={{
          padding: 10, marginBottom: 8,
          background: 'rgba(255,255,255,.025)',
          border: '1px solid rgba(212,184,118,.12)',
          borderRadius: 4,
          position: 'relative',
        }}>
          <button onClick={() => setItems(items.filter((_, j) => j !== i))} style={{
            position: 'absolute', top: 6, right: 6, background: 'transparent',
            border: 'none', color: 'rgba(232,223,202,.4)', cursor: 'pointer', fontSize: 14,
          }} title="Remove">×</button>
          <Field label={projectLabel} value={it.project} onChange={v => setItems(items.map((x, j) => j === i ? { ...x, project: v } : x))} />
          <Field label={roleLabel} value={it.role} onChange={v => setItems(items.map((x, j) => j === i ? { ...x, role: v } : x))} />
          <Field label={studioLabel} value={it.studio} onChange={v => setItems(items.map((x, j) => j === i ? { ...x, studio: v } : x))} />
        </div>
      ))}
      <button onClick={() => setItems([...items, { project: '', role: '', studio: '' }])} style={{
        width: '100%', padding: '8px', background: 'transparent',
        border: '1px dashed rgba(212,184,118,.35)', color: 'rgba(212,184,118,.85)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1,
        cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase',
      }}>+ Add Credit</button>
    </div>
  );
}

function TrainingEditor({ items, setItems }) {
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} style={{
          padding: 10, marginBottom: 8,
          background: 'rgba(255,255,255,.025)',
          border: '1px solid rgba(212,184,118,.12)',
          borderRadius: 4,
          position: 'relative',
        }}>
          <button onClick={() => setItems(items.filter((_, j) => j !== i))} style={{
            position: 'absolute', top: 6, right: 6, background: 'transparent',
            border: 'none', color: 'rgba(232,223,202,.4)', cursor: 'pointer', fontSize: 14,
          }}>×</button>
          <Field label="Class / Workshop" value={it.class} onChange={v => setItems(items.map((x, j) => j === i ? { ...x, class: v } : x))} />
          <Field label="Instructor / School" value={it.instructor} onChange={v => setItems(items.map((x, j) => j === i ? { ...x, instructor: v } : x))} />
          <Field label="Location" value={it.location} onChange={v => setItems(items.map((x, j) => j === i ? { ...x, location: v } : x))} />
        </div>
      ))}
      <button onClick={() => setItems([...items, { class: '', instructor: '', location: '' }])} style={{
        width: '100%', padding: '8px', background: 'transparent',
        border: '1px dashed rgba(212,184,118,.35)', color: 'rgba(212,184,118,.85)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1,
        cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase',
      }}>+ Add Training</button>
    </div>
  );
}

function HeadshotUploader({ data, setData }) {
  const [cropping, setCropping] = useState(false);
  const [rawSrc, setRawSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0.5, y: 0.4, scale: 1 });
  const fileRef = useRef(null);

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawSrc(reader.result);
      setCrop({ x: 0.5, y: 0.4, scale: 1 });
      setCropping(true);
    };
    reader.readAsDataURL(f);
  }

  function applyCrop() {
    const img = new Image();
    img.onload = () => {
      const targetW = 400, targetH = 500; // 8x10 ratio
      const canvas = document.createElement('canvas');
      canvas.width = targetW; canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      // contain by scale
      const baseScale = Math.max(targetW / img.width, targetH / img.height);
      const s = baseScale * crop.scale;
      const drawW = img.width * s, drawH = img.height * s;
      const cx = crop.x * drawW, cy = crop.y * drawH;
      const dx = targetW / 2 - cx;
      const dy = targetH / 2 - cy;
      ctx.fillStyle = '#fbf8f1';
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.drawImage(img, dx, dy, drawW, drawH);
      const url = canvas.toDataURL('image/jpeg', 0.9);
      setData({ ...data, headshot: url });
      setCropping(false);
      setRawSrc(null);
    };
    img.src = rawSrc;
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 88 }}>
          <div style={{
            aspectRatio: '8/10',
            background: data.headshot ? `center/cover no-repeat url(${data.headshot})` : 'repeating-linear-gradient(135deg, rgba(212,184,118,.15) 0 6px, rgba(212,184,118,.05) 6px 12px)',
            border: '1px solid rgba(212,184,118,.3)', borderRadius: 4,
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()} style={{
            width: '100%', padding: '8px', background: 'rgba(212,184,118,.12)',
            border: '1px solid rgba(212,184,118,.4)', color: '#d4b876',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1,
            cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase', marginBottom: 6,
          }}>{data.headshot ? 'Replace Headshot' : 'Upload Headshot'}</button>
          {data.headshot && (
            <button onClick={() => setData({ ...data, headshot: null })} style={{
              width: '100%', padding: '6px', background: 'transparent',
              border: '1px solid rgba(184,82,92,.4)', color: 'var(--burgundy-soft)',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 1,
              cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase',
            }}>Remove</button>
          )}
          <div style={{ fontSize: 10, color: 'rgba(232,223,202,.5)', marginTop: 6, lineHeight: 1.4 }}>
            8×10 ratio recommended. You'll be able to crop after upload.
          </div>
        </div>
      </div>

      {cropping && rawSrc && (
        <CropDialog
          src={rawSrc}
          crop={crop}
          setCrop={setCrop}
          onCancel={() => { setCropping(false); setRawSrc(null); }}
          onApply={applyCrop}
        />
      )}
    </div>
  );
}

function CropDialog({ src, crop, setCrop, onCancel, onApply }) {
  const containerRef = useRef(null);
  const dragRef = useRef(null);

  function startDrag(e) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, cx: crop.x, cy: crop.y };
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);
  }
  function onDrag(e) {
    if (!dragRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragRef.current.startX) / rect.width;
    const dy = (e.clientY - dragRef.current.startY) / rect.height;
    setCrop(c => ({ ...c, x: Math.max(0, Math.min(1, dragRef.current.cx - dx)), y: Math.max(0, Math.min(1, dragRef.current.cy - dy)) }));
  }
  function endDrag() {
    dragRef.current = null;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', endDrag);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(10,18,32,.92)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ background: 'var(--navy-2)', padding: 24, borderRadius: 6, maxWidth: 480, width: '100%', border: '1px solid rgba(212,184,118,.3)' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#d4b876', marginBottom: 4 }}>Crop Headshot</div>
        <div style={{ fontSize: 12, color: 'rgba(232,223,202,.6)', marginBottom: 16 }}>
          Drag to reposition. Slide to zoom. Industry standard is 8×10 portrait.
        </div>
        <div ref={containerRef}
          onMouseDown={startDrag}
          style={{
            width: 280, height: 350, margin: '0 auto', position: 'relative',
            overflow: 'hidden', border: '2px solid var(--gold)', cursor: 'grab',
            background: '#000',
          }}>
          <img src={src} alt=""
            draggable={false}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: `translate(-50%, -50%) translate(${(0.5 - crop.x) * 100}%, ${(0.5 - crop.y) * 100}%) scale(${crop.scale})`,
              minWidth: '100%', minHeight: '100%',
              maxWidth: 'none', maxHeight: 'none',
              objectFit: 'cover',
              userSelect: 'none', pointerEvents: 'none',
            }}
          />
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(232,223,202,.6)' }}>ZOOM</span>
          <input type="range" min="1" max="3" step="0.05" value={crop.scale}
            onChange={e => setCrop(c => ({ ...c, scale: parseFloat(e.target.value) }))}
            style={{ flex: 1, accentColor: '#d4b876' }}
          />
        </div>
        <div style={{ marginTop: 18, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '8px 16px', background: 'transparent',
            border: '1px solid rgba(232,223,202,.3)', color: 'rgba(232,223,202,.7)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1.5,
            cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase',
          }}>Cancel</button>
          <button onClick={onApply} style={{
            padding: '8px 16px', background: 'var(--burgundy)',
            border: '1px solid var(--burgundy-soft)', color: '#fff',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1.5,
            cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase',
          }}>Apply Crop</button>
        </div>
      </div>
    </div>
  );
}

function BuilderPanel({ data, setData }) {
  const [open, setOpen] = useState({ basics: true, reps: false, headshot: false, tv: false, film: false, theatre: false, commercial: false, newMedia: false, voiceover: false, training: false, skills: false });
  const t = (k) => () => setOpen(o => ({ ...o, [k]: !o[k] }));
  const upd = (k, v) => setData({ ...data, [k]: v });
  const updActor = (k, v) => setData({ ...data, actor: { ...data.actor, [k]: v } });

  const UNION = ["Non-Union", "SAG-Eligible", "SAG-AFTRA", "AEA", "Financial Core"];

  return (
    <div>
      <Accordion title="The Actor" tipKey="basics" open={open.basics} onToggle={t('basics')}>
        <Field label="Full Name" value={data.actor.name} onChange={v => updActor('name', v)} placeholder="e.g. Billy Boyson" />
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(232,223,202,.55)', marginBottom: 4, fontWeight: 600 }}>Union Status</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {UNION.map(u => (
              <button key={u} onClick={() => updActor('union', u)} style={{
                padding: '5px 10px', fontSize: 11,
                background: data.actor.union === u ? 'var(--burgundy)' : 'transparent',
                color: data.actor.union === u ? '#fff' : 'rgba(232,223,202,.7)',
                border: `1px solid ${data.actor.union === u ? 'var(--burgundy-soft)' : 'rgba(212,184,118,.25)'}`,
                borderRadius: 4, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: 1,
              }}>{u}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Height" value={data.actor.height} onChange={v => updActor('height', v)} placeholder="4'8&quot;" />
          <Field label="DOB" value={data.actor.age} onChange={v => updActor('age', v)} placeholder="8–11" />
          <Field label="Hair" value={data.actor.hair} onChange={v => updActor('hair', v)} placeholder="Brown" />
          <Field label="Eyes" value={data.actor.eyes} onChange={v => updActor('eyes', v)} placeholder="Brown" />
        </div>
      </Accordion>

      <Accordion title="Headshot" tipKey="headshot" open={open.headshot} onToggle={t('headshot')}>
        <HeadshotUploader data={data} setData={setData} />
      </Accordion>

      <Accordion title="Representation" count={data.reps.length} tipKey="reps" open={open.reps} onToggle={t('reps')}>
        {data.reps.map((r, i) => (
          <div key={i} style={{
            padding: 10, marginBottom: 8,
            background: 'rgba(255,255,255,.025)',
            border: '1px solid rgba(212,184,118,.12)',
            borderRadius: 4, position: 'relative',
          }}>
            <button onClick={() => upd('reps', data.reps.filter((_, j) => j !== i))} style={{
              position: 'absolute', top: 6, right: 6, background: 'transparent',
              border: 'none', color: 'rgba(232,223,202,.4)', cursor: 'pointer', fontSize: 14,
            }}>×</button>
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(232,223,202,.55)', marginBottom: 4 }}>Type</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['Agency', 'Manager', 'Guardian'].map(t => (
                  <button key={t} onClick={() => upd('reps', data.reps.map((x, j) => j === i ? { ...x, type: t } : x))} style={{
                    flex: 1, padding: '5px', fontSize: 10,
                    background: r.type === t ? 'var(--burgundy)' : 'transparent',
                    color: r.type === t ? '#fff' : 'rgba(232,223,202,.7)',
                    border: `1px solid ${r.type === t ? 'var(--burgundy-soft)' : 'rgba(212,184,118,.25)'}`,
                    borderRadius: 3, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1,
                  }}>{t.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <Field label="Name" value={r.name} onChange={v => upd('reps', data.reps.map((x, j) => j === i ? { ...x, name: v } : x))} />
            <Field label="Location" value={r.location} onChange={v => upd('reps', data.reps.map((x, j) => j === i ? { ...x, location: v } : x))} />
            <Field label="Phone" value={r.phone} onChange={v => upd('reps', data.reps.map((x, j) => j === i ? { ...x, phone: v } : x))} />
            <Field label="Email" value={r.email} onChange={v => upd('reps', data.reps.map((x, j) => j === i ? { ...x, email: v } : x))} />
          </div>
        ))}
        {data.reps.length < 3 && (
          <button onClick={() => upd('reps', [...data.reps, { type: 'Agency', name: '', location: '', phone: '', email: '' }])} style={{
            width: '100%', padding: '8px', background: 'transparent',
            border: '1px dashed rgba(212,184,118,.35)', color: 'rgba(212,184,118,.85)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 1,
            cursor: 'pointer', borderRadius: 4, textTransform: 'uppercase',
          }}>+ Add Representation</button>
        )}
      </Accordion>

      <Accordion title="Television" count={data.television.length} tipKey="tv" open={open.tv} onToggle={t('tv')}>
        <CreditEditor items={data.television} setItems={v => upd('television', v)} roleLabel="Role (Series Regular, Guest Star…)" />
      </Accordion>

      <Accordion title="Film" count={data.film.length} tipKey="film" open={open.film} onToggle={t('film')}>
        <CreditEditor items={data.film} setItems={v => upd('film', v)} roleLabel="Role (Lead, Supporting…)" studioLabel="Studio / Director" />
      </Accordion>

      <Accordion title="Theatre" count={data.theatre.length} tipKey="theatre" open={open.theatre} onToggle={t('theatre')}>
        <CreditEditor items={data.theatre} setItems={v => upd('theatre', v)} projectLabel="Production" roleLabel="Character" studioLabel="Theater Company" />
      </Accordion>

      <Accordion title="Commercial" count={data.commercial.length} tipKey="commercial" open={open.commercial} onToggle={t('commercial')}>
        <div style={{ fontSize: 11, color: 'rgba(232,223,202,.55)', marginBottom: 8, lineHeight: 1.5 }}>
          Industry standard: list "*Conflicts available upon request" rather than specific brands.
        </div>
        <CreditEditor items={data.commercial} setItems={v => upd('commercial', v)} />
      </Accordion>

      <Accordion title="New Media" count={data.newMedia.length} tipKey="newMedia" open={open.newMedia} onToggle={t('newMedia')}>
        <CreditEditor items={data.newMedia} setItems={v => upd('newMedia', v)} studioLabel="Platform" />
      </Accordion>

      <Accordion title="Voiceover" count={data.voiceover.length} tipKey="voiceover" open={open.voiceover} onToggle={t('voiceover')}>
        <CreditEditor items={data.voiceover} setItems={v => upd('voiceover', v)} studioLabel="Studio / Network" />
      </Accordion>

      <Accordion title="Training" count={data.training.length} tipKey="training" open={open.training} onToggle={t('training')}>
        <TrainingEditor items={data.training} setItems={v => upd('training', v)} />
      </Accordion>

      <Accordion title="Special Skills" tipKey="skills" open={open.skills} onToggle={t('skills')}>
        <Field label="Skills (comma-separated)" value={data.skills} onChange={v => upd('skills', v)} textarea rows={6} />
        <div style={{ fontSize: 10, color: 'rgba(232,223,202,.4)', lineHeight: 1.5 }}>
          Tip: include languages, dialects, sports (with years), instruments, and any work permits or accounts (Coogan, etc.)
        </div>
      </Accordion>
    </div>
  );
}

Object.assign(window, { BuilderPanel });
