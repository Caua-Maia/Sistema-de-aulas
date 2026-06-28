"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Sparkles } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";
import { MOCK_CREDENTIALS } from "@/lib/auth";

export default function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-primary border-t-brand-secondary" />
      </div>
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const success = login(email.trim(), password);
    if (!success) {
      setError("Email ou senha incorretos. Tente novamente.");
    }
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center px-4">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2.5 text-brand-text hover:opacity-80 transition-opacity group"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-glow transition-transform group-hover:scale-105">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-lg">Ford Enter</span>
      </Link>

      <Card className="w-full max-w-md shadow-card-hover border-slate-200/80 animate-slide-up">
        <CardHeader className="text-center">
          <Badge variant="secondary" className="mx-auto mb-3">
            <Sparkles className="h-3 w-3" />
            Área do aluno
          </Badge>
          <CardTitle className="text-2xl">Entrar na plataforma</CardTitle>
          <CardDescription className="text-base">
            Use suas credenciais para acessar a trilha de apoio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                required
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <Button type="submit" variant="accent" className="w-full" size="lg">
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl py-3 px-4">
            Demo: {MOCK_CREDENTIALS.email} / {MOCK_CREDENTIALS.password}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
