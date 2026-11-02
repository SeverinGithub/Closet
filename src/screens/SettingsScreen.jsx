import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCloset } from '../store.jsx';
import { Icon } from '../components/ui.jsx';
import { requestNotificationPermission } from '../hooks/useMorningReminder.js';

const Row = ({ icon, label, children, danger }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px', borderBottom: '0.5px solid var(--line)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Icon name={icon} size={18} sw={1.4} stroke={danger ? 'var(--accent)' : 'var(--ink)'} />
      <span style={{
        fontFamily: 'var(--sans)', fontSize: 15,
        color: danger ? 'var(--accent)' : 'var(--ink)',
      }}>{label}</span>
    </div>
    {children}
  </div>
);

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className="press"
    style={{
      width: 44, height: 26, borderRadius: 99, padding: 3,
      background: value ? 'var(--ink)' : 'var(--line)',
      display: 'flex', alignItems: 'center',
      justifyContent: value ? 'flex-end' : 'flex-start',
      transition: 'background 0.2s, justify-content 0.2s',
      flexShrink: 0,
    }}
  >
    <div style={{
      width: 20, height: 20, borderRadius: '50%',
      background: value ? 'var(--bg)' : 'var(--surface)',
      transition: 'background 0.2s',
    }} />
  </button>
);

const Section = ({ label, children }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{
      padding: '0 20px 10px',
      fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em',
      textTransform: 'uppercase', color: 'var(--ink-mute)',
    }}>{label}</div>
    <div style={{ background: 'var(--surface)', borderTop: '0.5px solid var(--line)' }}>
      {children}
    </div>
  </div>
);

export default function SettingsScreen({ onBack, userEmail }) {
  const { logout, resetPassword } = useAuth();
  const { tweaks, setTweak } = useCloset();
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleResetPassword = async () => {
    setResetLoading(true);
    const { error } = await resetPassword(userEmail);
    setResetLoading(false);
    if (!error) setResetSent(true);
    else alert('Could not send reset link: ' + error.message);
  };

  const handleReminderToggle = async (v) => {
    if (v) {
      const perm = await requestNotificationPermission();
      if (perm === 'denied') {
        alert('Notifications are blocked. Enable them in your browser/OS settings.');
        return;
      }
      if (perm === 'unsupported') {
        alert('Your browser does not support notifications.');
        return;
      }
    }
    setTweak('reminderEnabled', v);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div style={{
        padding: 'max(16px, env(safe-area-inset-top)) 16px 0',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <button onClick={onBack} className="press" style={{ padding: 8 }}>
          <Icon name="back" size={20} sw={1.4} />
        </button>
      </div>

      <div style={{ padding: '12px 20px 28px' }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Account & Preferences</div>
        <div className="h-display" style={{ fontSize: 40, color: 'var(--ink)' }}>
          <em style={{ color: 'var(--accent)' }}>Settings</em>
        </div>
      </div>

      {/* Account */}
      <Section label="Account">
        <div style={{ padding: '14px 20px', borderBottom: '0.5px solid var(--line)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 4 }}>
            Signed in as
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, color: 'var(--ink)', wordBreak: 'break-all' }}>
            {userEmail}
          </div>
        </div>

        <button
          onClick={handleResetPassword}
          disabled={resetSent || resetLoading}
          className="press"
          style={{
            width: '100%', padding: '14px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '0.5px solid var(--line)',
            opacity: resetSent || resetLoading ? 0.6 : 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="edit" size={18} sw={1.4} />
            <span style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--ink)' }}>
              {resetSent ? 'Reset link sent ✓' : resetLoading ? 'Sending…' : 'Change password'}
            </span>
          </div>
          {!resetSent && <Icon name="arrowR" size={16} sw={1.4} stroke="var(--ink-mute)" />}
        </button>

        {resetSent && (
          <div style={{
            padding: '10px 20px 12px',
            fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13,
            color: 'var(--ink-soft)', borderBottom: '0.5px solid var(--line)',
          }}>
            Check your inbox at {userEmail} for the reset link.
          </div>
        )}

        <button
          onClick={logout}
          className="press"
          style={{
            width: '100%', padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <Icon name="arrowR" size={18} sw={1.4} stroke="var(--accent)"
            style={{ transform: 'rotate(180deg)' }} />
          <span style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--accent)' }}>
            Sign out
          </span>
        </button>
      </Section>

      {/* Appearance */}
      <Section label="Appearance">
        <Row icon={tweaks.dark ? 'moon' : 'sun'} label={tweaks.dark ? 'Dark mode' : 'Light mode'}>
          <Toggle value={tweaks.dark} onChange={(v) => setTweak('dark', v)} />
        </Row>
        <Row icon="image" label="Item display">
          <div style={{ display: 'flex', gap: 1, borderRadius: 6, overflow: 'hidden', border: '0.5px solid var(--line)' }}>
            {['photo', 'cutout'].map((m) => (
              <button
                key={m}
                onClick={() => setTweak('itemMode', m)}
                className="press"
                style={{
                  padding: '5px 12px',
                  background: tweaks.itemMode === m ? 'var(--ink)' : 'var(--surface)',
                  color: tweaks.itemMode === m ? 'var(--bg)' : 'var(--ink-soft)',
                  fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </Row>
      </Section>

      {/* Notifications */}
      <Section label="Notifications">
        <Row icon="heart" label="Morning reminder">
          <Toggle value={tweaks.reminderEnabled || false} onChange={handleReminderToggle} />
        </Row>
        <div style={{
          padding: '0 20px 14px',
          fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13,
          color: 'var(--ink-soft)', lineHeight: 1.5,
        }}>
          {tweaks.reminderEnabled
            ? 'You\'ll get a notification between 6–12am when no outfit is logged for the day.'
            : 'Enable to get a morning nudge when you haven\'t logged an outfit yet.'}
        </div>
      </Section>

      {/* Footer */}
      <div style={{
        padding: '0 20px', textAlign: 'center',
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.2em',
        color: 'var(--ink-mute)', textTransform: 'uppercase',
      }}>
        The Closet · № 042 · Spring Edition
      </div>
    </div>
  );
}
