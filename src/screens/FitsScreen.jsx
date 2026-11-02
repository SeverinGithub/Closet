// FITS screen — outfit gallery + AI generator
import React, { useState } from 'react';
import { useCloset } from '../store.jsx';
import { Icon, Chip, OutfitCard, tonalText } from '../components/ui.jsx';
import { fetchWeather } from '../lib/weather.js';
import { generateOutfitWithGemini } from '../lib/gemini.js';

const QUESTIONS = [
  {
    key: 'occasion',
    label: 'What\'s the occasion?',
    sub: 'Where are you headed today?',
    options: [
      { label: 'Work',    value: 'WORK',    hint: 'Office, meetings, professional' },
      { label: 'Casual',  value: 'CASUAL',  hint: 'Errands, coffee, day out' },
      { label: 'Evening', value: 'EVENING', hint: 'Dinner, events, nightlife' },
    ],
  },
];

function GenerateWizard({ onNav }) {
  const { items, itemsById, addOutfit } = useCloset();
  const [phase, setPhase] = useState('intro');   // 'intro' | 'questions' | 'result'
  const [step,  setStep]  = useState(0);
  const [answers, setAnswers] = useState({});
  const [result,  setResult]  = useState(null);  // { item_ids, name, reason }
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const pickAnswer = async (value) => {
    const next = { ...answers, [QUESTIONS[step].key]: value };
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      setThinking(true);
      setPhase('result');
      setError(null);
      setSaved(false);
      try {
        const weather = await fetchWeather().catch(() => ({
          temp: 18, desc: 'mild', condition: 'Clouds', city: '', wind: 0,
        }));
        const suggestion = await generateOutfitWithGemini({
          items, weather,
          vibe: next.occasion,
          occasion: next.occasion,
        });
        setResult(suggestion);
      } catch (e) {
        console.error('Generation failed:', e);
        setError('Could not generate outfit. Try again.');
      } finally {
        setThinking(false);
      }
    }
  };

  const restart = () => { setPhase('intro'); setStep(0); setAnswers({}); setResult(null); setError(null); setSaved(false); };
  const goBack  = () => {
    if (step === 0) restart();
    else setStep(step - 1);
  };

  const save = () => {
    if (!result || saved) return;
    addOutfit({ name: result.name || 'AI Look', mood: answers.occasion, items: result.item_ids, occasion: answers.vibe ? [answers.vibe] : [] });
    setSaved(true);
  };

  const resultItems = result ? result.item_ids.map((id) => itemsById[id]).filter(Boolean) : [];

  /* ── INTRO ── */
  if (phase === 'intro') {
    return (
      <div style={{ padding: '24px 20px 40px' }}>
        {/* heading — left-aligned like rest of app */}
        <div className="eyebrow" style={{ marginBottom: 10 }}>AI Stylist</div>
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 44, lineHeight: 1.05, color: 'var(--ink)', marginBottom: 8,
        }}>
          Find your<br />perfect look.
        </div>
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 14, color: 'var(--ink-soft)', marginBottom: 44,
        }}>
          3 quick questions. One perfect outfit.
        </div>

        {/* big round button — centered via its own row */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 44 }}>
          <button
            onClick={() => setPhase('questions')}
            className="press generate-btn"
            style={{
              width: 140, height: 140, borderRadius: '50%',
              background: 'var(--ink)', color: 'var(--bg)',
              border: 'none',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer',
            }}
          >
            <Icon name="sparkle" size={32} sw={1.4} stroke="var(--bg)" />
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9.5,
              letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>Generate</span>
          </button>
        </div>

        {/* bullets — full width, left-aligned */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            'Based on your wardrobe',
            'Matched to your occasion',
            'Ready to wear today',
          ].map((text) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              background: 'var(--surface)', border: '0.5px solid var(--line)',
              borderRadius: 8,
              fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14,
              color: 'var(--ink-soft)',
            }}>
              <Icon name="check" size={13} sw={1.6} stroke="var(--ink-mute)" />
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
  if (thinking) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink-soft)' }}>
          Composing your look…
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div style={{ padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-soft)', marginBottom: 24 }}>
          {error || 'No matching items found.'}
        </div>
        <button onClick={restart} className="press" style={{
          padding: '14px 28px', background: 'var(--ink)', color: 'var(--bg)',
          borderRadius: 100, fontFamily: 'var(--mono)', fontSize: 10,
          letterSpacing: '0.16em', textTransform: 'uppercase',
        }}>Try again</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 20px 24px' }} className="fade-in">
      <div style={{ height: 2, background: 'var(--ink)', borderRadius: 1, marginBottom: 28 }} />

      <div className="eyebrow" style={{ marginBottom: 6 }}>Your perfect look</div>
      <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 36, lineHeight: 1.1, color: 'var(--ink)', marginBottom: 4 }}>
        {result.name}
      </div>
      {result.reason && (
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-soft)', marginBottom: 20, lineHeight: 1.5 }}>
          {result.reason}
        </div>
      )}

      {/* items list */}
      <div style={{ marginBottom: 20 }}>
        {resultItems.map((it) => (
          <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '0.5px solid var(--line)' }}>
            <div style={{
              width: 44, height: 54, borderRadius: 3, flexShrink: 0, overflow: 'hidden',
              background: it.image ? 'var(--surface)' : it.tone,
            }}>
              {it.image
                ? <img src={it.image} alt={it.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <div className={it.pat !== 'solid' ? `pat-${it.pat}` : ''} style={{ width: '100%', height: '100%' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ fontSize: 8.5 }}>{it.cat}</div>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15 }}>{it.name}</div>
              {it.colors?.length > 0 && (
                <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 2 }}>{it.colors.join(' · ')}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <button onClick={restart} className="press" style={{
          flex: 1, padding: 14, background: 'transparent',
          border: '0.5px dashed var(--line)', borderRadius: 100,
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--ink-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name="shuffle" size={12} sw={1.4} /> Try again
        </button>
        <button onClick={save} disabled={saved} className="press" style={{
          flex: 1, padding: 14,
          background: saved ? 'var(--surface)' : 'var(--ink)',
          color: saved ? 'var(--ink-mute)' : 'var(--bg)',
          border: '0.5px solid var(--line)', borderRadius: 100,
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name="plus" size={12} sw={1.6} stroke={saved ? 'var(--ink-mute)' : 'var(--bg)'} />
          {saved ? 'Saved' : 'Save look'}
        </button>
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
          <GenerateWizard onNav={onNav} />
        )
      )}
    </div>
  );
}
