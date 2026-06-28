"use client";

import { useCallback, useEffect, useState } from "react";
import { sprints, getTotalLessonsCount } from "@/data/mock";
import { SprintProgress, SprintStatus } from "@/types";

const PROGRESS_STORAGE_KEY = "ford-enter-progress";

function loadProgress(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as string[];
  } catch {
    return [];
  }
}

function saveProgress(completed: string[]) {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(completed));
}

function getSprintStatus(completed: number, total: number): SprintStatus {
  if (completed === 0) return "nao-iniciada";
  if (completed >= total) return "concluida";
  return "em-andamento";
}

export function useProgress() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCompletedLessons(loadProgress());
    setIsLoaded(true);
  }, []);

  const isLessonCompleted = useCallback(
    (lessonId: string) => completedLessons.includes(lessonId),
    [completedLessons]
  );

  const markLessonComplete = useCallback((lessonId: string) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      const updated = [...prev, lessonId];
      saveProgress(updated);
      return updated;
    });
  }, []);

  const getSprintProgress = useCallback(
    (sprintId: string): SprintProgress => {
      const sprint = sprints.find((s) => s.id === sprintId);
      if (!sprint) {
        return {
          sprintId,
          completedLessons: 0,
          totalLessons: 0,
          percentage: 0,
          status: "nao-iniciada",
        };
      }
      const total = sprint.lessons.length;
      const completed = sprint.lessons.filter((l) =>
        completedLessons.includes(l.id)
      ).length;
      return {
        sprintId,
        completedLessons: completed,
        totalLessons: total,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        status: getSprintStatus(completed, total),
      };
    },
    [completedLessons]
  );

  const totalLessons = getTotalLessonsCount();
  const completedCount = completedLessons.length;
  const overallPercentage =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return {
    completedLessons,
    isLoaded,
    isLessonCompleted,
    markLessonComplete,
    getSprintProgress,
    totalLessons,
    completedCount,
    overallPercentage,
  };
}
