// Calendar screen — the wear diary
import React from 'react';
import { useCloset } from '../store.jsx';
import { Icon, Chip } from '../components/ui.jsx';
import { formatLast } from '../data.js';

export default function CalendarScreen({ onBack, onNav }) {
  const { outfits, itemsById, wearLog } = useCloset();

  // March 2026 grid — March 1, 2026 is a Sunday (Sun-first header).
  const header = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const cells = [];
  for (let d = 1; d <= 31; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const daysWorn = Object.keys(wearLog).filter((k) => k.startsWith('2026-03')).length;

  const lastWorn = Object.entries(wearLog)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 3)
    .map(([iso, oid]) => {
      const out = outfits.find((o) => o.id === oid);
      return { iso, out };
    })
    .filter((e) => e.out);

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4} />
        </button>
        <div className="eyebrow">The Diary</div>
        <div style={{ width: 36 }} />
      </div>

      {/* title */}
      <div style={{ padding: '12px 20px 6px' }}>
        <div className="h-display" style={{ fontSize: 44, color: 'var(--ink)' }}>
          <em>March</em>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
          2026 · {daysWorn} days worn
        </div>
      </div>

      {/* month selector */}
      <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '14px 20px 18px' }}>
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
          <Chip key={m} mono active={m === 'Mar'}>{m}</Chip>
        ))}
      </div>

      {/* weekday header */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
        {header.map((d, i) => (
          <div key={i} className="eyebrow" style={{ textAlign: 'center', fontSize: 9 }}>{d}</div>
        ))}
      </div>

      {/* grid */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const iso = `2026-03-${String(d).padStart(2, '0')}`;
          const oid = wearLog[iso];
          const out = oid ? outfits.find((o) => o.id === oid) : null;
          const swatches = out ? out.items.slice(0, 3).map((id) => itemsById[id]?.tone) : [];
          return (
            <div key={i} onClick={() => out && onNav('outfit', out.id)} className="press" style={{
              position: 'relative', paddingBottom: '100%', borderRadius: 3,
              background: out ? 'var(--surface)' : 'transparent',
              border: '0.5px solid var(--line)',
              cursor: out ? 'pointer' : 'default',
            }}>
              <div style={{
                position: 'absolute', inset: 0, padding: 4,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 13, lineHeight: 1, alignSelf: 'flex-start' }}>{d}</div>
                {swatches.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1, width: '70%' }}>
                    {swatches.map((c, j) => (
                      <div key={j} style={{ height: 3, background: c, borderRadius: 1 }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* legend */}
      <div style={{ padding: '18px 20px 0' }}>
        <hr className="rule" />
        <div style={{ padding: '14px 0' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Last worn</div>
          {lastWorn.map(({ iso, out }) => (
            <button key={iso} onClick={() => onNav('outfit', out.id)} className="press" style={{
              width: '100%', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '10px 0', borderBottom: '0.5px solid var(--line)',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18 }}>{out.name}</div>
                <div style={{ fontSize: 10, color: 'var(--ink-soft)', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {out.occasion?.[0]}
                </div>
              </div>
              <div className="eyebrow" style={{ fontFamily: 'var(--serif)', fontStyle: 'normal', fontSize: 24, color: 'var(--ink)', letterSpacing: 0 }}>
                {formatLast(iso)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
