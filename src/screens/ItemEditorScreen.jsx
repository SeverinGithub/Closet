// ITEM EDITOR — edit an existing wardrobe piece
import React, { useRef, useState } from 'react';
import { useCloset } from '../store.jsx';
import { Icon, Chip } from '../components/ui.jsx';

function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

const FieldBlock = ({ label, children }) => (
  <div style={{ marginBottom: 20 }}>
    <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>
    {children}
  </div>
);

const DetailField = ({ label, placeholder, value, onChange }) => (
  <div style={{ borderBottom: '0.5px solid var(--line)', paddingBottom: 6 }}>
    <div style={{ fontSize: 10, color: 'var(--ink-mute)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', marginTop: 2, padding: 0, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink)' }}
    />
  </div>
);

export default function ItemEditorScreen({ itemId, onBack }) {
  const { itemsById, updateItem } = useCloset();
  const item = itemsById[itemId];
  if (!item) { onBack(); return null; }

  const photoRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState({
    name:   item.name   || '',
    cat:    item.cat    || 'TOPS',
    tone:   item.tone   || '#A89478',
    pat:    item.pat    || 'solid',
    image:  item.image  || null,
    tags:   item.tags   || [],
    season: item.season || [],
    brand:  item.brand  || '',
    price:  item.price  || '',
  });

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const handlePhoto = async (file) => {
    if (!file) return;
    setLoading(true);
    try { set('image', await compressImage(file)); }
    finally { setLoading(false); }
  };

  const toggleTag = (tag) => setDraft((d) => ({
    ...d,
    tags: d.tags.includes(tag) ? d.tags.filter((t) => t !== tag) : [...d.tags, tag],
  }));

  const addCustomTag = () => {
    const t = (window.prompt('New tag') || '').trim().toLowerCase();
    if (t && !draft.tags.includes(t)) set('tags', [...draft.tags, t]);
  };

  const save = () => {
    updateItem(item.id, draft);
    onBack();
  };

  const cats    = ['OUTERWEAR', 'TOPS', 'BOTTOMS', 'DRESSES', 'SHOES', 'ACCESS.'];
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  const tones   = ['#A89478','#2E2A26','#5C7796','#F1ECE2','#5F2A2A','#6E6857','#1A1A22','#B6291E','#D3C5A8','#15151A'];
  const presetTags = ['casual', 'vintage', 'everyday', 'workwear', 'evening', 'classic'];
  const allTags    = [...presetTags, ...draft.tags.filter((t) => !presetTags.includes(t))];

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      {/* Header */}
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4} />
        </button>
        <div className="eyebrow">Edit piece</div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '8px 20px 20px' }}>
        <div className="h-display" style={{ fontSize: 40, color: 'var(--ink)' }}>
          Edit <em style={{ color: 'var(--accent)' }}>piece</em>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Photo */}
        <input ref={photoRef} type="file" accept="image/*"
          style={{ display: 'none' }} onChange={(e) => handlePhoto(e.target.files[0])} />

        <FieldBlock label="Photo">
          {draft.image ? (
            <div style={{ position: 'relative', height: 220, borderRadius: 6, overflow: 'hidden', background: 'var(--surface)', border: '0.5px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={draft.image} alt={draft.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              <button onClick={() => photoRef.current?.click()} disabled={loading} className="press" style={{
                position: 'absolute', top: 10, right: 10,
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                color: '#fff', borderRadius: 100, padding: '6px 14px',
                fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Icon name="camera" size={11} sw={1.4} stroke="#fff" />
                {loading ? 'Processing…' : 'Change'}
              </button>
              <button onClick={() => set('image', null)} className="press" style={{
                position: 'absolute', top: 10, left: 10,
                background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                color: '#fff', borderRadius: 100, padding: '6px 14px',
                fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <Icon name="close" size={11} sw={1.6} stroke="#fff" /> Remove
              </button>
            </div>
          ) : (
            <button onClick={() => photoRef.current?.click()} disabled={loading} className="press" style={{
              width: '100%', padding: '20px', background: 'var(--surface)', border: '0.5px dashed var(--line)',
              borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-soft)',
            }}>
              <Icon name="camera" size={18} sw={1.4} />
              {loading ? 'Processing…' : 'Add photo'}
            </button>
          )}
        </FieldBlock>

        {/* Name */}
        <FieldBlock label="Name">
          <input
            value={draft.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Name this piece…"
            style={{
              width: '100%', padding: '6px 0',
              fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink)',
              borderBottom: '0.5px solid var(--line)',
            }}
          />
        </FieldBlock>

        {/* Category */}
        <FieldBlock label="Category">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {cats.map((c) => (
              <Chip key={c} mono active={draft.cat === c} onClick={() => set('cat', c)}>{c}</Chip>
            ))}
          </div>
        </FieldBlock>

        {/* Color — only relevant without photo */}
        {!draft.image && (
          <FieldBlock label="Color">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {tones.map((c) => (
                <button key={c} onClick={() => set('tone', c)} className="press" style={{
                  width: 32, height: 32, borderRadius: '50%', background: c, padding: 0,
                  border: draft.tone === c ? '2.5px solid var(--ink)' : '0.5px solid rgba(0,0,0,0.12)',
                  outline: draft.tone === c ? '1.5px solid var(--bg)' : 'none', outlineOffset: 1,
                }} />
              ))}
            </div>
          </FieldBlock>
        )}

        {/* Season */}
        <FieldBlock label="Season">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {seasons.map((s) => {
              const on = draft.season.includes(s);
              return (
                <Chip key={s} active={on} onClick={() => set('season', on ? draft.season.filter((x) => x !== s) : [...draft.season, s])}>
                  {s}
                </Chip>
              );
            })}
          </div>
        </FieldBlock>

        {/* Tags */}
        <FieldBlock label="Tags">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {allTags.map((t) => (
              <Chip key={t} active={draft.tags.includes(t)} onClick={() => toggleTag(t)}># {t}</Chip>
            ))}
            <Chip onClick={addCustomTag}><Icon name="plus" size={11} sw={1.6} /> add</Chip>
          </div>
        </FieldBlock>

        {/* Purchase */}
        <FieldBlock label="Purchase · optional">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <DetailField label="Brand" placeholder="e.g. Levi's" value={draft.brand} onChange={(v) => set('brand', v)} />
            <DetailField label="Price" placeholder="e.g. € 89" value={draft.price} onChange={(v) => set('price', v)} />
          </div>
        </FieldBlock>

        {/* Save */}
        <button onClick={save} className="press" style={{
          width: '100%', marginTop: 8, padding: 16, background: 'var(--accent)',
          color: '#fff', borderRadius: 100,
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="check" size={14} sw={2} stroke="#fff" /> Save changes
        </button>
      </div>
    </div>
  );
}
