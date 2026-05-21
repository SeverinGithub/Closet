// Closet — shared UI components
import React from 'react';
import { useCloset } from '../store.jsx';

// ─────────────────────────────────────────────────────────────
// Tiny inline icons (editorial weight)
// ─────────────────────────────────────────────────────────────
const ICON_PATHS = {
  home:     <path d="M3 11l9-8 9 8v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z" />,
  fits:     <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  plus:     <path d="M12 5v14M5 12h14" />,
  search:   <><circle cx="11" cy="11" r="7" /><path d="M21 21l-5-5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
  stats:    <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />,
  sparkle:  <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /><path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9L19 14z" /></>,
  chevron:  <path d="M9 6l6 6-6 6" />,
  back:     <path d="M15 6l-6 6 6 6" />,
  close:    <path d="M6 6l12 12M18 6l-6 6-6 6" />,
  camera:   <><path d="M4 7h3l2-3h6l2 3h3a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" /><circle cx="12" cy="13" r="4" /></>,
  image:    <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></>,
  cloud:    <path d="M7 18a4 4 0 010-8 5 5 0 019.6-1.5A4 4 0 0118 18H7z" />,
  sun:      <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  heart:    <path d="M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z" />,
  sliders:  <><path d="M4 6h12M20 6h0M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="18" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></>,
  shuffle:  <path d="M16 3h5v5M4 20l17-17M21 16v5h-5M15 15l6 6M4 4l5 5" />,
  arrowR:   <path d="M5 12h14M13 6l6 6-6 6" />,
  edit:     <path d="M4 20h4l11-11-4-4L4 16v4z" />,
  check:    <path d="M5 12l5 5L20 6" />,
};

