"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SprintCard } from "@/components/sprint/SprintCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { sprints } from "@/data/mock";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    getSprintProgress,
    getNextLesson,
    getPendingChallenges,
    allComplete,
    totalLessons,
    isLoaded,
  } = useProgress();

  const nextIncomplete = getNextLesson();
  const pendingChallenges = getPendingChallenges();
  const displayName = user?.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
    : "aluno";

  // Sprint em andamento (primeiro com status em-andamento, depois nao-iniciada)
  const currentSprint = sprints.find(
    (s) => getSprintProgress(s.id).status === "em-andamento"
  ) ?? sprints.find((s) => getSprintProgress(s.id).status === "nao-iniciada");

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

        {/* Continue estudando / Parabéns */}
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
                  </p>
                </div>
              </div>
              <Button asChild variant="secondary">
                <Link href="/perfil">
                  Ver perfil
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

        {/* Pendências de desafio */}
        {pendingChallenges.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-brand-secondary" />
              <h2 className="text-lg font-bold text-brand-text">
                Desafios pendentes
              </h2>
              <Badge variant="secondary" className="text-xs">
                {pendingChallenges.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {pendingChallenges.slice(0, 5).map((item) => (
                <Card
                  key={item.lessonId}
                  className="border-brand-secondary/20 bg-gradient-to-r from-brand-secondary/5 to-brand-card"
                >
                  <CardContent className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/15 text-brand-secondary">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-brand-text truncate">
                          {item.lessonTitle}
                        </p>
                        <p className="text-xs text-brand-text-muted">
                          Sprint {item.sprintNumber}
                        </p>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="shrink-0">
                      <Link
                        href={`/sprints/${item.sprintId}/aulas/${item.lessonId}`}
                      >
                        Enviar desafio
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Sprint atual */}
        {currentSprint && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-brand-primary" />
              <h2 className="text-lg font-bold text-brand-text">Sprint atual</h2>
            </div>
            <SprintCard
              sprint={currentSprint}
              progress={getSprintProgress(currentSprint.id)}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
