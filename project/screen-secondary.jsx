// ─────────────────────────────────────────────────────────────
// Calendar screen
// ─────────────────────────────────────────────────────────────
const CalendarScreen = ({ mode, onBack, onNav }) => {
  // Build March 2026 grid. March 1, 2026 is a Sunday.
  // We use Mon-Sun grid → March 1 starts at col 7 (Sun = col 6 if Mon-first → index 6)
  const month = 'March 2026';
  const daysInMonth = 31;
  const firstWeekday = 0; // Sunday → 0 in Sun-first... let's use Sun-Sat header for simplicity
  // Sun-first header
  const header = ['S','M','T','W','T','F','S'];
  const cells = [];
  // March 1 2026 is Sunday → index 0 in Sun-first
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4}/>
        </button>
        <div className="eyebrow">The Diary</div>
        <button className="press" style={{ padding: 8 }}>
          <Icon name="sliders" size={18} sw={1.4}/>
        </button>
      </div>

      {/* title */}
      <div style={{ padding: '12px 20px 6px' }}>
        <div className="h-display" style={{ fontSize: 44, color: 'var(--ink)' }}>
          <em>March</em>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
          2026 · 22 days worn
        </div>
      </div>

      {/* month selector */}
      <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '14px 20px 18px' }}>
        {['Jan','Feb','Mar','Apr','May','Jun'].map((m, i) => (
          <Chip key={m} mono active={m === 'Mar'}>{m}</Chip>
        ))}
      </div>

      {/* weekday header */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
        {header.map((d, i) => (
          <div key={i} className="eyebrow" style={{ textAlign: 'center', fontSize: 9 }}>{d}</div>
        ))}
      </div>

      {/* grid */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i}/>;
          const iso = `2026-03-${String(d).padStart(2,'0')}`;
          const oid = WEAR_LOG[iso];
          const out = oid ? OUTFITS.find(o => o.id === oid) : null;
          const swatches = out ? out.items.slice(0,3).map(id => ITEMS_BY_ID[id]?.tone) : [];
          return (
            <div key={i} onClick={() => out && onNav('outfit', out.id)} className="press"
              style={{
                position: 'relative', paddingBottom: '100%', borderRadius: 3,
                background: out ? 'var(--surface)' : 'transparent',
                border: '0.5px solid var(--line)',
                cursor: out ? 'pointer' : 'default',
              }}>
              <div style={{
                position: 'absolute', inset: 0, padding: 4,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 13, lineHeight: 1, alignSelf: 'flex-start' }}>{d}</div>
                {swatches.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1, width: '70%' }}>
                    {swatches.map((c, j) => (
                      <div key={j} style={{ height: 3, background: c, borderRadius: 1 }}/>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* legend */}
      <div style={{ padding: '18px 20px 0' }}>
        <hr className="rule"/>
        <div style={{ padding: '14px 0' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Last worn</div>
          {[
            { d: 31, name: 'Trench Story', occ: 'Travel' },
            { d: 30, name: 'Utility Walk', occ: 'Errands' },
            { d: 29, name: 'Parisian Sunday', occ: 'Brunch' },
          ].map(e => (
            <div key={e.d} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '10px 0', borderBottom: '0.5px solid var(--line)',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18 }}>{e.name}</div>
                <div style={{ fontSize: 10, color: 'var(--ink-soft)', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{e.occ}</div>
              </div>
              <div className="eyebrow" style={{ fontFamily: 'var(--serif)', fontStyle: 'normal', fontSize: 24, color: 'var(--ink)', letterSpacing: 0 }}>
                Mar {e.d}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Stats screen
// ─────────────────────────────────────────────────────────────
const StatsScreen = ({ mode, onBack, onNav }) => {
  const mostWorn = [...ITEMS].sort((a,b) => b.worn - a.worn).slice(0, 5);
  const unworn = [...ITEMS].sort((a,b) => a.worn - b.worn).slice(0, 4);
  const catTotals = CATEGORIES.map(c => ({
    c, count: ITEMS.filter(i => i.cat === c).length,
    worn: ITEMS.filter(i => i.cat === c).reduce((s,i) => s+i.worn, 0),
  }));
  const maxWorn = Math.max(...catTotals.map(c => c.worn));

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4}/>
        </button>
        <div className="eyebrow">The Report</div>
        <div style={{ width: 36 }}/>
      </div>

      {/* hero */}
      <div style={{ padding: '12px 20px 24px' }}>
        <div className="eyebrow">Q1 · 2026</div>
        <div className="h-display" style={{ fontSize: 44, color: 'var(--ink)', marginTop: 6 }}>
          A <em style={{ color: 'var(--accent)' }}>wardrobe</em>, read.
        </div>
      </div>

      {/* big numbers */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 1,
          background: 'var(--line)', border: '0.5px solid var(--line)', borderRadius: 4, overflow: 'hidden',
        }}>
          <BigStat label="Items in closet" value={ITEMS.length} big/>
          <BigStat label="Avg worn / week" value="11"/>
          <BigStat label="Outfit ideas" value={OUTFITS.length}/>
        </div>
      </div>

      {/* category breakdown */}
      <div style={{ padding: '0 20px' }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>By category — wear share</div>
        {catTotals.map(c => (
          <div key={c.c} style={{ padding: '10px 0', borderBottom: '0.5px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{c.c}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontStyle: 'italic' }}>
                {c.worn}<span style={{ color: 'var(--ink-mute)', fontSize: 11, fontStyle: 'normal', fontFamily: 'var(--mono)' }}>×</span>
              </div>
            </div>
            <div style={{ height: 2, background: 'var(--line-soft)' }}>
              <div style={{ height: '100%', width: `${(c.worn/maxWorn)*100}%`, background: 'var(--ink)', transition: 'width 0.5s' }}/>
            </div>
          </div>
        ))}
      </div>

      {/* most worn */}
      <div style={{ paddingTop: 32 }}>
        <SectionHead eyebrow="Hall of fame" title="Most worn" italic/>
        <div style={{ padding: '0 20px' }}>
          {mostWorn.map((it, i) => (
            <button key={it.id} onClick={() => onNav('item', it.id)} className="press" style={{
              width: '100%', padding: '10px 0', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: '0.5px solid var(--line)', textAlign: 'left',
            }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontStyle: 'italic', width: 28, color: 'var(--ink-mute)' }}>
                {String(i+1).padStart(2,'0')}
              </div>
              <div className={it.pat !== 'solid' ? `pat-${it.pat}` : ''}
                style={{ width: 40, height: 50, background: it.tone, borderRadius: 3, flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="eyebrow" style={{ fontSize: 8.5 }}>{it.cat}</div>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.1 }}>{it.name}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1, textAlign: 'right' }}>{it.worn}<span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>×</span></div>
                <div style={{ fontSize: 9, color: 'var(--ink-mute)', fontFamily: 'var(--mono)', textAlign: 'right', letterSpacing: '0.1em', textTransform: 'uppercase' }}>since Jan</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* unworn — gentle call out */}
      <div style={{ paddingTop: 32 }}>
        <div style={{ padding: '0 20px', marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Neglected · {unworn.length}</div>
          <div className="h-display" style={{ fontSize: 28 }}>
            Forgotten <em>pieces</em>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-soft)', marginTop: 4 }}>
            Untouched in 60+ days. Give them a moment.
          </div>
        </div>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 20px' }}>
          {unworn.map(it => (
            <div key={it.id} style={{ flex: '0 0 120px' }}>
              <ItemTile item={it} height={150} mode={mode} onClick={() => onNav('item', it.id)}/>
            </div>
          ))}
        </div>
      </div>

      {/* footnote */}
      <div style={{
        marginTop: 36, padding: '18px 20px', textAlign: 'center',
        fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-mute)',
        borderTop: '0.5px solid var(--line)',
      }}>
        — End of report —
      </div>
    </div>
  );
};

const BigStat = ({ label, value, big }) => (
  <div style={{ background: 'var(--surface)', padding: big ? '18px 16px 20px' : '18px 12px 20px' }}>
    <div className="eyebrow" style={{ fontSize: 9 }}>{label}</div>
    <div style={{
      fontFamily: 'var(--serif)', fontSize: big ? 56 : 38, lineHeight: 0.92, marginTop: 6,
      letterSpacing: '-0.02em', color: 'var(--ink)',
    }}>{value}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Wardrobe browse
// ─────────────────────────────────────────────────────────────
const WardrobeScreen = ({ mode, onBack, onNav }) => {
  const [cat, setCat] = React.useState('ALL');
  const filtered = cat === 'ALL' ? ITEMS : ITEMS.filter(i => i.cat === cat);

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4}/>
        </button>
        <div className="eyebrow">Volume I</div>
        <button className="press" style={{ padding: 8 }}>
          <Icon name="search" size={18} sw={1.4}/>
        </button>
      </div>

      <div style={{ padding: '8px 20px 14px' }}>
        <div className="h-display" style={{ fontSize: 44, color: 'var(--ink)' }}>
          The <em>wardrobe</em>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--ink-soft)', textTransform: 'uppercase', marginTop: 4 }}>
          {filtered.length} of {ITEMS.length} pieces
        </div>
      </div>

      <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 20px 18px' }}>
        {['ALL', ...CATEGORIES].map(c => (
          <Chip key={c} mono active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
        ))}
      </div>

      <div style={{ padding: '0 20px' }}>
        <div className="masonry-2">
          {filtered.map(it => (
            <ItemTile key={it.id} item={it} mode={mode} onClick={() => onNav('item', it.id)}/>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// AI suggestion flow — mood + occasion → pairing
// ─────────────────────────────────────────────────────────────
const AIScreen = ({ mode, onBack, onNav }) => {
  const [vibe, setVibe] = React.useState(null);
  const [occ, setOcc] = React.useState(null);
  const [generated, setGenerated] = React.useState(null);
  const [thinking, setThinking] = React.useState(false);

  const generate = () => {
    setThinking(true);
    setTimeout(() => {
      const pool = OUTFITS.filter(o => !vibe || o.mood === vibe);
      setGenerated(pool[Math.floor(Math.random() * pool.length)]);
      setThinking(false);
    }, 900);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4}/>
        </button>
        <div className="eyebrow">Stylist · AI</div>
        <div style={{ width: 36 }}/>
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
          ].map(v => (
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
          {['Office','Date','Brunch','Travel','Party','Gym','Errands','Cocktails'].map(o => (
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
          <Icon name="cloud" size={28} sw={1.2}/>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <button onClick={generate} disabled={!vibe} className="press" style={{
          width: '100%', padding: 16,
          background: vibe ? 'var(--accent)' : 'var(--ink-mute)',
          color: '#fff', borderRadius: 100,
          fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em',
          textTransform: 'uppercase', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.2s',
        }}>
          <Icon name="sparkle" size={14} stroke="#fff" sw={1.6}/>
          {thinking ? 'Composing…' : 'Compose a look'}
        </button>
      </div>

      {/* generated result */}
      {generated && !thinking && (
        <div style={{ padding: '24px 20px 0' }} className="fade-in">
          <hr className="rule"/>
          <div style={{ padding: '20px 0 12px' }}>
            <div className="eyebrow">Proposed</div>
            <OutfitCard outfit={generated} large mode={mode} onClick={() => onNav('outfit', generated.id)}/>
          </div>
          <button onClick={generate} className="press" style={{
            width: '100%', marginTop: 8, padding: 12, background: 'transparent',
            border: '0.5px dashed var(--line)', borderRadius: 4,
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--ink-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Icon name="shuffle" size={12} sw={1.4}/> Try another
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Onboarding — single screen, splash-y
// ─────────────────────────────────────────────────────────────
const OnboardingScreen = ({ onDone }) => {
  return (
    <div className="fade-in" style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)',
      padding: '60px 28px 110px',
    }}>
      {/* logo */}
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.3em',
        color: 'var(--ink-soft)', textTransform: 'uppercase',
      }}>The Closet · est. 2026</div>

      {/* hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="h-display" style={{ fontSize: 68, color: 'var(--ink)', letterSpacing: '-0.025em' }}>
          Every<br/>
          piece<br/>
          you<br/>
          <em style={{ color: 'var(--accent)' }}>own</em>.
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-soft)', marginTop: 22, lineHeight: 1.35, maxWidth: 280 }}>
          Photograph it. Tag it. Wear it more.
          A diary for the things you actually wear.
        </div>
      </div>

      {/* sample swatches */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {ITEMS.slice(0, 8).map(it => (
          <div key={it.id} className={it.pat !== 'solid' ? `pat-${it.pat}` : ''}
            style={{ flex: 1, height: 56, background: it.tone, borderRadius: 2 }}/>
        ))}
      </div>

      <button onClick={onDone} className="press" style={{
        padding: '16px', background: 'var(--ink)', color: 'var(--bg)',
        borderRadius: 100, fontFamily: 'var(--mono)', fontSize: 11,
        letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        Begin <Icon name="arrowR" size={13} stroke="var(--bg)" sw={1.6}/>
      </button>

      <div style={{
        marginTop: 14, textAlign: 'center',
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.2em',
        color: 'var(--ink-mute)', textTransform: 'uppercase',
      }}>
        № 042 · Spring Edition
      </div>
    </div>
  );
};

Object.assign(window, { CalendarScreen, StatsScreen, WardrobeScreen, AIScreen, OnboardingScreen });
