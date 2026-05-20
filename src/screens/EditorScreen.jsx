// EDITOR screen — add a new item, multi-step flow
import React, { useEffect, useState } from 'react';
import { useCloset } from '../store.jsx';
import { Icon, Chip } from '../components/ui.jsx';

const FieldBlock = ({ label, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>
    {children}
  </div>
);

const DetectRow = ({ label, value }) => (
  <div>
    <div className="eyebrow" style={{ fontSize: 8.5 }}>{label}</div>
    <div style={{ marginTop: 2, fontSize: 13, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>{value}</div>
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
function Step0Capture({ onNext }) {
  const recents = [
    { tone: '#A89478', pat: 'grain' },
    { tone: '#2E2A26', pat: 'leather' },
    { tone: '#5C7796', pat: 'denim' },
    { tone: '#191A1F', pat: 'check' },
    { tone: '#C9B69E', pat: 'grain' },
    { tone: '#5F2A2A', pat: 'solid' },
  ];

  return (
    <div>
      <div style={{ padding: '0 20px 16px' }}>
        <button onClick={() => onNext({ tone: '#5C7796', pat: 'denim' })} className="press" style={{
          width: '100%', padding: '22px 24px', background: 'var(--ink)', color: 'var(--bg)',
          borderRadius: 6, display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', opacity: 0.7, textTransform: 'uppercase' }}>Method 01</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 28, lineHeight: 1, fontStyle: 'italic', marginTop: 6 }}>
              Snap a photo
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>Auto background removal</div>
          </div>
          <div style={{ opacity: 0.35, flexShrink: 0 }}>
            <Icon name="camera" size={52} sw={1} stroke="var(--bg)" />
          </div>
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
          <button onClick={() => onNext({ tone: '#A89478', pat: 'grain' })} className="press" style={{
            padding: 16, background: 'var(--surface)', border: '0.5px solid var(--line)',
            borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left',
          }}>
            <Icon name="image" size={20} sw={1.4} />
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.15, marginTop: 10, whiteSpace: 'nowrap' }}>Library</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 4 }}>Pick from photos</div>
          </button>
          <button onClick={() => onNext({ tone: '#2E2A26', pat: 'leather' })} className="press" style={{
            padding: 16, background: 'var(--surface)', border: '0.5px solid var(--line)',
            borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left',
          }}>
            <Icon name="cloud" size={20} sw={1.4} />
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.15, marginTop: 10, whiteSpace: 'nowrap' }}>From URL</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 4 }}>A shop site</div>
          </button>
        </div>
      </div>

      <hr className="rule" style={{ margin: '8px 20px' }} />

      <div style={{ padding: '14px 20px 0' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>From camera roll</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {recents.map((r, i) => (
            <button key={i} onClick={() => onNext({ tone: r.tone, pat: r.pat })}
              className={`press ${r.pat !== 'solid' ? `pat-${r.pat}` : ''}`}
              style={{
                aspectRatio: '1', background: r.tone, borderRadius: 3,
                border: '0.5px solid rgba(0,0,0,0.06)', position: 'relative',
              }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent 50%, rgba(0,0,0,0.1))',
              }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function Step1Process({ draft, onNext, onBack }) {
  const [scanning, setScanning] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setScanning(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ padding: '0 20px' }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Background removed · AI</div>

      <div style={{
        background: 'var(--surface-2)', borderRadius: 6, padding: 24,
        height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(0,0,0,0.04) 1px, transparent 1.5px),
          radial-gradient(circle at 75% 75%, rgba(0,0,0,0.04) 1px, transparent 1.5px)
        `,
        backgroundSize: '12px 12px',
      }}>
        <div className={draft.pat !== 'solid' ? `pat-${draft.pat}` : ''} style={{
          width: 180, height: 220, background: draft.tone, borderRadius: 4,
          boxShadow: '0 24px 40px rgba(0,0,0,0.15)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08), transparent 40%, rgba(0,0,0,0.1))',
          }} />
        </div>

        {scanning && (
          <>
            <div style={{
              position: 'absolute', left: 0, right: 0, height: 2,
              background: 'var(--accent)', boxShadow: '0 0 18px var(--accent)',
              animation: 'scan 1.4s linear infinite', top: 0,
            }} />
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: 'var(--ink)', color: 'var(--bg)',
              padding: '4px 8px', borderRadius: 4,
              fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>Analysing…</div>
          </>
        )}
        {!scanning && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: '#1f8a5b', color: '#fff',
            padding: '4px 8px', borderRadius: 4,
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.14em',
            textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4,
          }}><Icon name="check" size={10} sw={2} stroke="#fff" /> Ready</div>
        )}
      </div>

      <div style={{
        marginTop: 14, padding: 14, background: 'var(--surface)',
        border: '0.5px solid var(--line)', borderRadius: 4,
      }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Detected</div>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
          <DetectRow label="Category" value="Jacket · Outerwear" />
          <DetectRow label="Color" value="Indigo blue" />
          <DetectRow label="Material" value="Denim · Cotton" />
          <DetectRow label="Confidence" value="92%" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        <button onClick={onBack} className="press" style={{
          padding: '14px 18px', background: 'transparent',
          border: '0.5px solid var(--line)', borderRadius: 100,
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--ink-soft)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="back" size={12} /> Retake
        </button>
        <button onClick={onNext} disabled={scanning} className="press" style={{
          flex: 1, padding: 14, background: scanning ? 'var(--ink-mute)' : 'var(--ink)',
          color: 'var(--bg)', borderRadius: 100,
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em',
          textTransform: 'uppercase', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          {scanning ? 'Processing…' : <>Continue <Icon name="arrowR" size={13} /></>}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function Step2Tag({ draft, setDraft, onDone, onBack }) {
  const cats = ['OUTERWEAR', 'TOPS', 'BOTTOMS', 'DRESSES', 'SHOES', 'ACCESS.'];
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
  const tones = ['#5C7796', '#2E2A26', '#A89478', '#F1ECE2', '#5F2A2A', '#6E6857', '#1A1A22', '#B6291E'];

  const setField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const toggleTag = (tag) => setDraft((d) => ({
    ...d,
    tags: d.tags.includes(tag) ? d.tags.filter((t) => t !== tag) : [...d.tags, tag],
  }));

  const addCustomTag = () => {
    const t = (window.prompt('New tag') || '').trim().toLowerCase();
    if (t && !draft.tags.includes(t)) setField('tags', [...draft.tags, t]);
  };

  // preset suggestions always shown, plus any custom tags the user added
  const presetTags = ['casual', 'vintage', 'everyday', 'spring', 'denim', 'blue'];
  const allTags = [...presetTags, ...draft.tags.filter((t) => !presetTags.includes(t))];

  return (
    <div style={{ padding: '0 20px' }}>
      {/* big preview + name */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div className={draft.pat !== 'solid' ? `pat-${draft.pat}` : ''} style={{
          width: 92, height: 116, background: draft.tone, borderRadius: 4,
          border: '0.5px solid rgba(0,0,0,0.08)', position: 'relative', flexShrink: 0, overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08), transparent 40%, rgba(0,0,0,0.1))',
          }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="eyebrow">Name</div>
          <input
            value={draft.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Name this piece"
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

      {/* color */}
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
    name: 'Vintage Denim Jacket',
    cat: 'OUTERWEAR',
    tone: '#A89478',
    pat: 'solid',
    tags: ['casual', 'vintage', 'everyday', 'spring', 'denim', 'blue'],
    season: ['Spring'],
    brand: '',
    price: '',
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

      {/* progress dots */}
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
        <Step1Process draft={draft} onNext={() => setStep(2)} onBack={() => setStep(0)} />
      )}
      {step === 2 && (
        <Step2Tag draft={draft} setDraft={setDraft} onDone={save} onBack={() => setStep(1)} />
      )}
    </div>
  );
}
