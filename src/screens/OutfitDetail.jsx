// Outfit Detail screen
import React from 'react';
import { useCloset } from '../store.jsx';
import { Icon, SectionHead, OutfitCard, tonalText } from '../components/ui.jsx';

export default function OutfitDetail({ outfitId, onBack, onNav }) {
  const { outfits, itemsById, liked, toggleLike, wearOutfit, wearLog, todayIso } = useCloset();

  const outfit = outfits.find((o) => o.id === outfitId) || outfits[0];
  const items = outfit.items.map((id) => itemsById[id]).filter(Boolean);
  const issueNum = String(outfits.indexOf(outfit) + 1).padStart(2, '0');
  const isLiked = liked.includes(outfit.id);
  const wornToday = wearLog[todayIso] === outfit.id;

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      {/* nav */}
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4} />
        </button>
        <button onClick={() => toggleLike(outfit.id)} className="press" style={{ padding: 8 }}
          aria-label={isLiked ? 'Unlike outfit' : 'Like outfit'}>
          <Icon name="heart" size={20} sw={1.4}
            fill={isLiked ? 'var(--accent)' : 'none'}
            stroke={isLiked ? 'var(--accent)' : 'currentColor'} />
        </button>
      </div>

      {/* hero */}
      <div style={{ padding: '0 20px' }}>
        <div className="eyebrow">Look № {issueNum} · {outfit.mood}</div>
        <div className="h-display" style={{ fontSize: 56, marginTop: 4, color: 'var(--ink)' }}>
          <em>{outfit.name}</em>
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)', marginTop: 8 }}>
          A {outfit.items.length}-piece composition · {outfit.occasion.join(', ')}.
        </div>
      </div>

      {/* big stack */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{
          border: '0.5px solid var(--line)', borderRadius: 6, overflow: 'hidden',
          background: 'var(--line)', display: 'grid', gap: 1,
          gridTemplateColumns: '1fr 1fr',
        }}>
          {items.map((it) => (
            <div key={it.id} style={{ position: 'relative', paddingBottom: '100%' }}>
              <div style={{
                position: 'absolute', inset: 0, overflow: 'hidden',
                background: it.image ? 'var(--surface)' : it.tone,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {it.image ? (
                  <img src={it.image} alt={it.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <div className={it.pat !== 'solid' ? `pat-${it.pat}` : ''}
                    style={{ position: 'absolute', inset: 0 }} />
                )}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, transparent, transparent 60%, rgba(0,0,0,0.32))',
                  pointerEvents: 'none',
                }} />
                <div style={{
                  position: 'absolute', bottom: 8, left: 10,
                  fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13,
                  color: it.image ? 'rgba(245,240,228,1)' : tonalText(it.tone, 1),
                }}>{it.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* item list */}
      <div style={{ padding: '24px 20px 0' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>The pieces</div>
        {items.map((it) => (
          <button key={it.id} onClick={() => onNav('item', it.id)} className="press" style={{
            width: '100%', padding: '10px 0', display: 'flex', alignItems: 'center', gap: 12,
            borderBottom: '0.5px solid var(--line)', textAlign: 'left',
          }}>
            <div style={{
              width: 44, height: 56, borderRadius: 3, flexShrink: 0, overflow: 'hidden',
              background: it.image ? 'var(--surface)' : it.tone,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {it.image
                ? <img src={it.image} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <div className={it.pat !== 'solid' ? `pat-${it.pat}` : ''} style={{ width: '100%', height: '100%' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="eyebrow" style={{ fontSize: 8.5 }}>{it.cat}</div>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.1 }}>{it.name}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>Worn {it.worn}×</div>
            </div>
            <Icon name="chevron" size={14} sw={1.4} stroke="var(--ink-mute)" />
          </button>
        ))}
      </div>

      {/* alternatives */}
      <div style={{ padding: '32px 0 0' }}>
        <SectionHead eyebrow="Similar in spirit" title="Or try" italic />
        <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 20px' }}>
          {outfits.filter((o) => o.mood === outfit.mood && o.id !== outfit.id).slice(0, 4).map((o) => (
            <div key={o.id} style={{ flex: '0 0 150px' }}>
              <OutfitCard outfit={o} onClick={() => onNav('outfit', o.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA bar */}
      <div style={{ padding: '28px 20px 0', display: 'flex', gap: 8 }}>
        <button onClick={() => wearOutfit(outfit.id)} className="press" style={{
          flex: 1, padding: 14,
          background: wornToday ? 'transparent' : 'var(--ink)',
          color: wornToday ? 'var(--ink)' : 'var(--bg)',
          border: wornToday ? '0.5px solid var(--ink)' : 'none',
          borderRadius: 100, fontFamily: 'var(--mono)', fontSize: 11,
          letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name="check" size={13} sw={1.6} /> {wornToday ? 'Worn today' : 'Wear today'}
        </button>
        <button onClick={() => onNav('calendar')} className="press" style={{
          padding: '14px 18px', background: 'transparent',
          border: '0.5px solid var(--line)', borderRadius: 100, color: 'var(--ink)',
        }}>
          <Icon name="calendar" size={15} sw={1.4} />
        </button>
      </div>
    </div>
  );
}
