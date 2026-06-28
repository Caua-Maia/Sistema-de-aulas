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
import { User } from "@/types/user";
import {
  AuthResult,
  getCurrentUser,
  login as serviceLogin,
  register as serviceRegister,
  logout as serviceLogout,
} from "@/services/auth";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Autentica usuário existente. Redireciona para /dashboard em caso de sucesso. */
  login: (email: string, password: string) => AuthResult;
  /** Cria conta e inicia sessão. Redireciona para /dashboard em caso de sucesso. */
  register: (name: string, email: string, password: string) => AuthResult;
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
    setUser(getCurrentUser());
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (email: string, password: string): AuthResult => {
      const result = serviceLogin(email, password);
      if (result.ok) {
        setUser(result.user);
        router.push("/dashboard");
      }
      return result;
    },
    [router]
  );

  const register = useCallback(
    (name: string, email: string, password: string): AuthResult => {
      const result = serviceRegister(name, email, password);
      if (result.ok) {
        setUser(result.user);
        router.push("/dashboard");
      }
      return result;
    },
    [router]
  );

  const logout = useCallback(() => {
    serviceLogout();
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
