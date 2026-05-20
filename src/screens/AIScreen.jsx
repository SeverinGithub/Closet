// AI Stylist screen — mood + occasion → outfit pairing
import React, { useState } from 'react';
import { useCloset } from '../store.jsx';
import { Icon, Chip, OutfitCard } from '../components/ui.jsx';

export default function AIScreen({ onBack, onNav }) {
  const { outfits } = useCloset();
  const [vibe, setVibe] = useState(null);
  const [occ, setOcc] = useState(null);
  const [generated, setGenerated] = useState(null);
  const [thinking, setThinking] = useState(false);

  const generate = () => {
    setThinking(true);
    setTimeout(() => {
      const byVibe = outfits.filter((o) => !vibe || o.mood === vibe);
      const byBoth = byVibe.filter((o) => !occ || (o.occasion || []).includes(occ));
      const pool = byBoth.length > 0 ? byBoth : byVibe;
      setGenerated(pool[Math.floor(Math.random() * pool.length)]);
      setThinking(false);
    }, 900);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4} />
        </button>
        <div className="eyebrow">Stylist · AI</div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '12px 20px 28px' }}>
        <div className="h-display" style={{ fontSize: 44, color: 'var(--ink)' }}>
          What is the <em style={{ color: 'var(--accent)' }}>mood</em>?
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Vibe</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {[
            { id: 'WORK', label: 'Work', sub: 'Tailored' },
            { id: 'CASUAL', label: 'Off-duty', sub: 'Easy' },
            { id: 'EVENING', label: 'After dark', sub: 'Bold' },
          ].map((v) => (
            <button key={v.id} onClick={() => setVibe(v.id)} className="press" style={{
              padding: 12, borderRadius: 4, textAlign: 'left',
              background: vibe === v.id ? 'var(--ink)' : 'var(--surface)',
              color: vibe === v.id ? 'var(--bg)' : 'var(--ink)',
              border: '0.5px solid var(--line)',
            }}>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, lineHeight: 1 }}>{v.label}</div>
              <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{v.sub}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Occasion</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Office', 'Date', 'Brunch', 'Travel', 'Party', 'Gym', 'Errands', 'Cocktails'].map((o) => (
            <Chip key={o} active={occ === o} onClick={() => setOcc(occ === o ? null : o)}>{o}</Chip>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Weather</div>
        <div style={{
          background: 'var(--surface)', border: '0.5px solid var(--line)',
          borderRadius: 4, padding: 14,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, lineHeight: 1.15, whiteSpace: 'nowrap' }}>14° · Cloudy</div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>Berlin · light wind</div>
          </div>
          <Icon name="cloud" size={28} sw={1.2} />
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <button onClick={generate} disabled={!vibe || thinking} className="press" style={{
          width: '100%', padding: 16,
          background: vibe ? 'var(--accent)' : 'var(--ink-mute)',
          color: '#fff', borderRadius: 100,
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.2s',
        }}>
          <Icon name="sparkle" size={14} stroke="#fff" sw={1.6} />
          {thinking ? 'Composing…' : 'Compose a look'}
        </button>
      </div>

      {/* generated result */}
      {generated && !thinking && (
        <div style={{ padding: '24px 20px 0' }} className="fade-in">
          <hr className="rule" />
          <div style={{ padding: '20px 0 12px' }}>
            <div className="eyebrow">Proposed</div>
            <div style={{ marginTop: 12 }}>
              <OutfitCard outfit={generated} large onClick={() => onNav('outfit', generated.id)} />
            </div>
          </div>
          <button onClick={generate} className="press" style={{
            width: '100%', marginTop: 8, padding: 12, background: 'transparent',
            border: '0.5px dashed var(--line)', borderRadius: 4,
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--ink-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Icon name="shuffle" size={12} sw={1.4} /> Try another
          </button>
        </div>
      )}
    </div>
  );
}
