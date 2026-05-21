// FITS screen — outfit gallery + swipe generator
import React, { useState } from 'react';
import { useCloset } from '../store.jsx';
import { Icon, Chip, OutfitCard, tonalText } from '../components/ui.jsx';

const QUESTIONS = [
  {
    key: 'occasion',
    label: 'What\'s the occasion?',
    sub: 'Where are you headed today?',
    options: [
      { label: 'Work', value: 'WORK',    hint: 'Office, meetings, professional' },
      { label: 'Casual', value: 'CASUAL', hint: 'Errands, coffee, day out' },
      { label: 'Evening', value: 'EVENING', hint: 'Dinner, events, nightlife' },
    ],
  },
  {
    key: 'weather',
    label: 'How\'s the weather?',
    sub: 'Pick what fits the forecast.',
    options: [
      { label: 'Warm', value: 'warm',  hint: 'Above 20 °C, sun out' },
      { label: 'Mild', value: 'mild',  hint: 'A light layer works' },
      { label: 'Cold', value: 'cold',  hint: 'Below 10 °C, bundle up' },
    ],
  },
  {
    key: 'vibe',
    label: 'What\'s the vibe?',
    sub: 'How do you want to feel?',
    options: [
      { label: 'Clean',   value: 'clean',   hint: 'Minimal, sharp, precise' },
      { label: 'Relaxed', value: 'relaxed', hint: 'Easy, effortless, comfortable' },
      { label: 'Bold',    value: 'bold',    hint: 'Statement pieces, contrast' },
      { label: 'Classic', value: 'classic', hint: 'Timeless, refined, structured' },
    ],
  },
];

