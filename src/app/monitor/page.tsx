"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { MonitorLayout } from "@/components/monitor/MonitorLayout";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getMonitorOverview,
  getStudentsProgress,
  MonitorOverview,
  StudentSummary,
} from "@/services/monitor";

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-primary border-t-brand-secondary" />
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color = "primary",
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color?: "primary" | "success" | "secondary" | "warning";
}) {
  const colorMap = {
    primary: "bg-brand-primary/10 text-brand-primary",
    success: "bg-brand-success/10 text-brand-success",
    secondary: "bg-brand-secondary/10 text-brand-secondary",
    warning: "bg-amber-500/10 text-amber-500",
  };
  return (
    <Card className="stat-card">
      <CardContent className="p-0 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${colorMap[color]}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-2xl font-extrabold text-brand-text tabular-nums">
            {value}
          </p>
          <p className="text-xs font-medium text-brand-text-muted uppercase tracking-wider">
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MonitorPage() {
  const [overview, setOverview] = useState<MonitorOverview | null>(null);
  const [students, setStudents] = useState<StudentSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getMonitorOverview(), getStudentsProgress()])
      .then(([ov, st]) => {
        setOverview(ov);
        setStudents(st);
      })
      .catch((e) => {
        console.error(e);
        setError("Falha ao carregar dados. Verifique a conexão e tente novamente.");
      });
  }, []);

  return (
    <MonitorLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <Badge variant="default" className="mb-3">
            <TrendingUp className="h-3 w-3" />
            Monitor
          </Badge>
          <h1 className="text-2xl md:text-4xl font-extrabold text-brand-text">
            Visão Geral
          </h1>
          <p className="mt-2 text-brand-text-muted text-lg">
            Acompanhe o desempenho de todos os alunos em tempo real.
          </p>
        </div>

        {error && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="pt-6 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-500 font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        {!overview && !error && <Spinner />}

        {overview && (
          <>
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Alunos cadastrados"
                value={overview.totalStudents}
                icon={Users}
                color="primary"
              />
              <StatCard
                title="Aulas assistidas"
                value={overview.totalWatched}
                icon={BookOpen}
                color="secondary"
              />
              <StatCard
                title="Desafios enviados"
                value={overview.totalChallengesCompleted}
                icon={CheckCircle2}
                color="success"
              />
              <StatCard
                title="Desafios pendentes"
                value={overview.totalPendingChallenges}
                icon={AlertCircle}
                color="warning"
              />
              <Card className="stat-card sm:col-span-2">
                <CardContent className="p-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
                      Média de conclusão
                    </p>
                    <p className="text-2xl font-extrabold text-brand-primary tabular-nums">
                      {overview.averageProgress}%
                    </p>
                  </div>
                  <ProgressBar value={overview.averageProgress} size="lg" />
                </CardContent>
              </Card>
            </div>

            {/* Students */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Users className="h-5 w-5 text-brand-primary" />
                <h2 className="text-xl font-bold text-brand-text">Alunos</h2>
                {students && (
                  <Badge variant="muted" className="text-xs">
                    {students.length}
                  </Badge>
                )}
              </div>

              {!students && !error && <Spinner />}

              {students?.length === 0 && (
                <Card>
                  <CardContent className="py-16 text-center">
                    <p className="text-brand-text-muted font-medium">
                      Nenhum aluno cadastrado ainda.
                    </p>
                  </CardContent>
                </Card>
              )}

              {students && students.length > 0 && (
                <div className="space-y-3">
                  {students.map((s) => (
                    <Card
                      key={s.id}
                      className="interactive-card group overflow-hidden"
                    >
                      <CardContent className="pt-5 pb-4">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary font-bold text-sm uppercase select-none">
                            {s.name.charAt(0)}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div className="min-w-0">
                                <p className="font-semibold text-brand-text capitalize truncate">
                                  {s.name}
                                </p>
                                <p className="text-xs text-brand-text-muted truncate">
                                  {s.email}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap shrink-0">
                                <Badge variant="default" className="text-xs">
                                  <Star className="h-3 w-3" />
                                  Nível {s.level}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  <Zap className="h-3 w-3" />
                                  {s.xp} XP
                                </Badge>
                                {s.pendingChallenges > 0 && (
                                  <Badge variant="muted" className="text-xs">
                                    <AlertCircle className="h-3 w-3" />
                                    {s.pendingChallenges} pendente
                                    {s.pendingChallenges > 1 ? "s" : ""}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-brand-text-muted flex-wrap">
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3.5 w-3.5" />
                                {s.watchedCount} assistidas
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-brand-success" />
                                {s.challengesCompleted} desafios
                              </span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-brand-text-muted">
                                  Conclusão
                                </span>
                                <span className="font-bold text-brand-primary">
                                  {s.completionPercentage}%
                                </span>
                              </div>
                              <ProgressBar
                                value={s.completionPercentage}
                                size="sm"
                              />
                            </div>
                          </div>

                          {/* Arrow */}
                          <Link
                            href={`/monitor/alunos/${s.id}`}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-brand-text-muted hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
                            title="Ver detalhes"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MonitorLayout>
  );
}