export const Icon = ({ name, size = 18, stroke = 'currentColor', fill = 'none', sw = 1.4 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {ICON_PATHS[name]}
  </svg>
);

// pick legible text for a swatch tone
export function tonalText(hex, alpha = 1) {
  const n = parseInt(String(hex).replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? `rgba(20,18,14,${alpha})` : `rgba(245,240,228,${alpha})`;
}

// ─────────────────────────────────────────────────────────────
// Item tile — placeholder representation of a garment.
// 'photo' = full-bleed swatch · 'cutout' = silhouette on neutral surface
// ─────────────────────────────────────────────────────────────
const SILHOUETTES = {
  OUTERWEAR: 'M30 18h40l8 18-6 6v40H28V42l-6-6 8-18z',
  TOPS:      'M32 22h36l10 14-8 4v36H30V40l-8-4 10-14z',
  BOTTOMS:   'M36 18h28l6 30 4 36H58l-4-32h-8l-4 32H30l4-36 2-30z',
  DRESSES:   'M34 18h32l8 16-4 6 10 42H22l10-42-4-6 6-16z',
  SHOES:     'M16 60c8-12 28-16 56-12 8 2 12 8 12 14H16v-2z',
  'ACCESS.': 'M30 30h40v10a20 20 0 01-40 0v-10zM38 30v-6a10 10 0 0120 0v6',
};

export const ItemTile = ({ item, height, mode = 'photo', showLabel = true, onClick, frame = true }) => {
  if (!item) return null;
  const ar = item.ar || 1.2;
  const h = height || Math.round(160 * ar);
  const patClass = item.pat && item.pat !== 'solid' ? `pat-${item.pat}` : '';

  if (mode === 'cutout') {
    return (
      <div onClick={onClick} className="press" style={{
        background: 'var(--surface)',
        border: frame ? '0.5px solid var(--line)' : 'none',
        borderRadius: 4, overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative', padding: '14px 10px 10px',
      }}>
        <svg viewBox="0 0 100 90" style={{ width: '100%', height: h - 36, display: 'block' }}>
          <defs>
            <clipPath id={`clip-${item.id}`}>
              <path d={SILHOUETTES[item.cat] || SILHOUETTES.TOPS} />
            </clipPath>
          </defs>
          <g clipPath={`url(#clip-${item.id})`}>
            <rect width="100" height="90" fill={item.tone} />
            <foreignObject width="100" height="90">
              <div className={patClass} style={{ width: '100%', height: '100%' }} />
            </foreignObject>
          </g>
        </svg>
        {showLabel && (
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 11, letterSpacing: -0.1, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.name}</div>
            <div className="eyebrow" style={{ fontSize: 8 }}>{item.cat}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div onClick={onClick} className={`press ${patClass}`} style={{
      height: h, borderRadius: 4, background: item.tone, overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default', position: 'relative',
      border: frame ? '0.5px solid rgba(0,0,0,0.06)' : 'none',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.08), transparent 30%, transparent 70%, rgba(0,0,0,0.12))',
      }} />
      {showLabel && (
        <>
          <div style={{
            position: 'absolute', top: 8, left: 10,
            fontFamily: 'var(--mono)', fontSize: 8.5, letterSpacing: '0.14em',
            color: tonalText(item.tone, 0.75), textTransform: 'uppercase',
          }}>{item.cat}</div>
          <div style={{
            position: 'absolute', bottom: 8, left: 10, right: 10,
            fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1, fontStyle: 'italic',
            color: tonalText(item.tone, 1),
          }}>{item.name}</div>
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Chip — pill button
// ─────────────────────────────────────────────────────────────
export const Chip = ({ children, active, onClick, mono }) => (
  <button
    className={`chip press ${active ? 'is-on' : ''}`}
    onClick={onClick}
    style={mono ? { fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' } : {}}
  >
    {children}
  </button>
);

// ─────────────────────────────────────────────────────────────
// Eyebrow / section header
// ─────────────────────────────────────────────────────────────
export const SectionHead = ({ eyebrow, title, action, onAction, italic }) => (
  <div style={{ padding: '0 20px', marginBottom: 14 }}>
    {eyebrow && <div className="eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</div>}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
      <h2 className="h-display" style={{ margin: 0, fontSize: 26, lineHeight: 1.1, color: 'var(--ink)', paddingBottom: 2, flex: 1 }}>
        {italic ? <em>{title}</em> : title}
      </h2>
      {action && (
        <button onClick={onAction} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--ink-soft)', fontFamily: 'var(--mono)', letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0, paddingBottom: 4 }}>
          {action} <Icon name="chevron" size={11} sw={1.5} />
        </button>
      )}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Tab bar — bottom nav
// ─────────────────────────────────────────────────────────────
export const TabBar = ({ active, onChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'fits', label: 'Fits', icon: 'fits' },
    { id: 'editor', label: 'Add', icon: 'plus' },
  ];
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
      paddingTop: 10,
      background: 'linear-gradient(180deg, transparent, var(--bg) 30%)',
      zIndex: 100,
    }}>
      <div style={{
        margin: '0 16px', background: 'var(--surface)',
        border: '0.5px solid var(--line)', borderRadius: 100, padding: 4,
        display: 'flex',
        boxShadow: '0 12px 30px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)',
      }}>
        {tabs.map((t) => {
          const on = active === t.id;
          return (
            <button key={t.id} onClick={() => onChange(t.id)} className="press" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, padding: '10px 8px', borderRadius: 100,
              background: on ? 'var(--ink)' : 'transparent',
              color: on ? 'var(--bg)' : 'var(--ink-soft)',
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', fontWeight: 500, transition: 'all 0.2s',
            }}>
              <Icon name={t.icon} size={14} sw={1.4} />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Outfit card — 2x2 stack composition of items
// ─────────────────────────────────────────────────────────────
export const OutfitCard = ({ outfit, onClick, large = false }) => {
  const { itemsById } = useCloset();
  const items = outfit.items.map((id) => itemsById[id]).filter(Boolean);
  if (items.length === 0) return null;
  const cells = items.slice(0, 4);
  while (cells.length < 4) cells.push(items[cells.length % items.length]);

  return (
    <div onClick={onClick} className="press" style={{
      background: 'var(--surface)', border: '0.5px solid var(--line)',
      borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
    }}>
      <div style={{ position: 'relative', paddingBottom: large ? '115%' : '100%' }}>
        <div style={{
          position: 'absolute', inset: 0, display: 'grid',
          gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
          gap: 1, background: 'var(--line)',
        }}>
          {cells.map((it, i) => (
            <div key={i} className={it.pat !== 'solid' ? `pat-${it.pat}` : ''}
              style={{ background: it.tone, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent 40%, rgba(0,0,0,0.08))',
              }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: large ? 22 : 17, lineHeight: 1.0, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {outfit.name}
        </div>
        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
          <div style={{ fontSize: 9.5, color: 'var(--ink-soft)', fontFamily: 'var(--mono)', letterSpacing: '0.08em', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
            {items.length} pieces · {outfit.occasion?.[0]}
          </div>
          <div className="eyebrow" style={{ fontSize: 9, flexShrink: 0 }}>{outfit.mood}</div>
        </div>
      </div>
    </div>
  );
};
