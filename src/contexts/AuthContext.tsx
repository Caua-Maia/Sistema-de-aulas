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
import {
  AuthResult,
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
  /** Autentica usuário existente. Redireciona para /dashboard em caso de sucesso. */
  login: (email: string, password: string) => Promise<AuthResult>;
  /** Cria conta e inicia sessão. Redireciona para /dashboard em caso de sucesso. */
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Carrega usuário da sessão ativa ao montar
    getCurrentUser().then((u) => {
      setUser(u);
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
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const result = await serviceLogin(email, password);
      if (result.ok) {
        setUser(result.user);
        router.push("/dashboard");
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
        router.push("/dashboard");
      }
      return result;
    },
    [router]
  );

  const logout = useCallback(async () => {
    await serviceLogout();
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, isAuthenticated: !!user, login, register, logout }),
    [user, isLoading, login, register, logout]
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
