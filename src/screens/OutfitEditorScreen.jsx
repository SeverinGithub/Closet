// OUTFIT EDITOR — build an outfit from your wardrobe
import React, { useState } from 'react';
import { useCloset } from '../store.jsx';
import { Icon, Chip, ItemTile } from '../components/ui.jsx';

export default function OutfitEditorScreen({ onBack, onNav }) {
  const { items, categories, addOutfit } = useCloset();

  const [step,     setStep]     = useState(0);
  const [selected, setSelected] = useState([]);   // item ids
  const [cat,      setCat]      = useState('ALL');
  const [name,     setName]     = useState('');
  const [mood,     setMood]     = useState('CASUAL');
  const [occasions, setOccasions] = useState([]);

  const filtered = items.filter((i) => cat === 'ALL' || i.cat === cat);

  const toggle = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const selectedItems = items.filter((i) => selected.includes(i.id));

  const save = () => {
    if (!name.trim() && selectedItems.length > 0) {
      // auto-name from first piece
      setName(selectedItems[0].name);
    }
    addOutfit({
      name:     name.trim() || selectedItems[0]?.name || 'My Outfit',
      mood,
      items:    selected,
      occasion: occasions,
    });
    onNav('fits');
  };

  const toggleOccasion = (o) =>
    setOccasions((prev) => prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]);

  // ── Step 0: Pick items ──────────────────────────────────────
  if (step === 0) {
    return (
      <div className="fade-in" style={{ paddingBottom: 110 }}>
        {/* Header */}
        <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} className="press" style={{ padding: 8 }}>
            <Icon name="back" size={20} sw={1.4} />
          </button>
          <div className="eyebrow">New outfit · 1/2</div>
          <div style={{ width: 36 }} />
        </div>

        <div style={{ padding: '8px 20px 6px' }}>
          <div className="h-display" style={{ fontSize: 40, color: 'var(--ink)' }}>
            Choose <em style={{ color: 'var(--accent)' }}>pieces</em>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 6 }}>
            {selected.length > 0 ? `${selected.length} selected` : 'Tap to select'}
          </div>
        </div>

        {/* Category filter */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '12px 20px' }}>
          {['ALL', ...categories].map((c) => (
            <Chip key={c} mono active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
          ))}
        </div>

        {/* Item grid */}
        <div style={{ padding: '0 20px' }}>
          <div className="masonry-2">
            {filtered.map((it) => {
              const on = selected.includes(it.id);
              return (
                <div key={it.id} style={{ position: 'relative' }} onClick={() => toggle(it.id)}>
                  <ItemTile item={it} mode="photo" />
                  {/* selection overlay */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: 4, pointerEvents: 'none',
                    border: on ? '2.5px solid var(--accent)' : '2.5px solid transparent',
                    transition: 'border-color 0.15s',
                  }} />
                  {on && (
                    <div style={{
                      position: 'absolute', top: 7, right: 7,
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name="check" size={12} sw={2.2} stroke="#fff" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink-soft)' }}>
              No pieces in this category yet.
            </div>
          )}
        </div>

        {/* Continue button — sticky bottom */}
        {selected.length >= 2 && (
          <div style={{
            position: 'fixed', bottom: 'max(80px, calc(80px + env(safe-area-inset-bottom)))',
            left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430, padding: '0 20px',
            pointerEvents: 'none',
          }}>
            <button onClick={() => setStep(1)} className="press" style={{
              width: '100%', padding: 16, borderRadius: 100,
              background: 'var(--ink)', color: 'var(--bg)',
              fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em',
              textTransform: 'uppercase', fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              pointerEvents: 'auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            }}>
              {selected.length} pieces selected · Next
              <Icon name="arrowR" size={13} sw={1.6} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Step 1: Name & mood ─────────────────────────────────────
  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setStep(0)} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4} />
        </button>
        <div className="eyebrow">New outfit · 2/2</div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '8px 20px 24px' }}>
        <div className="h-display" style={{ fontSize: 40, color: 'var(--ink)' }}>
          Name the <em style={{ color: 'var(--accent)' }}>look</em>
        </div>
      </div>

      {/* Mini preview of selected items */}
      <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 20px 24px' }}>
        {selectedItems.map((it) => (
          <div key={it.id} style={{ flex: '0 0 80px' }}>
            <ItemTile item={it} height={100} showLabel={false} frame />
          </div>
        ))}
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Name */}
        <div style={{ marginBottom: 24 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Outfit name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sunday Morning…"
            style={{
              width: '100%', padding: '10px 0',
              fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 24, color: 'var(--ink)',
              borderBottom: '0.5px solid var(--line)',
            }}
          />
        </div>

        {/* Mood */}
        <div style={{ marginBottom: 24 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Mood</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { id: 'WORK',    label: 'Work',      sub: 'Tailored' },
              { id: 'CASUAL',  label: 'Off-duty',  sub: 'Easy' },
              { id: 'EVENING', label: 'After dark', sub: 'Bold' },
            ].map((v) => (
              <button key={v.id} onClick={() => setMood(v.id)} className="press" style={{
                padding: 12, borderRadius: 4, textAlign: 'left',
                background: mood === v.id ? 'var(--ink)' : 'var(--surface)',
                color: mood === v.id ? 'var(--bg)' : 'var(--ink)',
                border: '0.5px solid var(--line)',
              }}>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, lineHeight: 1 }}>{v.label}</div>
                <div style={{ fontSize: 9.5, opacity: 0.6, marginTop: 4, fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{v.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Occasions */}
        <div style={{ marginBottom: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Occasion · optional</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Office','Date','Brunch','Travel','Party','Errands','Cocktails','Gym'].map((o) => (
              <Chip key={o} active={occasions.includes(o)} onClick={() => toggleOccasion(o)}>{o}</Chip>
            ))}
          </div>
        </div>

        {/* Save */}
        <button onClick={save} className="press" style={{
          width: '100%', padding: 16, background: 'var(--accent)',
          color: '#fff', borderRadius: 100,
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="check" size={14} sw={2} stroke="#fff" /> Save outfit
        </button>
      </div>
    </div>
  );
}
