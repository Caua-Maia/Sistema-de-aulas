"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { VideoPlayer } from "@/components/lesson/VideoPlayer";
import { PracticeChallenge } from "@/components/lesson/PracticeChallenge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLessonById } from "@/data/mock";
import { useProgress } from "@/hooks/useProgress";

interface LessonPageProps {
  params: { sprintId: string; lessonId: string };
}

export default function LessonPage({ params }: LessonPageProps) {
  const data = getLessonById(params.sprintId, params.lessonId);
  const { isLessonCompleted, markLessonComplete, getNavigation, isLoaded } =
    useProgress();

  if (!data) {
    notFound();
  }

  const { sprint, lesson } = data;
  const completed = isLessonCompleted(lesson.id);
  const { prev: prevEntry, next: nextEntry } = getNavigation(lesson.id);

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
      <div className="space-y-6">
        <div>
          <Link
            href={`/sprints/${sprint.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-secondary transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Sprint {sprint.number}
          </Link>
        </div>

        <VideoPlayer title={lesson.title} videoUrl={lesson.videoUrl} />

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">Aula {lesson.order}</Badge>
            <Badge variant="muted">Sprint {sprint.number}</Badge>
            {completed && (
              <Badge variant="success">
                <CheckCircle2 className="h-3 w-3" />
                Concluída
              </Badge>
            )}
          </div>
          <h1 className="mt-3 text-2xl md:text-4xl font-extrabold text-brand-text">
            {lesson.title}
          </h1>
          <p className="mt-2 text-brand-text-muted text-lg">{lesson.description}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              📖 Conteúdo da aula
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-brand-text/90 whitespace-pre-line">
              {lesson.content}
            </p>
          </CardContent>
        </Card>

        <PracticeChallenge challenge={lesson.challenge} />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant={completed ? "outline" : "success"}
            onClick={() => markLessonComplete(lesson.id)}
            disabled={completed}
            className="flex-1 sm:flex-none"
            size="lg"
          >
            <CheckCircle2 className="h-5 w-5" />
            {completed ? "Aula concluída" : "Marcar como concluída"}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-brand-border">
          {prevEntry ? (
            <Button asChild variant="outline">
              <Link
                href={`/sprints/${prevEntry.sprint.id}/aulas/${prevEntry.lesson.id}`}
              >
                <ArrowLeft className="h-4 w-4" />
                Aula anterior
              </Link>
            </Button>
          ) : (
            <div />
          )}
          {nextEntry ? (
            <Button asChild>
              <Link
                href={`/sprints/${nextEntry.sprint.id}/aulas/${nextEntry.lesson.id}`}
              >
                Próxima aula
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="secondary">
              <Link href="/progresso">
                Trilha concluída
                <CheckCircle2 className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
