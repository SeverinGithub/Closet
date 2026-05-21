// HOME screen — editorial digest
import React from 'react';
import { useCloset } from '../store.jsx';
import { Icon, ItemTile, SectionHead, OutfitCard } from '../components/ui.jsx';
import { TODAY_ISO } from '../data.js';

// Real date helpers
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getTodayDisplay() {
  const d = new Date();
  return {
    day:   DAY_NAMES[d.getDay()],
    date:  d.getDate(),
    month: MONTH_NAMES[d.getMonth()],
    year:  d.getFullYear(),
  };
}

const StatTile = ({ label, value, hint }) => (
  <div style={{ background: 'var(--surface)', padding: '14px 14px 16px' }}>
    <div className="eyebrow" style={{ fontSize: 9 }}>{label}</div>
    <div style={{
      fontFamily: 'var(--serif)', fontSize: 32, lineHeight: 1, marginTop: 4,
      letterSpacing: '-0.02em', color: 'var(--ink)',
    }}>{value}</div>
    {hint && <div style={{ marginTop: 4, fontSize: 10, color: 'var(--ink-soft)', fontFamily: 'var(--mono)' }}>{hint}</div>}
  </div>
);

// Last 7 days — dynamically computed
const CalendarStrip = ({ onClick }) => {
  const { outfits, itemsById, wearLog } = useCloset();

  const today = new Date();
  const days7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - 6 + i);
    return d;
  });

  return (
    <div onClick={onClick} className="press" style={{
      margin: '0 20px', cursor: 'pointer',
      background: 'var(--surface)', border: '0.5px solid var(--line)',
      borderRadius: 4, padding: 14,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
        {days7.map((d) => {
          const iso    = d.toISOString().slice(0, 10);
          const isToday = iso === TODAY_ISO;
          const oid    = wearLog[iso];
          const out    = oid ? outfits.find((o) => o.id === oid) : null;
          const swatches = out ? out.items.slice(0, 3).map((id) => itemsById[id]?.tone).filter(Boolean) : [];
          return (
            <div key={iso} style={{ textAlign: 'center' }}>
              <div className="eyebrow" style={{ fontSize: 8.5 }}>{DAY_NAMES[d.getDay()].slice(0,1)}</div>
              <div style={{
                fontFamily: 'var(--serif)', fontSize: 16, lineHeight: 1, margin: '4px 0 6px',
                color: isToday ? 'var(--accent)' : 'var(--ink)',
                fontStyle: isToday ? 'italic' : 'normal',
              }}>{d.getDate()}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
                {swatches.length > 0
                  ? swatches.map((c, j) => <div key={j} style={{ width: 18, height: 4, background: c, borderRadius: 1 }} />)
                  : <div style={{ width: 4, height: 4, background: 'var(--line)', borderRadius: 99 }} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function HomeScreen({ mode, onNav }) {
  const { items, itemsById, outfits, wearLog, wearOutfit } = useCloset();
  const today = getTodayDisplay();

  const todayOutfit  = outfits[0] || null;
  const todayItems   = todayOutfit ? todayOutfit.items.map((id) => itemsById[id]).filter(Boolean) : [];
  const recent       = items.slice(-6).reverse();
  const suggestions  = outfits.slice(1, 5);
  const mostWorn     = items.length ? [...items].sort((a, b) => b.worn - a.worn)[0] : null;
  const thisMonth    = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const daysWorn     = Object.keys(wearLog).filter((k) => k.startsWith(thisMonth)).length;
  const wornToday    = todayOutfit ? wearLog[TODAY_ISO] === todayOutfit.id : false;

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>

      {/* ── Masthead ── */}
      <div style={{ padding: '8px 20px 18px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
          color: 'var(--ink-soft)', textTransform: 'uppercase',
          paddingBottom: 14, borderBottom: '0.5px solid var(--line)',
        }}>
          <span>{today.day} · {today.month.slice(0,3)} {String(today.date).padStart(2,'0')}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="heart" size={10} sw={1.4} /> My Closet
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--serif)', fontSize: 44, lineHeight: 0.9,
          paddingTop: 18, letterSpacing: '-0.02em',
        }}>
          <span style={{ color: 'var(--ink)' }}>The</span>{' '}
          <em style={{ color: 'var(--accent)' }}>Closet</em>
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.22em',
          color: 'var(--ink-soft)', textTransform: 'uppercase',
          marginTop: 10, display: 'flex', justifyContent: 'space-between',
        }}>
          <span>{today.month} {today.year}</span>
          <span>{items.length} pieces</span>
        </div>
      </div>

      {/* ── Today's Edit (hero) ── */}
      {todayOutfit ? (
        <div style={{ padding: '20px 20px 26px', borderTop: '0.5px solid var(--line)', borderBottom: '0.5px solid var(--line)', background: 'var(--surface)' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Today's Edit</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 36, lineHeight: 1.0, marginBottom: 14, letterSpacing: '-0.01em' }}>
            <em>{todayOutfit.name}</em><br />
            <span style={{ fontSize: 22, color: 'var(--ink-soft)' }}>
              {todayOutfit.occasion?.[0] ? `for ${todayOutfit.occasion[0].toLowerCase()}.` : 'your pick.'}
            </span>
          </div>

          {todayItems.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(todayItems.length,4)}, 1fr)`, gap: 6, marginBottom: 16 }}>
              {todayItems.slice(0,4).map((it) => (
                <ItemTile key={it.id} item={it} height={84} mode={mode} showLabel={false} frame={false} />
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => wearOutfit(todayOutfit.id)}
              className="press"
              style={{
                flex: 1, padding: '12px',
                background: wornToday ? 'transparent' : 'var(--ink)',
                color: wornToday ? 'var(--ink)' : 'var(--bg)',
                border: wornToday ? '0.5px solid var(--ink)' : 'none',
                borderRadius: 100, fontFamily: 'var(--mono)', fontSize: 11,
                letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Icon name="check" size={13} sw={1.6} /> {wornToday ? 'Worn today' : 'Wear today'}
            </button>
            <button onClick={() => onNav('ai')} className="press" style={{
              padding: '12px 18px', background: 'transparent',
              border: '0.5px solid var(--line)', borderRadius: 100,
              fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--ink)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name="shuffle" size={13} sw={1.4} />
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px 20px 26px', borderTop: '0.5px solid var(--line)', borderBottom: '0.5px solid var(--line)', background: 'var(--surface)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink-soft)', marginBottom: 16 }}>
            No outfits yet.
          </div>
          <button onClick={() => onNav('fits')} className="press" style={{
            padding: '12px 24px', background: 'var(--ink)', color: 'var(--bg)',
            borderRadius: 100, fontFamily: 'var(--mono)', fontSize: 11,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="plus" size={13} sw={1.6} /> Create an outfit
          </button>
        </div>
      )}

      {/* ── Suggested combinations ── */}
      {suggestions.length > 0 && (
        <div style={{ paddingTop: 26 }}>
          <SectionHead eyebrow="Pairings · AI" title="What to wear" action="See all" italic onAction={() => onNav('fits')} />
          <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 20px 4px' }}>
            {suggestions.map((o) => (
              <div key={o.id} style={{ flex: '0 0 160px' }}>
                <OutfitCard outfit={o} onClick={() => onNav('outfit', o.id)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent additions ── */}
      {recent.length > 0 && (
        <div style={{ paddingTop: 32 }}>
          <SectionHead eyebrow={`Wardrobe · ${items.length} pieces`} title="Recently added" action="Browse" onAction={() => onNav('wardrobe')} />
          <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 20px 4px' }}>
            {recent.map((it) => (
              <div key={it.id} style={{ flex: '0 0 108px' }}>
                <ItemTile item={it} height={140} mode={mode} onClick={() => onNav('item', it.id)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stats peek ── */}
      {items.length > 0 && (
        <div style={{ padding: '32px 20px 0' }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>{today.month}, in review</div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
            background: 'var(--line)', border: '0.5px solid var(--line)',
            borderRadius: 4, overflow: 'hidden',
          }}>
            <StatTile label="Days worn" value={String(daysWorn)} hint={`of ${new Date(today.year, new Date().getMonth()+1, 0).getDate()}`} />
            <StatTile label="Most worn" value={mostWorn ? mostWorn.worn.toString() : '—'} hint={mostWorn?.name} />
            <StatTile label="In wardrobe" value={items.length} hint="pieces" />
            <StatTile label="Outfits" value={outfits.length} hint="combinations" />
          </div>
          <button onClick={() => onNav('stats')} className="press" style={{
            width: '100%', marginTop: 12, padding: 12, background: 'transparent',
            border: '0.5px dashed var(--line)', borderRadius: 4,
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--ink-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            Full report <Icon name="arrowR" size={12} sw={1.4} />
          </button>
        </div>
      )}

      {/* ── Calendar peek ── */}
      <div style={{ padding: '32px 20px 0' }}>
        <SectionHead eyebrow="Wear Log" title="The diary" italic action="Open" onAction={() => onNav('calendar')} />
        <CalendarStrip onClick={() => onNav('calendar')} />
      </div>

      {/* footer mark */}
      <div style={{
        marginTop: 40, padding: '24px 20px 16px', textAlign: 'center',
        fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13,
        color: 'var(--ink-mute)', borderTop: '0.5px solid var(--line)',
      }}>
        Dress with intention.
      </div>
    </div>
  );
}
