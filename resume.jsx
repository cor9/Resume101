// Resume — the actual printable artifact.
// Three column credits row: Project | Role | Studio
// Layout variants: classic (headshot top-left, contact top-right),
//                  banner (centered name banner, headshot below),
//                  side (headshot full left, content right column)

const { useEffect, useRef } = React;

function ResumeHeadshot({ src, placeholder = "8x10\nHEADSHOT" }) {
  return (
    <div style={{
      aspectRatio: '8 / 10',
      width: '100%',
      background: src ? `center/cover no-repeat url(${src})` : 'repeating-linear-gradient(135deg, #e8dcc1 0 8px, #ddc9a0 8px 16px)',
      border: '1px solid var(--rule)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#7a6a48',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 11,
      letterSpacing: 1,
      textAlign: 'center',
      whiteSpace: 'pre-line',
      lineHeight: 1.5,
    }}>
      {!src && placeholder}
    </div>
  );
}

function CreditRow({ project, role, studio, serif }) {
  // 3-column row. middle column dotted/leadered.
  if (!project) return null;
  return (
    <div className="credit-row" style={{
      display: 'grid',
      gridTemplateColumns: '1.05fr 1fr 1fr',
      columnGap: 14,
      padding: '3px 0',
      fontSize: 11.5,
      lineHeight: 1.4,
      alignItems: 'baseline',
    }}>
      <div style={{ fontFamily: serif, fontWeight: 600, color: '#0d0d0d' }}>{project}</div>
      <div style={{ fontStyle: role ? 'italic' : 'normal', color: '#1a1a1a' }}>{role}</div>
      <div style={{ color: '#1a1a1a', textAlign: 'right' }}>{studio}</div>
    </div>
  );
}

function SectionHeader({ title, accent = '#14233c', serif }) {
  return (
    <div style={{ marginTop: 12, marginBottom: 4 }}>
      <div style={{
        fontFamily: serif,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 3,
        color: accent,
        textTransform: 'uppercase',
        paddingBottom: 3,
        borderBottom: `1.5px solid ${accent}`,
      }}>{title}</div>
    </div>
  );
}

function ResumeBody({ data, sections, serif, accent }) {
  const cat = window.SECTION_CATALOG.filter(s => sections.includes(s.key));
  return (
    <>
      {cat.map(s => {
        const rows = data[s.key] || [];
        if (!rows.length) return null;
        return (
          <div key={s.key}>
            <SectionHeader title={s.label} accent={accent} serif={serif} />
            <div>
              {rows.map((r, i) => (
                <CreditRow key={i} {...r} serif={serif} />
              ))}
            </div>
          </div>
        );
      })}
      <SectionHeader title="Training" accent={accent} serif={serif} />
      <div>
        {(data.training || []).map((t, i) => (
          <CreditRow key={i} project={t.class} role={t.instructor} studio={t.location} serif={serif} />
        ))}
      </div>
      <SectionHeader title="Special Skills" accent={accent} serif={serif} />
      <div style={{ fontSize: 11, lineHeight: 1.55, padding: '4px 0 2px', color: '#1a1a1a', textAlign: 'justify' }}>
        {data.skills}
      </div>
    </>
  );
}

