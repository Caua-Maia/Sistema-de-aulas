"use client";

import { BarChart3, CheckCircle2, Star, Trophy, User, Zap } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sprints } from "@/data/mock";
import { getLevelProgress, XP_PER_LESSON } from "@/lib/progress";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";

export default function PerfilPage() {
  const { user } = useAuth();
  const {
    totalLessons,
    completedCount,
    watchedCount,
    overallPercentage,
    getSprintProgress,
    xp,
    level,
    isLoaded,
  } = useProgress();

  const levelProgress = getLevelProgress(xp);
  const displayName = user?.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
    : "Aluno";

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
          <Badge variant="default" className="mb-3">
            <User className="h-3 w-3" />
            Perfil
          </Badge>
          <h1 className="text-2xl md:text-4xl font-extrabold text-brand-text">
            {displayName}
          </h1>
          <p className="mt-2 text-brand-text-muted text-lg">
            Acompanhe sua evolução e conquistas na trilha.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="stat-card text-center">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                Total de aulas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-4xl font-extrabold text-brand-text tabular-nums">
                {totalLessons}
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card text-center border-brand-success/20 bg-gradient-to-b from-brand-success/5 to-brand-card">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                Aulas concluídas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col items-center">
                <p className="text-4xl font-extrabold text-brand-success tabular-nums">
                  {completedCount}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-success" />
                  <p className="text-xs text-brand-text-muted">
                    {watchedCount} assistidas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card text-center border-brand-primary/20 bg-gradient-to-b from-brand-primary/5 to-brand-card">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                XP total
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col items-center">
                <p className="text-4xl font-extrabold text-brand-primary tabular-nums">
                  {xp}
                </p>
                <p className="text-xs text-brand-text-muted mt-1">
                  +{XP_PER_LESSON} XP por aula completa
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card text-center border-brand-secondary/20 bg-gradient-to-b from-brand-secondary/5 to-brand-card">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                Nível
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-center gap-2">
                <Star className="h-6 w-6 text-brand-secondary" />
                <p className="text-4xl font-extrabold text-brand-text tabular-nums">
                  {level}
                </p>
              </div>
              <p className="text-xs text-brand-text-muted mt-2">
                {levelProgress.xpInLevel}/{levelProgress.xpForNextLevel} XP neste nível
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Nível progress bar */}
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-brand-primary" />
              Nível {level} — {levelProgress.xpInLevel}/{levelProgress.xpForNextLevel} XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar
              value={Math.round((levelProgress.xpInLevel / levelProgress.xpForNextLevel) * 100)}
              showLabel
              size="lg"
            />
          </CardContent>
        </Card>

        {/* Progresso geral */}
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-brand-success/80 to-brand-success" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-brand-success" />
              Progresso geral — {overallPercentage}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar value={overallPercentage} showLabel size="lg" />
            <p className="mt-2 text-sm text-brand-text-muted">
              {completedCount} de {totalLessons} aulas totalmente concluídas (assistida + desafio enviado)
            </p>
          </CardContent>
        </Card>

        {/* Histórico por sprint */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="h-5 w-5 text-brand-primary" />
            <h2 className="text-xl font-bold text-brand-text">
              Histórico por Sprint
            </h2>
          </div>
          <div className="space-y-4">
            {sprints.map((sprint) => {
              const progress = getSprintProgress(sprint.id);
              return (
                <Card key={sprint.id} className="interactive-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-bold text-brand-text">
                          Sprint {sprint.number}: {sprint.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <p className="text-sm text-brand-text-muted">
                            {progress.completedLessons}/{progress.totalLessons} concluídas
                          </p>
                          {progress.pendingChallenges > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {progress.pendingChallenges} desafio{progress.pendingChallenges > 1 ? "s" : ""} pendente{progress.pendingChallenges > 1 ? "s" : ""}
                            </Badge>
                          )}
                          <p className="text-sm text-brand-text-muted font-medium">
                            {progress.completedLessons * XP_PER_LESSON} XP
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          progress.status === "concluida"
                            ? "success"
                            : progress.status === "em-andamento"
                              ? "secondary"
                              : "muted"
                        }
                        className="text-sm px-3 py-1 shrink-0"
                      >
                        {progress.percentage}%
                      </Badge>
                    </div>
                    <ProgressBar value={progress.percentage} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
