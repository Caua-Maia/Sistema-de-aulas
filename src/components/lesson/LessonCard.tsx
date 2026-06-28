import Link from "next/link";
import { CheckCircle2, Circle, Play } from "lucide-react";
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
  isCompleted: boolean;
}

export function LessonCard({ lesson, sprintId, isCompleted }: LessonCardProps) {
  return (
    <Card
      className={cn(
        "interactive-card group",
        isCompleted &&
          "border-brand-success/30 bg-gradient-to-r from-brand-success/5 to-brand-card"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-transform duration-300 group-hover:scale-110",
              isCompleted
                ? "bg-brand-success text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                : "bg-brand-card-secondary text-brand-text-muted group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
            )}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              lesson.order
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base">{lesson.title}</CardTitle>
              {isCompleted && (
                <Badge variant="success" className="text-[10px]">
                  Concluída
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1">
              {lesson.description}
            </CardDescription>
          </div>
          {!isCompleted && (
            <Circle className="h-5 w-5 shrink-0 text-brand-border group-hover:text-brand-secondary transition-colors" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Button
          asChild
          size="sm"
          variant={isCompleted ? "outline" : "default"}
        >
          <Link href={`/sprints/${sprintId}/aulas/${lesson.id}`}>
            <Play className="h-4 w-4" />
            {isCompleted ? "Revisar aula" : "Assistir aula"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
