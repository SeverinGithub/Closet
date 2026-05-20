// ─────────────────────────────────────────────────────────────
// Outfit Detail screen
// ─────────────────────────────────────────────────────────────
const OutfitDetail = ({ outfitId, mode, onBack, onNav }) => {
  const outfit = OUTFITS.find(o => o.id === outfitId) || OUTFITS[0];
  const items = outfit.items.map(id => ITEMS_BY_ID[id]);
  const issueNum = String(OUTFITS.indexOf(outfit) + 1).padStart(2, '0');

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      {/* nav */}
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4}/>
        </button>
        <button className="press" style={{ padding: 8 }}>
          <Icon name="heart" size={20} sw={1.4}/>
        </button>
      </div>

      {/* hero */}
      <div style={{ padding: '0 20px' }}>
        <div className="eyebrow">Look № {issueNum} · {outfit.mood}</div>
        <div className="h-display" style={{ fontSize: 56, marginTop: 4, color: 'var(--ink)' }}>
          <em>{outfit.name}</em>
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14,
          color: 'var(--ink-soft)', marginTop: 8 }}>
          A {outfit.items.length}-piece composition · {outfit.occasion.join(', ')}.
        </div>
      </div>

      {/* big stack */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{
          border: '0.5px solid var(--line)', borderRadius: 6, overflow: 'hidden',
          background: 'var(--line)',
          display: 'grid', gap: 1,
          gridTemplateColumns: items.length >= 4 ? '1fr 1fr' : '1fr 1fr',
        }}>
          {items.map(it => (
            <div key={it.id} style={{
              position: 'relative', paddingBottom: '100%',
            }}>
              <div className={it.pat !== 'solid' ? `pat-${it.pat}` : ''}
                style={{
                  position: 'absolute', inset: 0,
                  background: it.tone, overflow: 'hidden',
                }}>
                <div style={{ position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent 50%, rgba(0,0,0,0.1))',
                }}/>
                <div style={{
                  position: 'absolute', bottom: 8, left: 10,
                  fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13,
                  color: tonalText(it.tone, 1),
                }}>{it.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* item list */}
      <div style={{ padding: '24px 20px 0' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>The pieces</div>
        {items.map(it => (
          <button key={it.id} onClick={() => onNav('item', it.id)} className="press" style={{
            width: '100%', padding: '10px 0', display: 'flex', alignItems: 'center', gap: 12,
            borderBottom: '0.5px solid var(--line)', textAlign: 'left',
          }}>
            <div className={it.pat !== 'solid' ? `pat-${it.pat}` : ''}
              style={{ width: 44, height: 56, background: it.tone, borderRadius: 3, flexShrink: 0 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="eyebrow" style={{ fontSize: 8.5 }}>{it.cat}</div>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.1 }}>{it.name}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 2 }}>Worn {it.worn}×</div>
            </div>
            <Icon name="chevron" size={14} sw={1.4} stroke="var(--ink-mute)"/>
          </button>
        ))}
      </div>

      {/* alternatives */}
      <div style={{ padding: '32px 0 0' }}>
        <SectionHead eyebrow="Similar in spirit" title="Or try" italic/>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 20px' }}>
          {OUTFITS.filter(o => o.mood === outfit.mood && o.id !== outfit.id).slice(0,4).map(o => (
            <div key={o.id} style={{ flex: '0 0 150px' }}>
              <OutfitCard outfit={o} mode={mode} onClick={() => onNav('outfit', o.id)}/>
            </div>
          ))}
        </div>
      </div>

      {/* CTA bar */}
      <div style={{ padding: '28px 20px 0', display: 'flex', gap: 8 }}>
        <button className="press" style={{
          flex: 1, padding: 14, background: 'var(--ink)', color: 'var(--bg)',
          borderRadius: 100, fontFamily: 'var(--mono)', fontSize: 11,
          letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Icon name="check" size={13} sw={1.6}/> Wear today
        </button>
        <button className="press" style={{
          padding: '14px 18px', background: 'transparent',
          border: '0.5px solid var(--line)', borderRadius: 100,
          color: 'var(--ink)',
        }}>
          <Icon name="calendar" size={15} sw={1.4}/>
        </button>
        <button className="press" style={{
          padding: '14px 18px', background: 'transparent',
          border: '0.5px solid var(--line)', borderRadius: 100,
          color: 'var(--ink)',
        }}>
          <Icon name="edit" size={15} sw={1.4}/>
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Item Detail
// ─────────────────────────────────────────────────────────────
const ItemDetail = ({ itemId, mode, onBack, onNav }) => {
  const item = ITEMS_BY_ID[itemId] || ITEMS[0];
  const inOutfits = OUTFITS.filter(o => o.items.includes(item.id));

  return (
    <div className="fade-in" style={{ paddingBottom: 110 }}>
      <div style={{ padding: '4px 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4}/>
        </button>
        <button className="press" style={{ padding: 8 }}>
          <Icon name="edit" size={18} sw={1.4}/>
        </button>
      </div>

      {/* hero swatch */}
      <div className={item.pat !== 'solid' ? `pat-${item.pat}` : ''} style={{
        margin: '0 20px', height: 320, background: item.tone,
        borderRadius: 6, position: 'relative', overflow: 'hidden',
        border: '0.5px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent 30%, transparent 70%, rgba(0,0,0,0.18))',
        }}/>
        <div style={{
          position: 'absolute', top: 14, left: 16,
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: tonalText(item.tone, 0.8),
        }}>{item.cat}</div>
        <div style={{
          position: 'absolute', bottom: 18, left: 18, right: 18,
          fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 36, lineHeight: 0.95,
          color: tonalText(item.tone, 1),
        }}>{item.name}</div>
      </div>

      {/* stats */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
          background: 'var(--line)', border: '0.5px solid var(--line)', borderRadius: 4, overflow: 'hidden' }}>
          <StatTileMini label="Worn" value={`${item.worn}×`}/>
          <StatTileMini label="Last" value={item.last}/>
          <StatTileMini label="Cost / wear" value="€ 4.20"/>
        </div>
      </div>

      {/* tags */}
      <div style={{ padding: '20px 20px 0' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Tags</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {item.tags.map(t => <Chip key={t}># {t}</Chip>)}
        </div>
      </div>

      {/* worn with */}
      <div style={{ paddingTop: 28 }}>
        <SectionHead eyebrow={`In ${inOutfits.length} outfits`} title="Pairs well with" italic/>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 20px' }}>
          {inOutfits.length > 0 ? inOutfits.map(o => (
            <div key={o.id} style={{ flex: '0 0 150px' }}>
              <OutfitCard outfit={o} mode={mode} onClick={() => onNav('outfit', o.id)}/>
            </div>
          )) : (
            <div style={{ flex: 1, padding: 20, textAlign: 'center', color: 'var(--ink-soft)', fontStyle: 'italic', fontFamily: 'var(--serif)' }}>
              No outfits yet — try the generator.
            </div>
          )}
        </div>
      </div>

      {/* combine with — suggested singles */}
      <div style={{ paddingTop: 28 }}>
        <SectionHead eyebrow="AI Suggests" title="Combine with"/>
        <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {ITEMS.filter(i => i.cat !== item.cat).slice(0,3).map(i => (
            <ItemTile key={i.id} item={i} height={140} mode={mode} onClick={() => onNav('item', i.id)}/>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatTileMini = ({ label, value }) => (
  <div style={{ background: 'var(--surface)', padding: '12px 12px 14px' }}>
    <div className="eyebrow" style={{ fontSize: 8.5 }}>{label}</div>
    <div style={{ fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1, marginTop: 4 }}>{value}</div>
  </div>
);

Object.assign(window, { OutfitDetail, ItemDetail });
