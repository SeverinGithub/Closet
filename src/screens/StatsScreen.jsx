// Stats screen — the wardrobe report
import React from 'react';
import { useCloset } from '../store.jsx';
import { Icon, SectionHead, ItemTile } from '../components/ui.jsx';

const BigStat = ({ label, value, big }) => (
  <div style={{ background: 'var(--surface)', padding: big ? '18px 16px 20px' : '18px 12px 20px' }}>
    <div className="eyebrow" style={{ fontSize: 9 }}>{label}</div>
    <div style={{
      fontFamily: 'var(--serif)', fontSize: big ? 56 : 38, lineHeight: 0.92, marginTop: 6,
      letterSpacing: '-0.02em', color: 'var(--ink)',
    }}>{value}</div>
  </div>
);

export default function StatsScreen({ mode, onBack, onNav }) {
  const { items, outfits, categories } = useCloset();

  const mostWorn = [...items].sort((a, b) => b.worn - a.worn).slice(0, 5);
  const unworn = [...items].sort((a, b) => a.worn - b.worn).slice(0, 4);
  const catTotals = categories.map((c) => ({
    c,
    count: items.filter((i) => i.cat === c).length,
    worn: items.filter((i) => i.cat === c).reduce((s, i) => s + i.worn, 0),
  }));
  const maxWorn = Math.max(1, ...catTotals.map((c) => c.worn));

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4} />
        </button>
        <div className="eyebrow">The Report</div>
        <div style={{ width: 36 }} />
      </div>

      {/* hero */}
      <div style={{ padding: '12px 20px 24px' }}>
        <div className="eyebrow">Q1 · 2026</div>
        <div className="h-display" style={{ fontSize: 44, color: 'var(--ink)', marginTop: 6 }}>
          A <em style={{ color: 'var(--accent)' }}>wardrobe</em>, read.
        </div>
      </div>

      {/* big numbers */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 1,
          background: 'var(--line)', border: '0.5px solid var(--line)', borderRadius: 4, overflow: 'hidden',
        }}>
          <BigStat label="Items in closet" value={items.length} big />
          <BigStat label="Avg worn / week" value="11" />
          <BigStat label="Outfit ideas" value={outfits.length} />
        </div>
      </div>

      {/* category breakdown */}
      <div style={{ padding: '0 20px' }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>By category — wear share</div>
        {catTotals.map((c) => (
          <div key={c.c} style={{ padding: '10px 0', borderBottom: '0.5px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.c}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontStyle: 'italic' }}>
                {c.worn}<span style={{ color: 'var(--ink-mute)', fontSize: 11, fontStyle: 'normal', fontFamily: 'var(--mono)' }}>×</span>
              </div>
            </div>
            <div style={{ height: 2, background: 'var(--line-soft)' }}>
              <div style={{ height: '100%', width: `${(c.worn / maxWorn) * 100}%`, background: 'var(--ink)', transition: 'width 0.5s' }} />
            </div>
          </div>
        ))}
      </div>

      {/* most worn */}
      <div style={{ paddingTop: 32 }}>
        <SectionHead eyebrow="Hall of fame" title="Most worn" italic />
        <div style={{ padding: '0 20px' }}>
          {mostWorn.map((it, i) => (
            <button key={it.id} onClick={() => onNav('item', it.id)} className="press" style={{
              width: '100%', padding: '10px 0', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: '0.5px solid var(--line)', textAlign: 'left',
            }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontStyle: 'italic', width: 28, color: 'var(--ink-mute)' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className={it.pat !== 'solid' ? `pat-${it.pat}` : ''}
                style={{ width: 40, height: 50, background: it.tone, borderRadius: 3, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="eyebrow" style={{ fontSize: 8.5 }}>{it.cat}</div>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.1 }}>{it.name}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1, textAlign: 'right' }}>{it.worn}<span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>×</span></div>
                <div style={{ fontSize: 9, color: 'var(--ink-mute)', fontFamily: 'var(--mono)', textAlign: 'right', letterSpacing: '0.1em', textTransform: 'uppercase' }}>since Jan</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* unworn */}
      <div style={{ paddingTop: 32 }}>
        <div style={{ padding: '0 20px', marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Neglected · {unworn.length}</div>
          <div className="h-display" style={{ fontSize: 28 }}>
            Forgotten <em>pieces</em>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>
            Untouched in 60+ days. Give them a moment.
          </div>
        </div>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 20px' }}>
          {unworn.map((it) => (
            <div key={it.id} style={{ flex: '0 0 120px' }}>
              <ItemTile item={it} height={150} mode={mode} onClick={() => onNav('item', it.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* footnote */}
      <div style={{
        marginTop: 36, padding: '18px 20px', textAlign: 'center',
        fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-mute)',
        borderTop: '0.5px solid var(--line)',
      }}>
        — End of report —
      </div>
    </div>
  );
}
