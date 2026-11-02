import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

const GUEST_KEY = 'closet:guest';
const GUEST_USER = { id: 'guest-local', email: 'guest@local', isGuest: true };

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(GUEST_KEY) === '1') {
      setUser(GUEST_USER);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login    = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const register = (email, password) => supabase.auth.signUp({ email, password });
  const logout   = () => {
    if (user?.isGuest) {
      localStorage.removeItem(GUEST_KEY);
      setUser(null);
      return Promise.resolve({ error: null });
    }
    return supabase.auth.signOut();
  };

  const skipAuth = () => {
    localStorage.setItem(GUEST_KEY, '1');
    setUser(GUEST_USER);
  };

  const resetPassword = (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, resetPassword, skipAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
