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
  getCurrentUser,
  loginOrRegister,
  logout as serviceLogout,
} from "@/services/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  ok: boolean;
  isNew?: boolean;
  error?: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => LoginResponse;
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
    (email: string, password: string): LoginResponse => {
      const result = loginOrRegister(email, password);
      if (result.ok) {
        setUser(result.user);
        router.push("/dashboard");
        return { ok: true, isNew: result.isNew };
      }
      return { ok: false, error: result.error };
    },
    [router]
  );

  const logout = useCallback(() => {
    serviceLogout();
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, isAuthenticated: !!user, login, logout }),
    [user, isLoading, login, logout]
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
