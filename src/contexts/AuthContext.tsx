"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@/types/user";
import { getHomePathForEmail } from "@/lib/monitor";
import {
  AuthResult,
  checkIsMonitor,
  getCurrentUser,
  login as serviceLogin,
  logout as serviceLogout,
  register as serviceRegister,
} from "@/services/auth";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMonitor: boolean;
  /** Autentica usuário existente. Redireciona conforme o papel do usuário. */
  login: (email: string, password: string) => Promise<AuthResult>;
  /** Cria conta e inicia sessão. Redireciona conforme o papel do usuário. */
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMonitor, setIsMonitor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const syncMonitorFlag = useCallback(async (profile: User | null) => {
    if (!profile) {
      setIsMonitor(false);
      return;
    }
    setIsMonitor(await checkIsMonitor(profile.email));
  }, []);

  useEffect(() => {
    // Carrega usuário da sessão ativa ao montar
    getCurrentUser().then(async (u) => {
      setUser(u);
      await syncMonitorFlag(u);
      setIsLoading(false);
    });

    // Escuta mudanças de sessão em tempo real (login em outra aba, expiração, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          setUser(null);
          return;
        }

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          const profile = await getCurrentUser();
          setUser(profile);
          await syncMonitorFlag(profile);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [syncMonitorFlag]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const result = await serviceLogin(email, password);
      if (result.ok) {
        setUser(result.user);
        const monitor = await checkIsMonitor(result.user.email);
        setIsMonitor(monitor);
        router.push(getHomePathForEmail(email));
      }
      return result;
    },
    [router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      const result = await serviceRegister(name, email, password);
      if (result.ok) {
        setUser(result.user);
        const monitor = await checkIsMonitor(result.user.email);
        setIsMonitor(monitor);
        router.push(getHomePathForEmail(email));
      }
      return result;
    },
    [router]
  );

  const logout = useCallback(async () => {
    await serviceLogout();
    setUser(null);
    setIsMonitor(false);
    router.push("/login");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      isMonitor,
      login,
      register,
      logout,
    }),
    [user, isLoading, isMonitor, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
