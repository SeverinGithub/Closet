// FITS screen — outfit gallery + swipe generator
import React, { useState } from 'react';
import { useCloset } from '../store.jsx';
import { Icon, Chip, OutfitCard } from '../components/ui.jsx';

function SwipeGenerator({ onNav }) {
  const { outfits, itemsById, likeOutfit } = useCloset();
  const [vibe, setVibe] = useState('WORK');
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(0); // -1 left, +1 right, 0 idle
  const [saved, setSaved] = useState(0);

  const pool = outfits.filter((o) => o.mood === vibe);
  const cur = pool[idx % pool.length];

  const swipe = (d) => {
    setDir(d);
    if (d === 1 && cur) {
      likeOutfit(cur.id);
      setSaved((s) => s + 1);
    }
    setTimeout(() => {
      setIdx((i) => i + 1);
      setDir(0);
    }, 280);
  };

  if (!cur) return null;
  const items = cur.items.map((id) => itemsById[id]).filter(Boolean);

  return (
    <div>
      {/* vibe selector */}
      <div style={{ padding: '0 20px 20px' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Tonight's mood</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['WORK', 'CASUAL', 'EVENING'].map((v) => (
            <Chip key={v} active={vibe === v} onClick={() => { setVibe(v); setIdx(0); }} mono>
              {v}
            </Chip>
          ))}
        </div>
      </div>

      {/* card stack */}
      <div style={{ padding: '0 20px', position: 'relative', height: 480 }}>
        <div style={{
          position: 'absolute', inset: '0 36px 24px 36px', borderRadius: 8,
          background: 'var(--surface)', border: '0.5px solid var(--line)',
          opacity: 0.5, transform: 'translateY(8px) scale(0.96)',
        }} />
        <div style={{
          position: 'absolute', inset: '0 24px 12px 24px', borderRadius: 8,
          background: 'var(--surface)', border: '0.5px solid var(--line)',
          opacity: 0.7, transform: 'translateY(4px) scale(0.98)',
        }} />
        <div key={idx} style={{
          position: 'absolute', inset: '0 14px 0 14px', borderRadius: 8,
          background: 'var(--surface)', border: '0.5px solid var(--line)',
          overflow: 'hidden',
          transform: dir !== 0
            ? `translateX(${dir * 380}px) rotate(${dir * 14}deg)`
            : 'translateX(0) rotate(0)',
          transition: dir !== 0 ? 'transform 0.28s cubic-bezier(.5,0,.3,1), opacity 0.28s' : 'none',
          opacity: dir !== 0 ? 0 : 1,
          animation: dir === 0 ? 'fadeIn 0.25s' : 'none',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
            background: 'var(--line)',
          }}>
            {items.slice(0, 4).map((it) => (
              <div key={it.id} style={{ position: 'relative', paddingBottom: '100%' }}>
                <div style={{
                  position: 'absolute', inset: 0, overflow: 'hidden',
                  background: it.image ? 'var(--surface)' : it.tone,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {it.image ? (
                    <img src={it.image} alt={it.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                  ) : (
                    <div className={it.pat !== 'solid' ? `pat-${it.pat}` : ''}
                      style={{ position: 'absolute', inset: 0 }} />
                  )}
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent 40%, rgba(0,0,0,0.1))',
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '14px 16px' }}>
            <div className="eyebrow">{cur.mood} · {cur.occasion?.join(' · ')}</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 26, lineHeight: 1, marginTop: 6 }}>
              <em>{cur.name}</em>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--ink-soft)' }}>
              {items.map((it) => it.name).join(' · ')}
            </div>
          </div>

          {dir === 1 && (
            <div style={{
              position: 'absolute', top: 30, right: 24, padding: '6px 14px',
              border: '2px solid var(--accent)', color: 'var(--accent)',
              fontFamily: 'var(--mono)', letterSpacing: '0.16em', fontSize: 14,
              transform: 'rotate(12deg)', fontWeight: 600,
            }}>SAVE</div>
          )}
          {dir === -1 && (
            <div style={{
              position: 'absolute', top: 30, left: 24, padding: '6px 14px',
              border: '2px solid var(--ink-soft)', color: 'var(--ink-soft)',
              fontFamily: 'var(--mono)', letterSpacing: '0.16em', fontSize: 14,
              transform: 'rotate(-12deg)', fontWeight: 600,
            }}>PASS</div>
          )}
        </div>
      </div>

      {/* action buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 24 }}>
        <button onClick={() => swipe(-1)} className="press" style={{
          width: 54, height: 54, borderRadius: '50%',
          background: 'var(--surface)', border: '0.5px solid var(--line)',
          color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="close" size={20} sw={1.4} />
        </button>
        <button onClick={() => onNav('outfit', cur.id)} className="press" style={{
          width: 46, height: 46, borderRadius: '50%', marginTop: 4,
          background: 'transparent', border: '0.5px solid var(--line)',
          color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="search" size={16} sw={1.4} />
        </button>
        <button onClick={() => swipe(1)} className="press" style={{
          width: 54, height: 54, borderRadius: '50%',
          background: 'var(--accent)', color: '#fff',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="heart" size={20} sw={1.6} stroke="#fff" />
        </button>
      </div>

      <div style={{
        textAlign: 'center', marginTop: 16, fontSize: 10,
        color: 'var(--ink-mute)', fontFamily: 'var(--mono)', letterSpacing: '0.14em', textTransform: 'uppercase',
      }}>
        {saved} saved this session
      </div>
    </div>
  );
}

export default function FitsScreen({ mode, onNav }) {
  const { items, outfits } = useCloset();
  const [view, setView] = useState('grid'); // 'grid' | 'swipe'
  const [filter, setFilter] = useState('ALL');
  const [occasion, setOccasion] = useState(null);

  const moods = ['ALL', 'WORK', 'CASUAL', 'EVENING'];
  const occasions = ['Office', 'Date', 'Weekend', 'Travel', 'Party', 'Gym'];

  const filtered = outfits.filter((o) => (
    (filter === 'ALL' || o.mood === filter)
    && (!occasion || (o.occasion || []).includes(occasion))
  ));

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>

      {/* header */}
      <div style={{ padding: '8px 20px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="eyebrow">Volume II · Outfits</div>
            <div className="h-display" style={{ fontSize: 44, marginTop: 6, color: 'var(--ink)' }}>
              Your <em style={{ color: 'var(--accent)' }}>fits</em>
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
              {outfits.length} composed · {items.length} pieces in rotation
            </div>
          </div>
          <button onClick={() => onNav('outfitEditor')} className="press" style={{
            marginTop: 8, padding: '10px 16px', borderRadius: 100,
            background: 'var(--ink)', color: 'var(--bg)',
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
            textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}>
            <Icon name="plus" size={12} sw={1.8} /> New
          </button>
        </div>
      </div>

      {/* view toggle */}
      <div style={{ display: 'flex', gap: 0, padding: '0 20px 14px' }}>
        <button onClick={() => setView('grid')} className="press" style={{
          flex: 1, padding: '10px', borderRadius: '100px 0 0 100px',
          background: view === 'grid' ? 'var(--ink)' : 'transparent',
          color: view === 'grid' ? 'var(--bg)' : 'var(--ink-soft)',
          border: '0.5px solid var(--line)',
          borderRight: view === 'grid' ? 'none' : '0.5px solid var(--line)',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name="fits" size={12} sw={1.4} /> Gallery
        </button>
        <button onClick={() => setView('swipe')} className="press" style={{
          flex: 1, padding: '10px', borderRadius: '0 100px 100px 0',
          background: view === 'swipe' ? 'var(--ink)' : 'transparent',
          color: view === 'swipe' ? 'var(--bg)' : 'var(--ink-soft)',
          border: '0.5px solid var(--line)',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name="sparkle" size={12} sw={1.4} /> Generate
        </button>
      </div>

      {view === 'grid' ? (
        outfits.length === 0 ? (
          /* ── True empty state ── */
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 28, lineHeight: 1.2, color: 'var(--ink)', marginBottom: 10 }}>
              No outfits yet.
            </div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-soft)', marginBottom: 28 }}>
              Add pieces to your wardrobe first, then create your first outfit combination.
            </div>
            <button onClick={() => onNav('outfitEditor')} className="press" style={{
              padding: '14px 28px', background: 'var(--ink)', color: 'var(--bg)',
              borderRadius: 100, fontFamily: 'var(--mono)', fontSize: 10,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <Icon name="plus" size={12} sw={1.8} /> Create first outfit
            </button>
          </div>
        ) : (
          <>
            {/* filter chips */}
            <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 20px 16px' }}>
              {moods.map((m) => (
                <Chip key={m} active={filter === m} onClick={() => setFilter(m)} mono>{m}</Chip>
              ))}
              <div style={{ width: 1, background: 'var(--line)', margin: '4px 4px' }} />
              {occasions.map((o) => (
                <Chip key={o} active={occasion === o} onClick={() => setOccasion(occasion === o ? null : o)}>{o}</Chip>
              ))}
            </div>

            {/* masonry grid */}
            <div style={{ padding: '0 20px' }}>
              {filtered.length > 0 ? (
                <div className="masonry-2">
                  {filtered.map((o, i) => (
                    <OutfitCard key={o.id} outfit={o} large={i % 5 === 0}
                      onClick={() => onNav('outfit', o.id)} />
                  ))}
                </div>
              ) : (
                <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink-soft)' }}>
                  No outfits match that filter.
                </div>
              )}
            </div>
          </>
        )
      ) : (
        outfits.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink-soft)' }}>
              Add some pieces first to generate outfit ideas.
            </div>
          </div>
        ) : (
          <SwipeGenerator onNav={onNav} />
        )
      )}
    </div>
  );
}