function HeaderClassic({ data, serif, accent }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '120px 1fr auto',
      columnGap: 18,
      alignItems: 'start',
      paddingBottom: 12,
      borderBottom: `2px double ${accent}`,
    }}>
      <ResumeHeadshot src={data.headshot} />
      <div style={{ paddingTop: 6 }}>
        <div style={{
          fontFamily: serif, fontSize: 32, fontWeight: 700,
          color: accent, letterSpacing: 1, lineHeight: 1.05,
        }}>{data.actor.name}</div>
        <div style={{
          marginTop: 4,
          fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: '#6b1f2a',
          fontWeight: 600,
        }}>{data.actor.union}</div>
        <div style={{ marginTop: 8, fontSize: 10.5, color: '#333', lineHeight: 1.6 }}>
          {data.actor.height && <span>HEIGHT: {data.actor.height}&nbsp;&nbsp;</span>}
          {data.actor.hair && <span>HAIR: {data.actor.hair}&nbsp;&nbsp;</span>}
          {data.actor.eyes && <span>EYES: {data.actor.eyes}&nbsp;&nbsp;</span>}
          {data.actor.age && <span>{data.actor.age}</span>}
        </div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 10, lineHeight: 1.5, color: '#1a1a1a', minWidth: 180 }}>
        {data.reps.map((r, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <div style={{ fontFamily: serif, fontWeight: 700, color: accent, fontSize: 11 }}>
              {r.name}{r.type === 'Manager' ? ' (Manager)' : ''}
            </div>
            <div>{r.location}</div>
            <div>{r.phone}</div>
            <div style={{ fontStyle: 'italic' }}>{r.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderBanner({ data, serif, accent }) {
  return (
    <div style={{ paddingBottom: 12, borderBottom: `2px double ${accent}` }}>
      <div style={{ textAlign: 'center', paddingTop: 6 }}>
        <div style={{ fontSize: 9, letterSpacing: 6, color: '#6b1f2a', textTransform: 'uppercase', marginBottom: 6 }}>
          {data.actor.union}
        </div>
        <div style={{
          fontFamily: serif, fontSize: 40, fontWeight: 700, color: accent,
          letterSpacing: 2, lineHeight: 1, textTransform: 'uppercase',
        }}>{data.actor.name}</div>
        <div style={{ marginTop: 8, fontSize: 10, letterSpacing: 2, color: '#333' }}>
          {[data.actor.height, data.actor.hair && `Hair: ${data.actor.hair}`, data.actor.eyes && `Eyes: ${data.actor.eyes}`, data.actor.age].filter(Boolean).join('  •  ')}
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '140px 1fr 1fr',
        columnGap: 18,
        alignItems: 'end',
        marginTop: 14,
      }}>
        <ResumeHeadshot src={data.headshot} />
        {data.reps.slice(0,2).map((r, i) => (
          <div key={i} style={{ fontSize: 10.5, lineHeight: 1.55 }}>
            <div style={{ fontFamily: serif, fontWeight: 700, color: accent, fontSize: 12 }}>
              {r.name}
            </div>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#6b1f2a' }}>{r.type}</div>
            <div style={{ marginTop: 3 }}>{r.location}</div>
            <div>{r.phone}</div>
            <div style={{ fontStyle: 'italic' }}>{r.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderSide({ data, serif, accent }) {
  // returns nothing here; layout=side renders headshot in its own column
  return (
    <div style={{ paddingBottom: 10, borderBottom: `2px double ${accent}` }}>
      <div style={{
        fontFamily: serif, fontSize: 34, fontWeight: 700, color: accent,
        letterSpacing: 1, lineHeight: 1,
      }}>{data.actor.name}</div>
      <div style={{ marginTop: 4, fontSize: 11, letterSpacing: 4, color: '#6b1f2a', textTransform: 'uppercase', fontWeight: 600 }}>
        {data.actor.union}
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', columnGap: 14, marginTop: 10,
        fontSize: 10, lineHeight: 1.5, color: '#333',
      }}>
        <div>
          {data.actor.height && <div>HEIGHT: {data.actor.height}</div>}
          {data.actor.hair && <div>HAIR: {data.actor.hair}</div>}
          {data.actor.eyes && <div>EYES: {data.actor.eyes}</div>}
          {data.actor.age && <div>{data.actor.age}</div>}
        </div>
        {data.reps.slice(0, 2).map((r, i) => (
          <div key={i}>
            <div style={{ fontFamily: serif, fontWeight: 700, color: accent, fontSize: 10.5 }}>{r.name}</div>
            <div style={{ fontSize: 8.5, letterSpacing: 2, color: '#6b1f2a', textTransform: 'uppercase' }}>{r.type}</div>
            <div>{r.phone}</div>
            <div style={{ fontStyle: 'italic' }}>{r.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Resume({ data, tweaks }) {
  const sections = ['television', 'film', 'theatre', 'commercial', 'newMedia', 'voiceover'];
  const fontPair = FONT_PAIRS[tweaks.fontPair] || FONT_PAIRS.classic;
  const accent = tweaks.accent || '#14233c';
  const layout = tweaks.layout || 'classic';

  const paperStyle = {
    width: '8.5in',
    minHeight: '11in',
    background: 'var(--paper)',
    color: '#1a1a1a',
    fontFamily: fontPair.body,
    padding: '0.5in 0.55in',
    boxShadow: '0 30px 60px -20px rgba(0,0,0,.5), 0 10px 30px -10px rgba(0,0,0,.4)',
    position: 'relative',
  };

  if (layout === 'side') {
    return (
      <div style={paperStyle} id="resume-paper">
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 22 }}>
          <div>
            <ResumeHeadshot src={data.headshot} />
            <div style={{ marginTop: 14, fontSize: 9.5, letterSpacing: 2, color: '#6b1f2a', textTransform: 'uppercase', fontWeight: 700 }}>
              Representation
            </div>
            <div style={{ height: 1, background: 'var(--rule)', margin: '4px 0 8px' }} />
            {data.reps.map((r, i) => (
              <div key={i} style={{ fontSize: 10, lineHeight: 1.55, marginBottom: 10 }}>
                <div style={{ fontFamily: fontPair.heading, fontWeight: 700, color: accent, fontSize: 11 }}>
                  {r.name}
                </div>
                <div style={{ fontSize: 8.5, letterSpacing: 2, color: '#6b1f2a', textTransform: 'uppercase' }}>{r.type}</div>
                <div style={{ marginTop: 2 }}>{r.location}</div>
                <div>{r.phone}</div>
                <div style={{ fontStyle: 'italic', wordBreak: 'break-all' }}>{r.email}</div>
              </div>
            ))}
            <div style={{ marginTop: 14, fontSize: 9.5, letterSpacing: 2, color: '#6b1f2a', textTransform: 'uppercase', fontWeight: 700 }}>
              Vitals
            </div>
            <div style={{ height: 1, background: 'var(--rule)', margin: '4px 0 8px' }} />
            <div style={{ fontSize: 10, lineHeight: 1.7, color: '#333' }}>
              {data.actor.height && <div>HEIGHT: {data.actor.height}</div>}
              {data.actor.hair && <div>HAIR: {data.actor.hair}</div>}
              {data.actor.eyes && <div>EYES: {data.actor.eyes}</div>}
              {data.actor.age && <div>{data.actor.age}</div>}
            </div>
          </div>
          <div>
            <div style={{
              fontFamily: fontPair.heading, fontSize: 36, fontWeight: 700, color: accent,
              letterSpacing: 1, lineHeight: 1,
            }}>{data.actor.name}</div>
            <div style={{ marginTop: 4, fontSize: 11, letterSpacing: 4, color: '#6b1f2a', textTransform: 'uppercase', fontWeight: 600, paddingBottom: 8, borderBottom: `2px double ${accent}` }}>
              {data.actor.union}
            </div>
            <ResumeBody data={data} sections={sections} serif={fontPair.heading} accent={accent} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={paperStyle} id="resume-paper">
      {layout === 'banner' ? (
        <HeaderBanner data={data} serif={fontPair.heading} accent={accent} />
      ) : (
        <HeaderClassic data={data} serif={fontPair.heading} accent={accent} />
      )}
      <ResumeBody data={data} sections={sections} serif={fontPair.heading} accent={accent} />
    </div>
  );
}

window.FONT_PAIRS = {
  classic:    { label: 'Classic',    heading: "'Playfair Display', serif",      body: "'Inter', sans-serif" },
  editorial:  { label: 'Editorial',  heading: "'Cormorant Garamond', serif",    body: "'Manrope', sans-serif" },
  caslon:     { label: 'Caslon',     heading: "'Libre Caslon Text', serif",     body: "'Work Sans', sans-serif" },
  garamond:   { label: 'Garamond',   heading: "'EB Garamond', serif",           body: "'EB Garamond', serif" },
  modern:     { label: 'Modern',     heading: "'Manrope', sans-serif",          body: "'Manrope', sans-serif" },
};

const FONT_PAIRS = window.FONT_PAIRS;

Object.assign(window, { Resume, ResumeHeadshot });
