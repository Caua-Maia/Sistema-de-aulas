"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

/** Hook principal de autenticação — usa o AuthContext global. */
export function useAuth() {
  return useAuthContext();
}

/** Redireciona para /login se não estiver autenticado. Usado no AppLayout. */
export function useRequireAuth() {
  const auth = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  return auth;
}