function GenerateWizard({ onNav }) {
  const { outfits, itemsById, wearOutfit, likeOutfit, liked, wearLog, todayIso } = useCloset();
  const [phase, setPhase] = useState('intro');   // 'intro' | 'questions' | 'result'
  const [step,  setStep]  = useState(0);
  const [answers, setAnswers] = useState({});
  const [result,  setResult]  = useState(null);

  const pickAnswer = (value) => {
    const next = { ...answers, [QUESTIONS[step].key]: value };
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      // pick best outfit
      let pool = [...outfits];
      if (next.occasion) {
        const byOcc = pool.filter((o) => o.mood === next.occasion);
        if (byOcc.length) pool = byOcc;
      }
      setResult(pool[Math.floor(Math.random() * pool.length)] || null);
      setPhase('result');
    }
  };

  const restart = () => { setPhase('intro'); setStep(0); setAnswers({}); setResult(null); };
  const goBack  = () => {
    if (step === 0) restart();
    else setStep(step - 1);
  };

  /* ── INTRO ── */
  if (phase === 'intro') {
    return (
      <div style={{
        padding: '32px 20px 48px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
      }}>
        <div className="eyebrow" style={{ marginBottom: 16, letterSpacing: '0.2em' }}>AI Stylist</div>
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 38, lineHeight: 1.1, color: 'var(--ink)', marginBottom: 10,
        }}>
          Find your<br />perfect look.
        </div>
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 14, color: 'var(--ink-soft)', marginBottom: 52,
        }}>
          3 quick questions.<br />One perfect outfit.
        </div>

        {/* big round button */}
        <button
          onClick={() => setPhase('questions')}
          className="press generate-btn"
          style={{
            width: 130, height: 130, borderRadius: '50%',
            background: 'var(--ink)', color: 'var(--bg)',
            border: 'none',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: 'pointer',
          }}
        >
          <Icon name="sparkle" size={30} sw={1.4} stroke="var(--bg)" />
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9.5,
            letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>Generate</span>
        </button>

        <div style={{
          marginTop: 40, display: 'flex', flexDirection: 'column', gap: 10, width: '100%',
        }}>
          {[
            { icon: 'check', text: 'Based on your wardrobe' },
            { icon: 'check', text: 'Matched to your occasion' },
            { icon: 'check', text: 'Ready to wear today' },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14,
              color: 'var(--ink-soft)',
            }}>
              <Icon name={icon} size={13} sw={1.6} stroke="var(--ink-mute)" />
              {text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── QUESTIONS ── */
  if (phase === 'questions') {
    const q = QUESTIONS[step];
    const pct = (step / QUESTIONS.length) * 100;

    return (
      <div style={{ padding: '0 20px' }} className="fade-in">
        {/* progress bar */}
        <div style={{ height: 2, background: 'var(--line)', borderRadius: 1, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{
            height: '100%', background: 'var(--ink)',
            width: `${pct}%`, transition: 'width 0.4s ease',
          }} />
        </div>

        {/* step nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <button onClick={goBack} className="press" style={{ padding: 8, color: 'var(--ink-soft)' }}>
            <Icon name="back" size={18} sw={1.4} />
          </button>
          <div className="eyebrow">{step + 1} of {QUESTIONS.length}</div>
          <div style={{ width: 34 }} />
        </div>

        {/* question */}
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 34, lineHeight: 1.1, color: 'var(--ink)', marginBottom: 6,
        }}>{q.label}</div>
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 14, color: 'var(--ink-soft)', marginBottom: 28,
        }}>{q.sub}</div>

        {/* options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((opt) => (
            <button key={opt.value} onClick={() => pickAnswer(opt.value)} className="press" style={{
              width: '100%', padding: '18px 20px',
              background: 'var(--surface)', border: '0.5px solid var(--line)',
              borderRadius: 10, textAlign: 'left', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--serif)', fontStyle: 'italic',
                  fontSize: 22, color: 'var(--ink)', lineHeight: 1,
                }}>{opt.label}</div>
                <div style={{
                  fontFamily: 'var(--sans)', fontSize: 11,
                  color: 'var(--ink-mute)', marginTop: 4,
                }}>{opt.hint}</div>
              </div>
              <Icon name="chevron" size={16} sw={1.4} stroke="var(--ink-mute)" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── RESULT ── */
  if (!result) {
    return (
      <div style={{ padding: '48px 20px', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 22, color: 'var(--ink-soft)', marginBottom: 24,
        }}>No matching outfits found.</div>
        <button onClick={restart} className="press" style={{
          padding: '14px 28px', background: 'var(--ink)', color: 'var(--bg)',
          borderRadius: 100, fontFamily: 'var(--mono)', fontSize: 10,
          letterSpacing: '0.16em', textTransform: 'uppercase',
        }}>Try again</button>
      </div>
    );
  }

  const items     = result.items.map((id) => itemsById[id]).filter(Boolean);
  const wornToday = wearLog[todayIso] === result.id;
  const isLiked   = liked.includes(result.id);

  return (
    <div style={{ padding: '0 20px 24px' }} className="fade-in">
      {/* progress complete */}
      <div style={{ height: 2, background: 'var(--ink)', borderRadius: 1, marginBottom: 28 }} />

      <div className="eyebrow" style={{ marginBottom: 6 }}>Your perfect look</div>
      <div style={{
        fontFamily: 'var(--serif)', fontStyle: 'italic',
        fontSize: 36, lineHeight: 1.1, color: 'var(--ink)', marginBottom: 4,
      }}>{result.name}</div>
      <div style={{
        fontFamily: 'var(--serif)', fontStyle: 'italic',
        fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20,
      }}>
        {result.mood} · {(result.occasion || []).join(', ')} · {result.items.length} pieces
      </div>

      {/* outfit grid */}
      <div style={{
        border: '0.5px solid var(--line)', borderRadius: 8, overflow: 'hidden',
        background: 'var(--line)', display: 'grid', gap: 1,
        gridTemplateColumns: '1fr 1fr', marginBottom: 16,
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
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
              ) : (
                <div className={it.pat !== 'solid' ? `pat-${it.pat}` : ''}
                  style={{ position: 'absolute', inset: 0 }} />
              )}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.38))',
              }} />
              <div style={{
                position: 'absolute', bottom: 8, left: 10,
                fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12,
                color: it.image ? 'rgba(245,240,228,1)' : tonalText(it.tone, 1),
              }}>{it.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* items list */}
      <div style={{ marginBottom: 20 }}>
        {items.map((it) => (
          <div key={it.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 0', borderBottom: '0.5px solid var(--line)',
          }}>
            <div style={{
              width: 36, height: 44, borderRadius: 3, flexShrink: 0, overflow: 'hidden',
              background: it.image ? 'var(--surface)' : it.tone,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {it.image
                ? <img src={it.image} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <div className={it.pat !== 'solid' ? `pat-${it.pat}` : ''} style={{ width: '100%', height: '100%' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ fontSize: 8.5 }}>{it.cat}</div>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15 }}>{it.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <button onClick={() => wearOutfit(result.id)} className="press" style={{
          flex: 1, padding: 14,
          background: wornToday ? 'transparent' : 'var(--ink)',
          color: wornToday ? 'var(--ink)' : 'var(--bg)',
          border: wornToday ? '0.5px solid var(--ink)' : 'none',
          borderRadius: 100, fontFamily: 'var(--mono)', fontSize: 10,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name="check" size={12} sw={1.6} /> {wornToday ? 'Worn today' : 'Wear today'}
        </button>
        <button onClick={() => likeOutfit(result.id)} className="press" style={{
          padding: '14px 18px', background: 'transparent',
          border: `0.5px solid ${isLiked ? 'var(--accent)' : 'var(--line)'}`,
          borderRadius: 100,
        }}>
          <Icon name="heart" size={15} sw={1.4}
            fill={isLiked ? 'var(--accent)' : 'none'}
            stroke={isLiked ? 'var(--accent)' : 'currentColor'} />
        </button>
        <button onClick={() => onNav('outfit', result.id)} className="press" style={{
          padding: '14px 18px', background: 'transparent',
          border: '0.5px solid var(--line)', borderRadius: 100, color: 'var(--ink)',
        }}>
          <Icon name="search" size={15} sw={1.4} />
        </button>
      </div>

      <button onClick={restart} className="press" style={{
        width: '100%', padding: 13, background: 'transparent',
        border: '0.5px solid var(--line)', borderRadius: 100,
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'var(--ink-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <Icon name="close" size={10} sw={1.6} /> Start over
      </button>
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
          <GenerateWizard onNav={onNav} />
        )
      )}
    </div>
  );
}
