// EDITOR screen — add a new item, multi-step flow
import React, { useEffect, useRef, useState } from 'react';
import { useCloset } from '../store.jsx';
import { Icon, Chip } from '../components/ui.jsx';

// Compress uploaded image to max 800px, JPEG 0.82 quality
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
  <div style={{ marginBottom: 18 }}>
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
      style={{
        width: '100%', marginTop: 2, padding: 0,
        fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink)',
      }}
    />
  </div>
);

// ─────────────────────────────────────────────────────────────
// Step 0 — Capture: real camera / library / manual
function Step0Capture({ onNext }) {
  const cameraRef  = useRef(null);
  const libraryRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    try {
      const image = await compressImage(file);
      onNext({ image });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* hidden file inputs */}
      <input ref={cameraRef}  type="file" accept="image/*" capture="environment"
        style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
      <input ref={libraryRef} type="file" accept="image/*"
        style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />

      <div style={{ padding: '0 20px 16px' }}>
        <button onClick={() => cameraRef.current?.click()} disabled={loading} className="press" style={{
          width: '100%', padding: '22px 24px', background: 'var(--ink)', color: 'var(--bg)',
          borderRadius: 6, display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left',
          opacity: loading ? 0.6 : 1,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', opacity: 0.7, textTransform: 'uppercase' }}>Method 01</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 28, lineHeight: 1, fontStyle: 'italic', marginTop: 6 }}>
              {loading ? 'Processing…' : 'Snap a photo'}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>Use your camera</div>
          </div>
          <div style={{ opacity: 0.35, flexShrink: 0 }}>
            <Icon name="camera" size={52} sw={1} stroke="var(--bg)" />
          </div>
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
          <button onClick={() => libraryRef.current?.click()} disabled={loading} className="press" style={{
            padding: 16, background: 'var(--surface)', border: '0.5px solid var(--line)',
            borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left',
          }}>
            <Icon name="image" size={20} sw={1.4} />
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.15, marginTop: 10 }}>Library</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 4 }}>Pick from photos</div>
          </button>
          <button onClick={() => onNext({ image: null })} disabled={loading} className="press" style={{
            padding: 16, background: 'var(--surface)', border: '0.5px solid var(--line)',
            borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left',
          }}>
            <Icon name="edit" size={20} sw={1.4} />
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.15, marginTop: 10 }}>Manual</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 4 }}>Set color & details</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 1 — Preview: confirm photo or pick color manually
function Step1Preview({ draft, setDraft, onNext, onBack }) {
  const libraryRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    try {
      const image = await compressImage(file);
      setDraft((d) => ({ ...d, image }));
    } finally {
      setLoading(false);
    }
  };

  const tones = ['#A89478','#2E2A26','#5C7796','#F1ECE2','#5F2A2A','#6E6857','#1A1A22','#B6291E','#D3C5A8','#15151A'];

  return (
    <div style={{ padding: '0 20px' }}>
      <input ref={libraryRef} type="file" accept="image/*"
        style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />

      {/* Photo preview or color swatch */}
      {draft.image ? (
        <div style={{ height: 280, borderRadius: 6, overflow: 'hidden', position: 'relative', border: '0.5px solid var(--line)' }}>
          <img src={draft.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button onClick={() => libraryRef.current?.click()} className="press" style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
            color: '#fff', borderRadius: 100, padding: '6px 12px',
            fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <Icon name="camera" size={11} sw={1.4} stroke="#fff" /> Change
          </button>
        </div>
      ) : (
        <div>
          <div className={draft.pat !== 'solid' ? `pat-${draft.pat}` : ''} style={{
            height: 200, background: draft.tone, borderRadius: 6, border: '0.5px solid var(--line)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.08), transparent 40%, rgba(0,0,0,0.1))' }} />
            <button onClick={() => libraryRef.current?.click()} className="press" style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
              color: '#fff', borderRadius: 100, padding: '6px 12px',
              fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Icon name="camera" size={11} sw={1.4} stroke="#fff" /> Add photo
            </button>
          </div>

          {/* Color picker for manual mode */}
          <div style={{ marginTop: 14 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Color</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {tones.map((c) => (
                <button key={c} onClick={() => setDraft((d) => ({ ...d, tone: c }))} className="press" style={{
                  width: 32, height: 32, borderRadius: '50%', background: c, padding: 0,
                  border: draft.tone === c ? '2.5px solid var(--ink)' : '0.5px solid rgba(0,0,0,0.12)',
                  outline: draft.tone === c ? '1.5px solid var(--bg)' : 'none', outlineOffset: 1,
                }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ marginTop: 10, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-soft)', letterSpacing: '0.14em' }}>
          Processing image…
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        <button onClick={onBack} className="press" style={{
          padding: '14px 18px', background: 'transparent',
          border: '0.5px solid var(--line)', borderRadius: 100,
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--ink-soft)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="back" size={12} /> Back
        </button>
        <button onClick={onNext} disabled={loading} className="press" style={{
          flex: 1, padding: 14, background: 'var(--ink)',
          color: 'var(--bg)', borderRadius: 100, opacity: loading ? 0.5 : 1,
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em',
          textTransform: 'uppercase', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          Continue <Icon name="arrowR" size={13} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 2 — Tag & details
function Step2Tag({ draft, setDraft, onDone, onBack }) {
  const cats    = ['OUTERWEAR', 'TOPS', 'BOTTOMS', 'DRESSES', 'SHOES', 'ACCESS.'];
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  const tones   = ['#A89478','#2E2A26','#5C7796','#F1ECE2','#5F2A2A','#6E6857','#1A1A22','#B6291E'];

  const setField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const toggleTag = (tag) => setDraft((d) => ({
    ...d,
    tags: d.tags.includes(tag) ? d.tags.filter((t) => t !== tag) : [...d.tags, tag],
  }));

  const addCustomTag = () => {
    const t = (window.prompt('New tag') || '').trim().toLowerCase();
    if (t && !draft.tags.includes(t)) setField('tags', [...draft.tags, t]);
  };

  const presetTags = ['casual', 'vintage', 'everyday', 'workwear', 'evening', 'classic'];
  const allTags    = [...presetTags, ...draft.tags.filter((t) => !presetTags.includes(t))];

  return (
    <div style={{ padding: '0 20px' }}>
      {/* preview + name */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 92, height: 116, borderRadius: 4, flexShrink: 0, overflow: 'hidden',
          border: '0.5px solid rgba(0,0,0,0.08)',
          ...(draft.image
            ? { backgroundImage: `url(${draft.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: draft.tone }),
        }}>
          {!draft.image && (
            <div className={draft.pat !== 'solid' ? `pat-${draft.pat}` : ''}
              style={{ width: '100%', height: '100%', background: 'transparent',
                backgroundImage: draft.pat !== 'solid' ? undefined : 'none',
              }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="eyebrow">Name</div>
          <input
            value={draft.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Name this piece…"
            style={{
              width: '100%', marginTop: 4, padding: '4px 0',
              fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22,
              borderBottom: '0.5px solid var(--line)', color: 'var(--ink)',
            }}
          />
          <div className="eyebrow" style={{ marginTop: 14 }}>Worn so far</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 24, lineHeight: 1, marginTop: 2 }}>0×</div>
        </div>
      </div>

      {/* category */}
      <FieldBlock label="Category">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {cats.map((c) => (
            <Chip key={c} mono active={draft.cat === c} onClick={() => setField('cat', c)}>{c}</Chip>
          ))}
        </div>
      </FieldBlock>

      {/* color (only relevant when no photo) */}
      {!draft.image && (
        <FieldBlock label="Color">
          <div style={{ display: 'flex', gap: 8 }}>
            {tones.map((c) => (
              <button key={c} onClick={() => setField('tone', c)} className="press" style={{
                width: 30, height: 30, borderRadius: '50%', background: c,
                border: draft.tone === c ? '2px solid var(--ink)' : '0.5px solid rgba(0,0,0,0.1)',
                padding: 0,
              }} />
            ))}
          </div>
        </FieldBlock>
      )}

      {/* season */}
      <FieldBlock label="Season">
        <div style={{ display: 'flex', gap: 6 }}>
          {seasons.map((s) => {
            const on = draft.season.includes(s);
            return (
              <Chip key={s} active={on} onClick={() => setField('season',
                on ? draft.season.filter((x) => x !== s) : [...draft.season, s])}>
                {s}
              </Chip>
            );
          })}
        </div>
      </FieldBlock>

      {/* tags */}
      <FieldBlock label="Tags">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {allTags.map((t) => (
            <Chip key={t} active={draft.tags.includes(t)} onClick={() => toggleTag(t)}># {t}</Chip>
          ))}
          <Chip onClick={addCustomTag}><Icon name="plus" size={11} sw={1.6} /> add</Chip>
        </div>
      </FieldBlock>

      {/* purchase */}
      <FieldBlock label="Purchase · optional">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <DetailField label="Brand" placeholder="Levi's" value={draft.brand} onChange={(v) => setField('brand', v)} />
          <DetailField label="Price" placeholder="€ 89" value={draft.price} onChange={(v) => setField('price', v)} />
        </div>
      </FieldBlock>

      {/* save */}
      <div style={{ display: 'flex', gap: 8, marginTop: 26 }}>
        <button onClick={onBack} className="press" style={{
          padding: '14px 18px', background: 'transparent',
          border: '0.5px solid var(--line)', borderRadius: 100,
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--ink-soft)',
        }}>
          <Icon name="back" size={12} />
        </button>
        <button onClick={onDone} className="press" style={{
          flex: 1, padding: 14, background: 'var(--accent)',
          color: '#fff', borderRadius: 100,
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em',
          textTransform: 'uppercase', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name="check" size={14} sw={1.8} stroke="#fff" /> Save to closet
        </button>
      </div>

      <div style={{
        marginTop: 14, fontFamily: 'var(--serif)', fontStyle: 'italic',
        fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center',
      }}>
        Your new piece joins the wardrobe instantly.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
export default function EditorScreen({ onNav }) {
  const { addItem } = useCloset();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({
    name: '', cat: 'TOPS', tone: '#A89478', pat: 'solid',
    image: null, tags: [], season: [], brand: '', price: '',
  });

  const save = () => {
    addItem(draft);
    onNav('home');
  };

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      {/* header */}
      <div style={{ padding: '8px 20px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="eyebrow">Editor · New piece</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--ink-mute)', letterSpacing: '0.14em' }}>
            STEP {step + 1} / 3
          </div>
        </div>
        <div className="h-display" style={{ fontSize: 44, marginTop: 6, color: 'var(--ink)' }}>
          Add a <em style={{ color: 'var(--accent)' }}>piece</em>
        </div>
      </div>

      {/* progress bar */}
      <div style={{ display: 'flex', gap: 4, padding: '0 20px 18px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            flex: 1, height: 2,
            background: i <= step ? 'var(--ink)' : 'var(--line)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {step === 0 && (
        <Step0Capture onNext={(d) => { setDraft((prev) => ({ ...prev, ...d })); setStep(1); }} />
      )}
      {step === 1 && (
        <Step1Preview draft={draft} setDraft={setDraft} onNext={() => setStep(2)} onBack={() => setStep(0)} />
      )}
      {step === 2 && (
        <Step2Tag draft={draft} setDraft={setDraft} onDone={save} onBack={() => setStep(1)} />
      )}
    </div>
  );
}
