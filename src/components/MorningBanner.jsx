import React, { useState } from 'react';
import { Icon } from './ui.jsx';

function isMorningWindow() {
  const h = new Date().getHours();
  return h >= 6 && h < 12;
}

export default function MorningBanner({ todayLogged, onLogOutfit, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (todayLogged) return null;
  if (!isMorningWindow()) return null;

  const hour = new Date().getHours();
  const greeting = hour < 9 ? 'Good morning' : hour < 11 ? 'Morning' : 'Hey';

  return (
    <div className="fade-in" style={{
      margin: '0 20px 20px',
      background: 'var(--ink)',
      color: 'var(--bg)',
      borderRadius: 8,
      padding: '18px 18px 16px',
      position: 'relative',
    }}>
      {/* dismiss */}
      <button
        onClick={() => { setDismissed(true); onDismiss?.(); }}
        className="press"
        style={{
          position: 'absolute', top: 12, right: 12,
          padding: 4, opacity: 0.5,
        }}
      >
        <Icon name="close" size={14} sw={1.8} stroke="var(--bg)" />
      </button>

      <div style={{
        fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em',
        textTransform: 'uppercase', opacity: 0.6, marginBottom: 6,
      }}>
        Daily reminder
      </div>

      <div style={{
        fontFamily: 'var(--serif)', fontStyle: 'italic',
        fontSize: 22, lineHeight: 1.15, marginBottom: 14,
      }}>
        {greeting}. What are<br />you wearing today?
      </div>

      <button
        onClick={() => { setDismissed(true); onLogOutfit(); }}
        className="press"
        style={{
          width: '100%', padding: '11px',
          background: 'var(--bg)', color: 'var(--ink)',
          borderRadius: 100,
          fontFamily: 'var(--mono)', fontSize: 10.5,
          letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}
      >
        <Icon name="check" size={13} sw={2} /> Log today's outfit
      </button>
    </div>
  );
}
