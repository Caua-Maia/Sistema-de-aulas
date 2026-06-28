"use client";

import { notFound } from "next/navigation";
import { ListVideo } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { LessonCard } from "@/components/lesson/LessonCard";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { getSprintById } from "@/data/mock";
import { useProgress } from "@/hooks/useProgress";

interface SprintDetailPageProps {
  params: { sprintId: string };
}

export default function SprintDetailPage({ params }: SprintDetailPageProps) {
  const sprint = getSprintById(params.sprintId);
  const { getSprintProgress, isLessonCompleted, isLoaded } = useProgress();

  if (!sprint) {
    notFound();
  }

  const progress = getSprintProgress(sprint.id);

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
            Sprint {sprint.number}
          </Badge>
          <h1 className="text-2xl md:text-4xl font-extrabold text-brand-text">
            {sprint.title}
          </h1>
          <p className="mt-3 text-brand-text-muted text-lg leading-relaxed">
            {sprint.description}
          </p>
        </div>

        <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-card">
          <ProgressBar value={progress.percentage} showLabel size="lg" />
          <p className="mt-2 text-sm font-medium text-brand-text-muted">
            {progress.completedLessons} de {progress.totalLessons} aulas
            concluídas
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-5">
            <ListVideo className="h-5 w-5 text-brand-primary" />
            <h2 className="text-xl font-bold text-brand-text">Aulas</h2>
          </div>
          <div className="space-y-4">
            {sprint.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                sprintId={sprint.id}
                isCompleted={isLessonCompleted(lesson.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
