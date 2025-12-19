/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch, setToken as persistToken, getToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    persistToken(token);
  }, [token]);

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      try {
        if (!token) {
          if (!cancelled) setUser(null);
          return;
        }
        const data = await apiFetch('/auth/me', { token });
        // Backend returns { success, message, data: { user } }
        if (!cancelled) setUser(data.data?.user || data.user);
      } catch {
        if (!cancelled) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    setLoading(true);
    loadMe();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthed: Boolean(token),
      // Admin role removed - simplified structure
      isAdmin: false,
      async login(email, password) {
        const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
        // Backend returns { success, message, data: { token, user } }
        setToken(data.data?.token || data.token);
        setUser(data.data?.user || data.user);
      },
      logout() {
        setUser(null);
        setToken(null);
      },
    }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
