// Shared primitives used across sections

const { useState, useRef, useEffect } = React;

// Section wrapper — full-bleed with inner container
function Section({ id, bg = 'paper', children, style = {}, label, chapter }) {
  const bgColor = {
    paper: '#F7F5F0',
    ink:   '#0A0A0A',
    pure:  '#FFFFFF',
    stone: '#F0EDE6',
  }[bg] || bg;
  const textColor = bg === 'ink' ? '#F7F5F0' : '#0A0A0A';
  return (
    <section
      id={id}
      data-screen-label={label || id}
      data-variant-bg={bg}
      style={{
        background: bgColor,
        color: textColor,
        padding: '96px 0',
        position: 'relative',
        ...style
      }}
    >
      <div style={{
        maxWidth: 1360, margin: '0 auto', padding: '0 48px',
        position: 'relative',
      }}>
        {chapter && <ChapterMark number={chapter.number} title={chapter.title} />}
        {children}
      </div>
    </section>
  );
}

function ChapterMark({ number, title }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 16,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
      marginBottom: 64,
      borderTop: '1px solid currentColor',
      paddingTop: 16,
      opacity: 0.85,
    }}>
      <span>CH.{String(number).padStart(2, '0')}</span>
      <span style={{ opacity: 0.55 }}>/</span>
      <span>{title}</span>
    </div>
  );
}

// The signature "O" mark — the logo frame reused as graphic device
function FrameBox({ children, style = {}, tight = false, color = 'currentColor' }) {
  return (
    <div style={{
      border: `2px solid ${color}`,
      padding: tight ? '12px 16px' : '24px 32px',
      display: 'inline-block',
      ...style
    }}>
      {children}
    </div>
  );
}

// The Origines "target O" glyph — logo mark only, scalable
function OMark({ size = 48, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="14" />
      <circle cx="50" cy="50" r="8" fill={color} />
    </svg>
  );
}

// Mono eyebrow — small uppercase label
function Eyebrow({ children, style = {} }) {
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
      opacity: 0.7,
      ...style
    }}>{children}</div>
  );
}

// Display headline
function Display({ children, size = '3xl', style = {}, as: Tag = 'h2' }) {
  const sizes = { xl: 40, '2xl': 56, '3xl': 72, '4xl': 96, '5xl': 128, '6xl': 180 };
  return (
    <Tag style={{
      fontFamily: "'Archivo', sans-serif",
      fontWeight: 900,
      fontSize: sizes[size] || 72,
      lineHeight: 0.92,
      letterSpacing: '-0.03em',
      margin: 0,
      textWrap: 'balance',
      ...style
    }}>{children}</Tag>
  );
}

// Body paragraph
function Body({ children, size = 'md', style = {} }) {
  const sizes = { sm: 14, base: 16, md: 18, lg: 21 };
  return (
    <p style={{
      fontFamily: "'Inter Tight', sans-serif",
      fontSize: sizes[size],
      lineHeight: 1.55,
      margin: 0,
      textWrap: 'pretty',
      ...style
    }}>{children}</p>
  );
}

// Divider — thin rule with optional mono label
function Rule({ label, style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...style }}>
      {label && <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6,
      }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: 'currentColor', opacity: 0.2 }} />
    </div>
  );
}

// Image placeholder with caption, mimicking editorial style
function Placeholder({ ratio = '3/2', label = 'image', caption, bg = '#E8E5DE', style = {} }) {
  return (
    <figure style={{ margin: 0, ...style }}>
      <div style={{
        aspectRatio: ratio,
        background: `repeating-linear-gradient(135deg, ${bg}, ${bg} 12px, color-mix(in srgb, ${bg} 85%, #000) 12px, color-mix(in srgb, ${bg} 85%, #000) 13px)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(0,0,0,0.08)',
      }}>
        [ {label} ]
      </div>
      {caption && (
        <figcaption style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, letterSpacing: '0.08em',
          marginTop: 10, opacity: 0.6, textTransform: 'uppercase',
        }}>{caption}</figcaption>
      )}
    </figure>
  );
}

Object.assign(window, {
  Section, ChapterMark, FrameBox, OMark, Eyebrow, Display, Body, Rule, Placeholder
});
