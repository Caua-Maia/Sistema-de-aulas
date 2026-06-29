import Link from "next/link";
import { AlertCircle, CheckCircle2, Eye, Play } from "lucide-react";
import { Lesson } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LessonCardProps {
  lesson: Lesson;
  sprintId: string;
  watched: boolean;
  challengeCompleted: boolean;
  completed: boolean;
}

export function LessonCard({
  lesson,
  sprintId,
  watched,
  challengeCompleted,
  completed,
}: LessonCardProps) {
  const pendingChallenge = watched && !challengeCompleted;

  return (
    <Card
      className={cn(
        "interactive-card group",
        completed &&
          "border-brand-success/30 bg-gradient-to-r from-brand-success/5 to-brand-card",
        pendingChallenge &&
          "border-brand-secondary/25 bg-gradient-to-r from-brand-secondary/5 to-brand-card"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Order / status icon */}
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-transform duration-300 group-hover:scale-110",
              completed
                ? "bg-brand-success text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                : pendingChallenge
                  ? "bg-brand-secondary/20 text-brand-secondary"
                  : watched
                    ? "bg-brand-primary/15 text-brand-primary"
                    : "bg-brand-card-secondary text-brand-text-muted group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
            )}
          >
            {completed ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : pendingChallenge ? (
              <AlertCircle className="h-4 w-4" />
            ) : watched ? (
              <Eye className="h-4 w-4" />
            ) : (
              lesson.order
            )}
          </div>

          {/* Title + badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base">{lesson.title}</CardTitle>
              {completed && (
                <Badge variant="success" className="text-[10px]">
                  Concluída
                </Badge>
              )}
              {pendingChallenge && (
                <Badge variant="secondary" className="text-[10px]">
                  Desafio pendente
                </Badge>
              )}
              {watched && !completed && !pendingChallenge && (
                <Badge variant="muted" className="text-[10px]">
                  Assistida
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1">
              {lesson.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          asChild
          size="sm"
          variant={completed ? "outline" : pendingChallenge ? "secondary" : "default"}
        >
          <Link href={`/sprints/${sprintId}/aulas/${lesson.id}`}>
            <Play className="h-4 w-4" />
            {completed
              ? "Revisar aula"
              : pendingChallenge
                ? "Enviar desafio"
                : watched
                  ? "Continuar"
                  : "Assistir aula"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
