import React, { useEffect, useState } from 'react';
import { useCloset } from '../store.jsx';
import { Icon, Chip } from '../components/ui.jsx';
import { fetchWeather } from '../lib/weather.js';
import { generateOutfitWithGemini } from '../lib/gemini.js';

// ── Weather icon ─────────────────────────────────────────────
function WeatherIcon({ condition, size = 28 }) {
  const c = condition?.toLowerCase() || '';
  if (c.includes('rain') || c.includes('drizzle'))
    return <Icon name="cloud" size={size} sw={1.2} />;
  if (c.includes('snow'))
    return <Icon name="cloud" size={size} sw={1.2} />;
  if (c.includes('clear'))
    return <Icon name="sun" size={size} sw={1.2} />;
  return <Icon name="cloud" size={size} sw={1.2} />;
}

// ── Item tiles for the generated outfit preview ──────────────
function GeneratedItem({ item }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 0', borderBottom: '0.5px solid var(--line)',
    }}>
      <div style={{
        width: 52, height: 64, borderRadius: 3, flexShrink: 0, overflow: 'hidden',
        background: item.image ? 'var(--surface)' : item.tone,
        border: '0.5px solid var(--line)',
      }}>
        {item.image && (
          <img src={item.image} alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink)' }}>
          {item.name}
        </div>
        <div style={{ fontSize: 10, color: 'var(--ink-mute)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
          {item.cat}
        </div>
        {item.colors?.length > 0 && (
          <div style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 3 }}>
            {item.colors.join(' · ')}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIScreen({ onBack, onNav }) {
  const { items, addOutfit } = useCloset();

  const [vibe, setVibe]           = useState(null);
  const [occ, setOcc]             = useState(null);
  const [weather, setWeather]     = useState(null);
  const [weatherErr, setWeatherErr] = useState(false);
  const [thinking, setThinking]   = useState(false);
  const [result, setResult]       = useState(null); // { item_ids, name, reason }
  const [error, setError]         = useState(null);
  const [saved, setSaved]         = useState(false);

  // Fetch weather on mount
  useEffect(() => {
    fetchWeather()
      .then(setWeather)
      .catch(() => setWeatherErr(true));
  }, []);

  const resultItems = result
    ? result.item_ids.map((id) => items.find((it) => it.id === id)).filter(Boolean)
    : [];

  const generate = async () => {
    if (!vibe || !weather) return;
    setThinking(true);
    setResult(null);
    setError(null);
    setSaved(false);
    try {
      const suggestion = await generateOutfitWithGemini({ items, weather, vibe, occasion: occ });
      setResult(suggestion);
    } catch (e) {
      console.error('Outfit generation failed:', e);
      setError('Generation failed — check console for details.');
    } finally {
      setThinking(false);
    }
  };

  const save = () => {
    if (!result || saved) return;
    addOutfit({
      name:     result.name || 'AI Look',
      mood:     vibe,
      items:    result.item_ids,
      occasion: occ ? [occ] : [],
    });
    setSaved(true);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      {/* header */}
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

      {/* vibe */}
      <div style={{ padding: '0 20px 24px' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Vibe</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {[
            { id: 'WORK',    label: 'Work',      sub: 'Tailored' },
            { id: 'CASUAL',  label: 'Off-duty',  sub: 'Easy' },
            { id: 'EVENING', label: 'After dark', sub: 'Bold' },
          ].map((v) => (
            <button key={v.id} onClick={() => setVibe(v.id)} className="press" style={{
              padding: 12, borderRadius: 4, textAlign: 'left',
              background: vibe === v.id ? 'var(--ink)' : 'var(--surface)',
              color:      vibe === v.id ? 'var(--bg)'  : 'var(--ink)',
              border: '0.5px solid var(--line)',
            }}>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, lineHeight: 1 }}>{v.label}</div>
              <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{v.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* occasion */}
      <div style={{ padding: '0 20px 24px' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Occasion</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Office', 'Date', 'Brunch', 'Travel', 'Party', 'Gym', 'Errands', 'Cocktails'].map((o) => (
            <Chip key={o} active={occ === o} onClick={() => setOcc(occ === o ? null : o)}>{o}</Chip>
          ))}
        </div>
      </div>

      {/* weather */}
      <div style={{ padding: '0 20px 24px' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Weather</div>
        <div style={{
          background: 'var(--surface)', border: '0.5px solid var(--line)',
          borderRadius: 4, padding: 14,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
        }}>
          {weather ? (
            <>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, lineHeight: 1.15 }}>
                  {weather.temp}° · {weather.condition}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4 }}>
                  {weather.city} · {weather.desc}
                </div>
              </div>
              <WeatherIcon condition={weather.condition} size={28} />
            </>
          ) : weatherErr ? (
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--mono)' }}>
              Location unavailable — generation will skip weather
            </div>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--mono)' }}>
              Fetching location…
            </div>
          )}
        </div>
      </div>

      {/* generate button */}
      <div style={{ padding: '0 20px' }}>
        <button
          onClick={generate}
          disabled={!vibe || thinking || items.length === 0}
          className="press"
          style={{
            width: '100%', padding: 16,
            background: vibe && !thinking ? 'var(--accent)' : 'var(--ink-mute)',
            color: '#fff', borderRadius: 100,
            fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
          }}>
          <Icon name="sparkle" size={14} stroke="#fff" sw={1.6} />
          {thinking ? 'Composing…' : 'Compose a look'}
        </button>
        {items.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'var(--ink-mute)', fontFamily: 'var(--mono)' }}>
            Add items to your wardrobe first
          </div>
        )}
      </div>

      {/* error */}
      {error && (
        <div style={{ margin: '16px 20px 0', padding: 12, background: 'var(--surface)', borderRadius: 4, border: '0.5px solid var(--line)' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-mute)', fontFamily: 'var(--mono)' }}>{error}</div>
        </div>
      )}

      {/* result */}
      {result && !thinking && (
        <div style={{ padding: '24px 20px 0' }} className="fade-in">
          <hr className="rule" />

          <div style={{ padding: '20px 0 6px' }}>
            <div className="eyebrow">Proposed look</div>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 28, color: 'var(--ink)', marginTop: 6, lineHeight: 1.15 }}>
              {result.name}
            </div>
            {result.reason && (
              <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.5 }}>
                {result.reason}
              </div>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            {resultItems.map((it) => <GeneratedItem key={it.id} item={it} />)}
          </div>

          {/* actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={generate} className="press" style={{
              flex: 1, padding: 12, background: 'transparent',
              border: '0.5px dashed var(--line)', borderRadius: 4,
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--ink-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Icon name="shuffle" size={12} sw={1.4} /> Shuffle
            </button>
            <button onClick={save} disabled={saved} className="press" style={{
              flex: 1, padding: 12,
              background: saved ? 'var(--surface)' : 'var(--ink)',
              color: saved ? 'var(--ink-mute)' : 'var(--bg)',
              border: '0.5px solid var(--line)', borderRadius: 4,
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
              textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Icon name="plus" size={12} sw={1.6} stroke={saved ? 'var(--ink-mute)' : 'var(--bg)'} />
              {saved ? 'Saved' : 'Save look'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
