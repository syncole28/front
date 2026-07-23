import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as api from '@/api/client';
import type { RegisterPayload, User } from '@/api/types';

interface AuthContextValue {
  user: User | null; loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>; refresh: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.getMe().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const value = useMemo<AuthContextValue>(() => ({
    user, loading,
    login: async (email, password) => setUser(await api.login(email, password)),
    register: async (payload) => setUser(await api.register(payload)),
    logout: async () => { await api.logout(); setUser(null); },
    refresh: async () => setUser(await api.getMe()),
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx; }
