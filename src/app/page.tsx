import Link from "next/link";
import { BookOpen, GraduationCap, Rocket, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const features = [
  {
    icon: BookOpen,
    title: "Aulas por Sprint",
    description:
      "Videoaulas curtas organizadas por sprint, do básico ao avançado. Estude no seu ritmo!",
    accent: "from-brand-primary/10 to-brand-primary/5",
    iconColor: "text-brand-primary",
  },
  {
    icon: Zap,
    title: "Desafios Práticos",
    description:
      "Cada aula traz um desafio para você praticar e fixar o conteúdo na hora.",
    accent: "from-brand-secondary/10 to-brand-secondary/5",
    iconColor: "text-brand-secondary",
  },
  {
    icon: TrendingUp,
    title: "Acompanhe seu Progresso",
    description:
      "Veja quantas aulas você já concluiu e mantenha a motivação para continuar.",
    accent: "from-brand-success/10 to-brand-success/5",
    iconColor: "text-brand-success",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-bg">
      <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-glow">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-brand-text">Ford Enter</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle variant="header" />
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/cadastro">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-28 text-center animate-slide-up">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
            <Rocket className="h-3.5 w-3.5" />
            Trilha de Apoio
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-text text-balance leading-tight">
            Ford Enter —{" "}
            <span className="gradient-text">Sua Trilha de Aprendizado</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-brand-text-muted max-w-2xl mx-auto text-balance leading-relaxed">
            Videoaulas rápidas, desafios práticos e progresso gamificado.
            Aprenda programação web do jeito que a galera de tech aprende.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/cadastro">
                <Zap className="h-5 w-5" />
                Começar agora
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Já tenho conta</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-24 md:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description, accent, iconColor }) => (
              <Card
                key={title}
                className="interactive-card text-center group"
              >
                <CardHeader>
                  <div
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className={`h-7 w-7 ${iconColor}`} />
                  </div>
                  <CardTitle className="mt-3">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-border bg-brand-card/60 backdrop-blur py-8 text-center text-sm text-brand-text-muted">
        Ford Enter — Trilha de Apoio · Projeto educacional
      </footer>
    </div>
  );
}
