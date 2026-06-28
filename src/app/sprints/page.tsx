"use client";

import { Layers } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SprintCard } from "@/components/sprint/SprintCard";
import { Badge } from "@/components/ui/badge";
import { sprints } from "@/data/mock";
import { useProgress } from "@/hooks/useProgress";

export default function SprintsPage() {
  const { getSprintProgress, isLoaded } = useProgress();

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
          <Badge variant="default" className="mb-3">
            <Layers className="h-3 w-3" />
            {sprints.length} sprints
          </Badge>
          <h1 className="text-2xl md:text-4xl font-extrabold text-brand-text">
            Sprints
          </h1>
          <p className="mt-2 text-slate-600 text-lg">
            Explore todas as sprints da trilha. Cada uma tem videoaulas e
            desafios práticos.
          </p>
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
    </AppLayout>
  );
}
