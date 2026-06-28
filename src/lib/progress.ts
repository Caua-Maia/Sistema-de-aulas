/**
 * Utilitários de progresso — pure functions, sem estado React.
 * Para migrar para Supabase: substituir loadProgressFromStorage / saveProgressToStorage
 * por chamadas à API; o restante (XP, nível, navegação) permanece igual.
 */

import { sprints, getTotalLessonsCount } from "@/data/mock";
import { Lesson, Sprint, SprintProgress, SprintStatus } from "@/types";

export const PROGRESS_STORAGE_KEY = "ford-enter-progress";
export const XP_PER_LESSON = 50;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LessonEntry {
  sprint: Sprint;
  lesson: Lesson;
}

// ─── Storage key per user ─────────────────────────────────────────────────────

/** Chave isolada por usuário — evita cruzamento de progresso entre contas. */
export function getProgressKey(userId: string | undefined): string {
  return userId
    ? `${PROGRESS_STORAGE_KEY}-${userId}`
    : PROGRESS_STORAGE_KEY;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function getValidLessonIds(): Set<string> {
  return new Set(sprints.flatMap((s) => s.lessons.map((l) => l.id)));
}

/** Remove duplicatas e IDs inválidos. */
export function normalizeCompletedLessonIds(ids: string[]): string[] {
  const valid = getValidLessonIds();
  const seen = new Set<string>();
  const result: string[] = [];
  for (const id of ids) {
    if (valid.has(id) && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }
  return result;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

export function loadProgressFromStorage(userId?: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(getProgressKey(userId));
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return normalizeCompletedLessonIds(
      parsed.filter((id): id is string => typeof id === "string")
    );
  } catch {
    return [];
  }
}

export function saveProgressToStorage(
  completedLessonIds: string[],
  userId?: string
): void {
  const normalized = normalizeCompletedLessonIds(completedLessonIds);
  localStorage.setItem(getProgressKey(userId), JSON.stringify(normalized));
}

// ─── Lesson navigation ────────────────────────────────────────────────────────

export function getOrderedLessonEntries(): LessonEntry[] {
  return sprints
    .slice()
    .sort((a, b) => a.number - b.number)
    .flatMap((sprint) =>
      sprint.lessons
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((lesson) => ({ sprint, lesson }))
    );
}

export function getNextIncompleteLesson(
  completedLessonIds: string[]
): LessonEntry | undefined {
  const completed = new Set(completedLessonIds);
  return getOrderedLessonEntries().find(
    ({ lesson }) => !completed.has(lesson.id)
  );
}

export function getLessonNavigation(lessonId: string): {
  prev: LessonEntry | null;
  next: LessonEntry | null;
} {
  const ordered = getOrderedLessonEntries();
  const index = ordered.findIndex(({ lesson }) => lesson.id === lessonId);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? ordered[index - 1] : null,
    next: index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}

// ─── Sprint progress ──────────────────────────────────────────────────────────

export function getSprintStatus(
  completed: number,
  total: number
): SprintStatus {
  if (completed === 0) return "nao-iniciada";
  if (completed >= total) return "concluida";
  return "em-andamento";
}

export function getSprintProgressFor(
  sprintId: string,
  completedLessonIds: string[]
): SprintProgress {
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
  const completed = new Set(completedLessonIds);
  const total = sprint.lessons.length;
  const completedCount = sprint.lessons.filter((l) =>
    completed.has(l.id)
  ).length;
  return {
    sprintId,
    completedLessons: completedCount,
    totalLessons: total,
    percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
    status: getSprintStatus(completedCount, total),
  };
}

// ─── XP & Level ──────────────────────────────────────────────────────────────

export function calculateXp(completedLessonCount: number): number {
  return completedLessonCount * XP_PER_LESSON;
}

/** Nível 1: 0–99 XP; nível 2: 100–199 XP; etc. */
export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getLevelProgress(xp: number): {
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
} {
  const level = calculateLevel(xp);
  const xpInLevel = xp % 100;
  return { level, xpInLevel, xpForNextLevel: 100 };
}

// ─── Overall summary ──────────────────────────────────────────────────────────

export function getOverallProgress(completedLessonIds: string[]) {
  const normalized = normalizeCompletedLessonIds(completedLessonIds);
  const totalLessons = getTotalLessonsCount();
  const completedCount = normalized.length;
  const overallPercentage =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const xp = calculateXp(completedCount);
  const level = calculateLevel(xp);
  const allComplete = completedCount >= totalLessons && totalLessons > 0;
  return {
    completedLessonIds: normalized,
    completedCount,
    totalLessons,
    overallPercentage,
    xp,
    level,
    allComplete,
  };
}
