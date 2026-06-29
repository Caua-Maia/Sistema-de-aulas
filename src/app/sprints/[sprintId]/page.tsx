"use client";

import { useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { ListVideo, Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { LessonCard } from "@/components/lesson/LessonCard";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getSprintById } from "@/data/mock";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

interface SprintDetailPageProps {
  params: { sprintId: string };
}

type FilterType = "todas" | "concluidas" | "pendentes" | "desafio-pendente";

const filterLabels: { id: FilterType; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "concluidas", label: "Concluídas" },
  { id: "pendentes", label: "Pendentes" },
  { id: "desafio-pendente", label: "Desafio pendente" },
];

export default function SprintDetailPage({ params }: SprintDetailPageProps) {
  const sprint = getSprintById(params.sprintId);
  const { getSprintProgress, isLessonCompleted, isLessonWatched, isChallengeCompleted, isLoaded } =
    useProgress();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("todas");

  if (!sprint) notFound();

  const progress = getSprintProgress(sprint.id);

  const filteredLessons = useMemo(() => {
    const query = search.toLowerCase().trim();
    return sprint.lessons.filter((lesson) => {
      const watched = isLessonWatched(lesson.id);
      const challengeDone = isChallengeCompleted(lesson.id);
      const completed = isLessonCompleted(lesson.id);

      const matchesSearch =
        !query ||
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query);

      const matchesFilter =
        activeFilter === "todas" ||
        (activeFilter === "concluidas" && completed) ||
        (activeFilter === "pendentes" && !completed) ||
        (activeFilter === "desafio-pendente" && watched && !challengeDone);

      return matchesSearch && matchesFilter;
    });
  }, [sprint.lessons, search, activeFilter, isLessonCompleted, isLessonWatched, isChallengeCompleted]);

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
            Sprint {sprint.number}
          </Badge>
          <h1 className="text-2xl md:text-4xl font-extrabold text-brand-text">
            {sprint.title}
          </h1>
          <p className="mt-3 text-brand-text-muted text-lg leading-relaxed">
            {sprint.description}
          </p>
        </div>

        {/* Progress */}
        <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-card">
          <ProgressBar value={progress.percentage} showLabel size="lg" />
          <div className="mt-2 flex items-center gap-4 flex-wrap">
            <p className="text-sm font-medium text-brand-text-muted">
              {progress.completedLessons} de {progress.totalLessons} aulas concluídas
            </p>
            {progress.pendingChallenges > 0 && (
              <Badge variant="secondary" className="text-xs">
                {progress.pendingChallenges} desafio{progress.pendingChallenges > 1 ? "s" : ""} pendente{progress.pendingChallenges > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>

        {/* Search + Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-muted pointer-events-none" />
            <Input
              placeholder="Buscar aulas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {filterLabels.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-150 border",
                  activeFilter === id
                    ? "bg-brand-primary text-white border-brand-primary shadow-glow"
                    : "bg-brand-card text-brand-text-muted border-brand-border hover:border-brand-primary/40 hover:text-brand-text"
                )}
              >
                {label}
                {id === "desafio-pendente" && progress.pendingChallenges > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-white/20 px-1.5 text-xs">
                    {progress.pendingChallenges}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson list */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <ListVideo className="h-5 w-5 text-brand-primary" />
            <h2 className="text-xl font-bold text-brand-text">Aulas</h2>
            {filteredLessons.length !== sprint.lessons.length && (
              <Badge variant="muted" className="text-xs">
                {filteredLessons.length} resultado{filteredLessons.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {filteredLessons.length === 0 ? (
            <div className="rounded-2xl border border-brand-border bg-brand-card py-16 text-center">
              <p className="text-brand-text-muted font-medium">
                Nenhuma aula encontrada.
              </p>
              <p className="text-sm text-brand-text-muted mt-1">
                Tente outro filtro ou termo de busca.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  sprintId={sprint.id}
                  watched={isLessonWatched(lesson.id)}
                  challengeCompleted={isChallengeCompleted(lesson.id)}
                  completed={isLessonCompleted(lesson.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
