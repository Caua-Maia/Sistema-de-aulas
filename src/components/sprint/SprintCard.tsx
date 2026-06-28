import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle, Zap } from "lucide-react";
import { Sprint } from "@/types";
import { SprintProgress } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/progress/ProgressBar";
import { Button } from "@/components/ui/button";

interface SprintCardProps {
  sprint: Sprint;
  progress: SprintProgress;
  showLink?: boolean;
}

const statusConfig = {
  "nao-iniciada": {
    label: "Não iniciada",
    variant: "muted" as const,
    icon: Circle,
  },
  "em-andamento": {
    label: "Em andamento",
    variant: "secondary" as const,
    icon: Zap,
  },
  concluida: {
    label: "Concluída",
    variant: "success" as const,
    icon: CheckCircle2,
  },
};

export function SprintCard({
  sprint,
  progress,
  showLink = true,
}: SprintCardProps) {
  const status = statusConfig[progress.status];
  const StatusIcon = status.icon;

  return (
    <Card className="interactive-card group overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white font-bold text-sm shadow-glow transition-transform duration-300 group-hover:scale-105">
              {sprint.number}
            </div>
            <div>
              <CardTitle className="text-base">{sprint.title}</CardTitle>
              <CardDescription className="mt-1">
                {sprint.lessons.length} aulas
              </CardDescription>
            </div>
          </div>
          <Badge variant={status.variant} className="shrink-0">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-brand-text-muted leading-relaxed">
          {sprint.description}
        </p>
        <ProgressBar value={progress.percentage} showLabel />
        {showLink && (
          <Button
            asChild
            variant={
              progress.status === "nao-iniciada" ? "default" : "outline"
            }
            className="w-full"
          >
            <Link href={`/sprints/${sprint.id}`}>
              {progress.status === "nao-iniciada" ? (
                <>
                  <PlayCircle className="h-4 w-4" />
                  Começar sprint
                </>
              ) : progress.status === "concluida" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Revisar sprint
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Continuar sprint
                </>
              )}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
