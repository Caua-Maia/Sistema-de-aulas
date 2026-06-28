"use client";

import { BarChart3, Trophy } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sprints } from "@/data/mock";
import { useProgress } from "@/hooks/useProgress";

export default function ProgressoPage() {
  const {
    totalLessons,
    completedCount,
    overallPercentage,
    getSprintProgress,
    isLoaded,
  } = useProgress();

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
        <div>
          <Badge variant="default" className="mb-3">
            <BarChart3 className="h-3 w-3" />
            Estatísticas
          </Badge>
          <h1 className="text-2xl md:text-4xl font-extrabold text-brand-text">
            Seu Progresso
          </h1>
          <p className="mt-2 text-slate-600 text-lg">
            Acompanhe sua evolução. Cada aula concluída é XP na conta!
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="stat-card text-center">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total de aulas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-4xl font-extrabold text-brand-text tabular-nums">
                {totalLessons}
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card text-center border-brand-success/20 bg-gradient-to-b from-green-50/50 to-white">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Aulas concluídas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-4xl font-extrabold text-brand-success tabular-nums">
                {completedCount}
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card text-center border-brand-primary/20 bg-gradient-to-b from-blue-50/50 to-white">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Percentual geral
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-4xl font-extrabold text-brand-primary tabular-nums">
                {overallPercentage}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-brand-accent" />
              Progresso geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar value={overallPercentage} showLabel size="lg" />
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-bold text-brand-text mb-5">
            Progresso por Sprint
          </h2>
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
                        <p className="text-sm text-slate-500 font-medium mt-0.5">
                          {progress.completedLessons}/{progress.totalLessons}{" "}
                          aulas concluídas
                        </p>
                      </div>
                      <Badge
                        variant={
                          progress.status === "concluida"
                            ? "success"
                            : progress.status === "em-andamento"
                              ? "secondary"
                              : "muted"
                        }
                        className="text-sm px-3 py-1"
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
