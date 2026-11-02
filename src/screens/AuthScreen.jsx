import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Icon } from '../components/ui.jsx';

function getStoredDark() {
  try {
    return JSON.parse(localStorage.getItem('closet:tweaks') || '{}').dark === true;
  } catch { return false; }
}

const Field = ({ label, type, value, onChange, placeholder }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{
      fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.16em',
      textTransform: 'uppercase', color: 'var(--ink-mute)', marginBottom: 6,
    }}>{label}</div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={type === 'email' ? 'email' : type === 'password' ? 'current-password' : 'off'}
      style={{
        width: '100%', padding: '10px 0',
        fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18,
        color: 'var(--ink)', borderBottom: '0.5px solid var(--line)',
        background: 'transparent',
      }}
    />
  </div>
);

export default function AuthScreen() {
  const { login, register, resetPassword, skipAuth } = useAuth();
  const isDark = getStoredDark();

  const [mode, setMode]       = useState('login');   // 'login' | 'register' | 'reset'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) { setError(error.message); }
        else { setSuccess('Password reset link sent — check your inbox.'); }
        return;
      }
      const { error } = mode === 'login'
        ? await login(email, password)
        : await register(email, password);
      if (error) {
        setError(
          error.message === 'Invalid login credentials'
            ? 'Wrong email or password.'
            : error.message,
        );
      } else if (mode === 'register') {
        setSuccess('Account created! Check your email to confirm.');
      }
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Reset password';
  const btnLabel = mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Send reset link';

  return (
    <div className={isDark ? 'app-root dark' : 'app-root'}>
      <div style={{
        background: 'var(--bg)', color: 'var(--ink)',
        minHeight: '100dvh', fontFamily: 'var(--sans)',
        display: 'flex', flexDirection: 'column',
        padding: 'max(24px, env(safe-area-inset-top)) 28px max(32px, env(safe-area-inset-bottom))',
      }}>
        {/* Wordmark */}
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.3em',
          color: 'var(--ink-soft)', textTransform: 'uppercase',
        }}>The Closet · est. 2026</div>

        {/* Hero */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 340 }}>
          <div className="h-display" style={{ fontSize: 52, color: 'var(--ink)', marginBottom: 10 }}>
            {mode === 'login' && <>Your<br /><em style={{ color: 'var(--accent)' }}>wardrobe</em>,<br />online.</>}
            {mode === 'register' && <>Start<br />your<br /><em style={{ color: 'var(--accent)' }}>closet</em>.</>}
            {mode === 'reset' && <>Reset<br /><em style={{ color: 'var(--accent)' }}>password</em>.</>}
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />

            {mode !== 'reset' && (
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
              />
            )}

            {/* Error / success */}
            {error && (
              <div style={{
                marginBottom: 16, padding: '10px 14px',
                background: 'rgba(182,41,30,0.08)', borderRadius: 6,
                fontFamily: 'var(--sans)', fontSize: 13,
                color: 'var(--accent)', lineHeight: 1.4,
              }}>{error}</div>
            )}
            {success && (
              <div style={{
                marginBottom: 16, padding: '10px 14px',
                background: 'rgba(0,0,0,0.04)', borderRadius: 6,
                fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14,
                color: 'var(--ink-soft)', lineHeight: 1.5,
              }}>{success}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="press"
              style={{
                width: '100%', padding: 16,
                background: 'var(--ink)', color: 'var(--bg)',
                borderRadius: 100,
                fontFamily: 'var(--mono)', fontSize: 11,
                letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Loading…' : btnLabel}
              {!loading && <Icon name="arrowR" size={13} stroke="var(--bg)" sw={1.6} />}
            </button>
          </form>

          {/* Mode toggles */}
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mode === 'login' && (
              <>
                <button
                  onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                  style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-soft)', textAlign: 'left', padding: 0 }}
                >
                  New here? <span style={{ color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Create an account</span>
                </button>
                <button
                  onClick={() => { setMode('reset'); setError(''); setSuccess(''); }}
                  style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-mute)', textAlign: 'left', padding: 0 }}
                >
                  Forgot password?
                </button>
              </>
            )}
            {mode === 'register' && (
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-soft)', textAlign: 'left', padding: 0 }}
              >
                Already have an account? <span style={{ color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>Sign in</span>
              </button>
            )}
            {mode === 'reset' && (
              <button
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-soft)', textAlign: 'left', padding: 0 }}
              >
                ← Back to sign in
              </button>
            )}
            <button
              onClick={skipAuth}
              style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)', textAlign: 'left', padding: 0, marginTop: 6 }}
            >
              Skip login →
            </button>
          </div>
        </div>

        <div style={{
          fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.2em',
          color: 'var(--ink-mute)', textTransform: 'uppercase', textAlign: 'center',
        }}>
          № 042 · Spring Edition
        </div>
      </div>
    </div>
  );
}
