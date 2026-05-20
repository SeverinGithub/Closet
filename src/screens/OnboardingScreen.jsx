// Onboarding — single splash screen
import React from 'react';
import { useCloset } from '../store.jsx';
import { Icon } from '../components/ui.jsx';

export default function OnboardingScreen({ onDone }) {
  const { items } = useCloset();

  return (
    <div className="fade-in" style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', padding: '60px 28px 110px',
    }}>
      {/* logo */}
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.3em',
        color: 'var(--ink-soft)', textTransform: 'uppercase',
      }}>The Closet · est. 2026</div>

      {/* hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="h-display" style={{ fontSize: 68, color: 'var(--ink)', letterSpacing: '-0.025em' }}>
          Every<br />
          piece<br />
          you<br />
          <em style={{ color: 'var(--accent)' }}>own</em>.
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-soft)', marginTop: 22, lineHeight: 1.35, maxWidth: 280 }}>
          Photograph it. Tag it. Wear it more.
          A diary for the things you actually wear.
        </div>
      </div>

      {/* sample swatches */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {items.slice(0, 8).map((it) => (
          <div key={it.id} className={it.pat !== 'solid' ? `pat-${it.pat}` : ''}
            style={{ flex: 1, height: 56, background: it.tone, borderRadius: 2 }} />
        ))}
      </div>

      <button onClick={onDone} className="press" style={{
        padding: '16px', background: 'var(--ink)', color: 'var(--bg)',
        borderRadius: 100, fontFamily: 'var(--mono)', fontSize: 11,
        letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        Begin <Icon name="arrowR" size={13} stroke="var(--bg)" sw={1.6} />
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
}
