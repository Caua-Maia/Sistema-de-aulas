"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Flame, Target } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SprintCard } from "@/components/sprint/SprintCard";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sprints } from "@/data/mock";
import { useProgress } from "@/hooks/useProgress";

export default function DashboardPage() {
  const {
    completedCount,
    totalLessons,
    overallPercentage,
    getSprintProgress,
    isLessonCompleted,
    isLoaded,
  } = useProgress();

  const nextIncomplete = sprints
    .flatMap((s) => s.lessons.map((l) => ({ sprint: s, lesson: l })))
    .find(({ lesson }) => !isLessonCompleted(lesson.id));

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
          <Badge variant="secondary" className="mb-3">
            <Flame className="h-3 w-3" />
            Bora codar!
          </Badge>
          <h1 className="text-2xl md:text-4xl font-extrabold text-brand-text">
            Olá, aluno! 👋
          </h1>
          <p className="mt-2 text-slate-600 text-lg">
            Continue sua jornada. Cada aula te deixa mais perto do objetivo.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="stat-card group">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
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
                    <span className="text-xl font-normal text-slate-400">
                      /{totalLessons}
                    </span>
                  </p>
                  <p className="text-sm text-slate-500 font-medium">
                    aulas finalizadas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Progresso geral
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <ProgressBar value={overallPercentage} showLabel size="lg" />
            </CardContent>
          </Card>
        </div>

        {nextIncomplete && (
          <Card className="overflow-hidden border-brand-accent/20 bg-gradient-to-r from-orange-50/80 via-white to-cyan-50/50 shadow-accent-glow">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent text-white shadow-accent-glow">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-brand-text text-lg">
                    Continue estudando
                  </p>
                  <p className="text-sm text-slate-600">
                    Sprint {nextIncomplete.sprint.number}:{" "}
                    {nextIncomplete.lesson.title}
                  </p>
                </div>
              </div>
              <Button asChild variant="accent">
                <Link
                  href={`/sprints/${nextIncomplete.sprint.id}/aulas/${nextIncomplete.lesson.id}`}
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

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
