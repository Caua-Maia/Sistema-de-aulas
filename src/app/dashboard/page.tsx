"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SprintCard } from "@/components/sprint/SprintCard";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sprints } from "@/data/mock";
import { getLevelProgress, XP_PER_LESSON } from "@/lib/progress";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    completedCount,
    totalLessons,
    overallPercentage,
    getSprintProgress,
    getNextLesson,
    xp,
    level,
    allComplete,
    isLoaded,
  } = useProgress();

  const nextIncomplete = getNextLesson();
  const levelProgress = getLevelProgress(xp);
  const displayName = user?.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
    : "aluno";

  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-primary border-t-brand-secondary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <Badge variant="secondary" className="mb-3">
            <Zap className="h-3 w-3" />
            Bora codar!
          </Badge>
          <h1 className="text-2xl md:text-4xl font-extrabold text-brand-text">
            Olá, {displayName}! 👋
          </h1>
          <p className="mt-2 text-brand-text-muted text-lg">
            Continue sua jornada. Cada aula te deixa mais perto do objetivo.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="stat-card group">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                Aulas concluídas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-success/10 transition-transform group-hover:scale-105">
                  <CheckCircle2 className="h-7 w-7 text-brand-success" />
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-brand-text tabular-nums">
                    {completedCount}
                    <span className="text-xl font-normal text-brand-text-muted">
                      /{totalLessons}
                    </span>
                  </p>
                  <p className="text-sm text-brand-text-muted font-medium">
                    aulas finalizadas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card group border-brand-primary/20 bg-gradient-to-b from-brand-primary/5 to-brand-card">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                XP & Nível
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 transition-transform group-hover:scale-105">
                  <Star className="h-7 w-7 text-brand-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-4xl font-extrabold text-brand-primary tabular-nums">
                    {xp}
                    <span className="text-sm font-semibold text-brand-text-muted ml-1">
                      XP
                    </span>
                  </p>
                  <p className="text-sm text-brand-text-muted font-medium">
                    Nível {level} · {levelProgress.xpInLevel}/
                    {levelProgress.xpForNextLevel} XP
                  </p>
                  <p className="text-xs text-brand-text-muted mt-0.5">
                    +{XP_PER_LESSON} XP por aula
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                Progresso geral
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <ProgressBar value={overallPercentage} showLabel size="lg" />
            </CardContent>
          </Card>
        </div>

        {/* CTA card */}
        {allComplete ? (
          <Card className="overflow-hidden border-brand-success/30 bg-gradient-to-r from-brand-success/10 via-brand-card to-brand-secondary/5">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-success text-white shadow-[0_0_16px_rgba(34,197,94,0.35)]">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-brand-text text-lg flex items-center gap-2">
                    Parabéns, {displayName}!
                    <Sparkles className="h-5 w-5 text-brand-secondary" />
                  </p>
                  <p className="text-sm text-brand-text-muted">
                    Você concluiu todas as {totalLessons} aulas da trilha.
                    Continue revisando para fixar o conteúdo!
                  </p>
                </div>
              </div>
              <Button asChild variant="secondary">
                <Link href="/progresso">
                  Ver progresso
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          nextIncomplete && (
            <Card className="overflow-hidden border-brand-primary/20 bg-gradient-to-r from-brand-primary/5 via-brand-card to-brand-secondary/5 shadow-glow">
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-glow">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-text text-lg">
                      Continue estudando
                    </p>
                    <p className="text-sm text-brand-text-muted">
                      Sprint {nextIncomplete.sprint.number}:{" "}
                      {nextIncomplete.lesson.title}
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link
                    href={`/sprints/${nextIncomplete.sprint.id}/aulas/${nextIncomplete.lesson.id}`}
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        )}

        {/* Sprints */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="h-5 w-5 text-brand-primary" />
            <h2 className="text-xl font-bold text-brand-text">Suas Sprints</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                progress={getSprintProgress(sprint.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
