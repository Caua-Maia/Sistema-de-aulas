"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Eye,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { MonitorLayout } from "@/components/monitor/MonitorLayout";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLevelProgress } from "@/lib/progress";
import { getStudentDetails, StudentDetail } from "@/services/monitor";

interface Props {
  params: { userId: string };
}

export default function StudentDetailPage({ params }: Props) {
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStudentDetails(params.userId)
      .then((data) => {
        if (!data) setError("Aluno não encontrado.");
        else setStudent(data);
      })
      .catch((e) => {
        console.error(e);
        setError("Falha ao carregar dados do aluno.");
      })
      .finally(() => setLoading(false));
  }, [params.userId]);

  return (
    <MonitorLayout>
      <div className="space-y-8">
        <Link
          href="/monitor"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para visão geral
        </Link>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-primary border-t-brand-secondary" />
          </div>
        )}

        {error && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="pt-6 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-500 font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        {student && <StudentContent student={student} />}
      </div>
    </MonitorLayout>
  );
}

function StudentContent({ student }: { student: StudentDetail }) {
  const levelProgress = getLevelProgress(student.xp);

  return (
    <>
      {/* Header */}
      <div className="flex items-start gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-primary/15 text-brand-primary font-extrabold text-2xl uppercase select-none">
          {student.profile.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-text capitalize truncate">
            {student.profile.name}
          </h1>
          <p className="text-brand-text-muted text-sm mt-0.5">
            {student.profile.email}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="default">
              <Star className="h-3 w-3" />
              Nível {student.level}
            </Badge>
            <Badge variant="secondary">
              <Zap className="h-3 w-3" />
              {student.xp} XP
            </Badge>
            <Badge variant="muted" className="text-xs">
              Desde{" "}
              {new Date(student.profile.created_at).toLocaleDateString("pt-BR")}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="stat-card text-center border-brand-primary/20 bg-gradient-to-b from-brand-primary/5 to-brand-card">
          <CardHeader className="p-0 pb-1">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
              Aulas assistidas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-3xl font-extrabold text-brand-primary tabular-nums">
              {student.watchedCount}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card text-center border-brand-success/20 bg-gradient-to-b from-brand-success/5 to-brand-card">
          <CardHeader className="p-0 pb-1">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
              Desafios enviados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-3xl font-extrabold text-brand-success tabular-nums">
              {student.challengesCompleted}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card text-center border-brand-secondary/20 bg-gradient-to-b from-brand-secondary/5 to-brand-card">
          <CardHeader className="p-0 pb-1">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
              Desafios pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-3xl font-extrabold text-brand-secondary tabular-nums">
              {student.pendingChallengesCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* XP / nível */}
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-brand-primary" />
            Nível {student.level} — {levelProgress.xpInLevel}/
            {levelProgress.xpForNextLevel} XP neste nível
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={Math.round(
              (levelProgress.xpInLevel / levelProgress.xpForNextLevel) * 100
            )}
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
            <TrendingUp className="h-5 w-5 text-brand-success" />
            Progresso geral — {student.overallProgress}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar value={student.overallProgress} showLabel size="lg" />
        </CardContent>
      </Card>

      {/* Progresso por sprint */}
      <div>
        <h2 className="text-xl font-bold text-brand-text mb-4">
          Progresso por Sprint
        </h2>
        <div className="space-y-3">
          {student.sprintProgress.map((sp) => (
            <Card key={sp.sprintId} className="interactive-card">
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <p className="font-bold text-brand-text">
                      Sprint {sp.sprintNumber}: {sp.sprintTitle}
                    </p>
                    <p className="text-sm text-brand-text-muted mt-0.5">
                      {sp.completedLessons}/{sp.totalLessons} aulas concluídas
                    </p>
                  </div>
                  <Badge
                    variant={
                      sp.percentage >= 100
                        ? "success"
                        : sp.percentage > 0
                          ? "secondary"
                          : "muted"
                    }
                    className="text-sm px-3 py-1 shrink-0"
                  >
                    {sp.percentage}%
                  </Badge>
                </div>
                <ProgressBar value={sp.percentage} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Desafios pendentes */}
      {student.pendingChallengesList.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-brand-secondary" />
            <h2 className="text-xl font-bold text-brand-text">
              Desafios pendentes
            </h2>
            <Badge variant="secondary" className="text-xs">
              {student.pendingChallengesList.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {student.pendingChallengesList.map((l) => (
              <Card
                key={l.lessonId}
                className="border-brand-secondary/20 bg-gradient-to-r from-brand-secondary/5 to-brand-card"
              >
                <CardContent className="flex items-center gap-3 py-4">
                  <AlertCircle className="h-4 w-4 text-brand-secondary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-brand-text truncate">
                      {l.lessonTitle}
                    </p>
                    <p className="text-xs text-brand-text-muted">
                      Sprint {l.sprintNumber} · Aula {l.lessonOrder}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Aulas assistidas */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-brand-primary" />
          <h2 className="text-xl font-bold text-brand-text">Aulas assistidas</h2>
          <Badge variant="muted" className="text-xs">
            {student.watchedLessons.length}
          </Badge>
        </div>

        {student.watchedLessons.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-10 w-10 text-brand-text-muted/30 mx-auto mb-3" />
              <p className="text-brand-text-muted font-medium">
                Nenhuma aula assistida ainda.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {student.watchedLessons.map((l) => (
              <Card key={l.lessonId} className="interactive-card">
                <CardContent className="pt-5 pb-4 space-y-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-brand-text">
                          {l.lessonTitle}
                        </p>
                        {l.challengeCompleted ? (
                          <Badge variant="success" className="text-[10px]">
                            <CheckCircle2 className="h-3 w-3" />
                            Desafio enviado
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            <AlertCircle className="h-3 w-3" />
                            Desafio pendente
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-brand-text-muted mt-0.5">
                        Sprint {l.sprintNumber} · Aula {l.lessonOrder}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-brand-text-muted shrink-0">
                      <Eye className="h-3.5 w-3.5" />
                      Assistida
                    </div>
                  </div>

                  {l.challengeCompleted && l.challengeAnswer && (
                    <div className="rounded-xl border border-brand-border bg-brand-bg p-3">
                      <p className="text-xs font-semibold text-brand-text-muted mb-1.5 uppercase tracking-wider">
                        Resposta do desafio
                      </p>
                      <p className="text-sm text-brand-text/90 font-mono whitespace-pre-wrap leading-relaxed">
                        {l.challengeAnswer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
