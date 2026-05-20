// Item Detail screen
import React from 'react';
import { useCloset } from '../store.jsx';
import { Icon, Chip, SectionHead, ItemTile, OutfitCard, tonalText } from '../components/ui.jsx';

const StatTileMini = ({ label, value }) => (
  <div style={{ background: 'var(--surface)', padding: '12px 12px 14px' }}>
    <div className="eyebrow" style={{ fontSize: 8.5 }}>{label}</div>
    <div style={{ fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1, marginTop: 4 }}>{value}</div>
  </div>
);

function costPerWear(item) {
  const raw = parseFloat(String(item.price || '').replace(/[^0-9.]/g, ''));
  if (!raw || !item.worn) return '—';
  return `€ ${(raw / item.worn).toFixed(2)}`;
}

export default function ItemDetail({ itemId, mode, onBack, onNav }) {
  const { items, itemsById, outfits } = useCloset();

  const item = itemsById[itemId] || items[0];
  const inOutfits = outfits.filter((o) => o.items.includes(item.id));
  const combineWith = items.filter((i) => i.cat !== item.cat && i.id !== item.id).slice(0, 3);

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4} />
        </button>
      </div>

      {/* hero swatch */}
      <div className={item.pat !== 'solid' ? `pat-${item.pat}` : ''} style={{
        margin: '0 20px', height: 320, background: item.tone,
        borderRadius: 6, position: 'relative', overflow: 'hidden',
        border: '0.5px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent 30%, transparent 70%, rgba(0,0,0,0.18))',
        }} />
        <div style={{
          position: 'absolute', top: 14, left: 16,
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: tonalText(item.tone, 0.8),
        }}>{item.cat}</div>
        <div style={{
          position: 'absolute', bottom: 18, left: 18, right: 18,
          fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 36, lineHeight: 0.95,
          color: tonalText(item.tone, 1),
        }}>{item.name}</div>
      </div>

      {/* stats */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
          background: 'var(--line)', border: '0.5px solid var(--line)', borderRadius: 4, overflow: 'hidden',
        }}>
          <StatTileMini label="Worn" value={`${item.worn}×`} />
          <StatTileMini label="Last" value={item.last} />
          <StatTileMini label="Cost / wear" value={costPerWear(item)} />
        </div>
      </div>

      {/* tags */}
      {item.tags && item.tags.length > 0 && (
        <div style={{ padding: '20px 20px 0' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Tags</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {item.tags.map((t) => <Chip key={t}># {t}</Chip>)}
          </div>
        </div>
      )}

      {/* worn with */}
      <div style={{ paddingTop: 28 }}>
        <SectionHead eyebrow={`In ${inOutfits.length} outfits`} title="Pairs well with" italic />
        <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 20px' }}>
          {inOutfits.length > 0 ? inOutfits.map((o) => (
            <div key={o.id} style={{ flex: '0 0 150px' }}>
              <OutfitCard outfit={o} onClick={() => onNav('outfit', o.id)} />
            </div>
          )) : (
            <div style={{ flex: 1, padding: 20, textAlign: 'center', color: 'var(--ink-soft)', fontStyle: 'italic', fontFamily: 'var(--serif)' }}>
              No outfits yet — try the generator.
            </div>
          )}
        </div>
      </div>

      {/* combine with */}
      <div style={{ paddingTop: 28 }}>
        <SectionHead eyebrow="AI Suggests" title="Combine with" />
        <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {combineWith.map((i) => (
            <ItemTile key={i.id} item={i} height={140} mode={mode} onClick={() => onNav('item', i.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
