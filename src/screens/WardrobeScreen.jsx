// Wardrobe browse screen
import React, { useState } from 'react';
import { useCloset } from '../store.jsx';
import { Icon, Chip, ItemTile } from '../components/ui.jsx';

export default function WardrobeScreen({ mode, onBack, onNav }) {
  const { items, categories } = useCloset();
  const [cat, setCat] = useState('ALL');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = items.filter((i) => {
    if (cat !== 'ALL' && i.cat !== cat) return false;
    if (!q) return true;
    return (
      i.name.toLowerCase().includes(q)
      || (i.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4} />
        </button>
        <div className="eyebrow">Volume I</div>
        <button
          onClick={() => { setSearching((s) => !s); setQuery(''); }}
          className="press"
          style={{ padding: 8, color: searching ? 'var(--accent)' : 'var(--ink)' }}
        >
          <Icon name={searching ? 'close' : 'search'} size={18} sw={1.4} />
        </button>
      </div>

      <div style={{ padding: '8px 20px 14px' }}>
        <div className="h-display" style={{ fontSize: 44, color: 'var(--ink)' }}>
          The <em>wardrobe</em>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink-soft)', textTransform: 'uppercase', marginTop: 4 }}>
          {filtered.length} of {items.length} pieces
        </div>
      </div>

      {searching && (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--surface)', border: '0.5px solid var(--line)',
            borderRadius: 100, padding: '10px 16px',
          }}>
            <Icon name="search" size={15} sw={1.4} stroke="var(--ink-soft)" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or tag"
              style={{
                flex: 1, fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink)',
              }}
            />
          </div>
        </div>
      )}

      <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 20px 18px' }}>
        {['ALL', ...categories].map((c) => (
          <Chip key={c} mono active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
        ))}
      </div>

      <div style={{ padding: '0 20px' }}>
        {filtered.length > 0 ? (
          <div className="masonry-2">
            {filtered.map((it) => (
              <ItemTile key={it.id} item={it} mode={mode} onClick={() => onNav('item', it.id)} />
            ))}
          </div>
        ) : (
          <div style={{
            padding: '40px 20px', textAlign: 'center',
            fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink-soft)',
          }}>
            Nothing matches that search.
          </div>
        )}
      </div>
    </div>
  );
}
