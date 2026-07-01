"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login, isLoading, isAuthenticated, isMonitor } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(isMonitor ? "/monitor" : "/dashboard");
    }
  }, [isLoading, isAuthenticated, isMonitor, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-primary border-t-brand-secondary" />
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await login(email.trim(), password);

    if (!result.ok) {
      setError(result.error ?? "Erro ao entrar. Tente novamente.");
      setSubmitting(false);
    }
    // Em caso de sucesso, o AuthContext já redireciona para /dashboard
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle variant="header" />
      </div>

      <Link
        href="/"
        className="mb-8 flex items-center gap-2.5 text-brand-text hover:opacity-80 transition-opacity group"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-glow transition-transform group-hover:scale-105">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-lg">Ford Enter</span>
      </Link>

      <Card className="w-full max-w-md shadow-card-hover animate-slide-up">
        <CardHeader className="text-center">
          <Badge variant="secondary" className="mx-auto mb-3">
            <Sparkles className="h-3 w-3" />
            Área do aluno
          </Badge>
          <CardTitle className="text-2xl">Entrar na plataforma</CardTitle>
          <CardDescription className="text-base">
            Bem-vindo de volta! Entre com seu e-mail e senha.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 rounded-xl px-4 py-3">
                <p>{error}</p>
                {error.includes("Conta não encontrada") && (
                  <Link
                    href="/cadastro"
                    className="mt-1.5 inline-flex items-center gap-1.5 font-semibold text-brand-primary hover:underline"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Criar conta agora
                  </Link>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={submitting}
            >
              {submitting ? "Entrando…" : "Entrar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-text-muted">
            Ainda não tem conta?{" "}
            <Link
              href="/cadastro"
              className="font-semibold text-brand-primary hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
