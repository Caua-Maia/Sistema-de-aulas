"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Rocket } from "lucide-react";
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

// ─── Validação client-side ─────────────────────────────────────────────────────

function validate(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): string | null {
  if (!name.trim()) return "O nome é obrigatório.";

  if (!email.trim()) return "O e-mail é obrigatório.";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Informe um e-mail válido.";

  if (password.length < 6)
    return "A senha deve ter pelo menos 6 caracteres.";

  if (password !== confirmPassword) return "As senhas não coincidem.";

  return null;
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function CadastroPage() {
  const { register, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const validationError = validate(name, email, password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    const result = await register(name.trim(), email.trim(), password);

    if (!result.ok) {
      setError(result.error ?? "Erro ao criar conta. Tente novamente.");
      setSubmitting(false);
    }
    // Em caso de sucesso, o AuthContext já redireciona para /dashboard
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center px-4 py-8">
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
          <Badge variant="default" className="mx-auto mb-3">
            <Rocket className="h-3 w-3" />
            Novo por aqui?
          </Badge>
          <CardTitle className="text-2xl">Criar conta</CardTitle>
          <CardDescription className="text-base">
            Preencha os dados abaixo para começar sua trilha de aprendizado.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

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
                placeholder="mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="repita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={submitting}
            >
              {submitting ? "Criando conta…" : "Criar conta"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-brand-text-muted">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-primary hover:underline"
            >
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
