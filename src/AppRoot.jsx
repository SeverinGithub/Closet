import React from 'react';
import { useAuth } from './contexts/AuthContext.jsx';
import { ClosetProvider } from './store.jsx';
import App from './App.jsx';
import AuthScreen from './screens/AuthScreen.jsx';

function Spinner() {
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: 'var(--ink-mute)',
      }}>
        Loading…
      </div>
    </div>
  );
}

export default function AppRoot() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user)   return <AuthScreen />;

  return (
    <ClosetProvider userId={user.id}>
      <App userEmail={user.email} />
    </ClosetProvider>
  );
}
