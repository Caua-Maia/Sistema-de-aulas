/**
 * Utilitários de progresso — pure functions, sem estado React.
 * Para migrar para Supabase: substituir load/save storage functions por chamadas à API.
 *
 * Formato de storage v2: Record<lessonId, { watched, challengeCompleted, challengeAnswer? }>
 * Migração automática do formato v1 (string[]) na primeira carga.
 */

import { sprints, getTotalLessonsCount } from "@/data/mock";
import { Lesson, LessonProgressMap, Sprint, SprintProgress, SprintStatus } from "@/types";

export const XP_PER_WATCH = 25;
export const XP_PER_CHALLENGE = 25;
export const XP_PER_LESSON = XP_PER_WATCH + XP_PER_CHALLENGE; // 50 — mantém compat

// ─── Storage keys ─────────────────────────────────────────────────────────────

const PROGRESS_KEY_V1 = "ford-enter-progress";
const PROGRESS_KEY_V2 = "ford-enter-progress-v2";

export function getProgressKey(userId: string | undefined): string {
  return userId ? `${PROGRESS_KEY_V2}-${userId}` : PROGRESS_KEY_V2;
}

function getLegacyKey(userId: string | undefined): string {
  return userId ? `${PROGRESS_KEY_V1}-${userId}` : PROGRESS_KEY_V1;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function getValidLessonIds(): Set<string> {
  return new Set(sprints.flatMap((s) => s.lessons.map((l) => l.id)));
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

export function loadProgressMapFromStorage(userId?: string): LessonProgressMap {
  if (typeof window === "undefined") return {};
  const valid = getValidLessonIds();

  try {
    const v2Key = getProgressKey(userId);
    const stored = localStorage.getItem(v2Key);

    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        // Filter to valid lesson IDs only
        const result: LessonProgressMap = {};
        for (const [id, val] of Object.entries(parsed)) {
          if (valid.has(id) && val && typeof val === "object") {
            const entry = val as { watched?: boolean; challengeCompleted?: boolean; challengeAnswer?: string };
            result[id] = {
              watched: Boolean(entry.watched),
              challengeCompleted: Boolean(entry.challengeCompleted),
              ...(entry.challengeAnswer ? { challengeAnswer: entry.challengeAnswer } : {}),
            };
          }
        }
        return result;
      }
    }

    // Migrate from v1 (string[] of completed lesson IDs)
    const legacyStored = localStorage.getItem(getLegacyKey(userId));
    if (legacyStored) {
      const legacyParsed = JSON.parse(legacyStored);
      if (Array.isArray(legacyParsed)) {
        const result: LessonProgressMap = {};
        for (const id of legacyParsed) {
          if (typeof id === "string" && valid.has(id)) {
            result[id] = { watched: true, challengeCompleted: true };
          }
        }
        saveProgressMapToStorage(result, userId);
        return result;
      }
    }
  } catch {
    // ignore parse errors
  }
  return {};
}

export function saveProgressMapToStorage(
  map: LessonProgressMap,
  userId?: string
): void {
  localStorage.setItem(getProgressKey(userId), JSON.stringify(map));
}

// ─── Derived lesson states ────────────────────────────────────────────────────

export function getLessonProgressEntry(
  lessonId: string,
  map: LessonProgressMap
): { watched: boolean; challengeCompleted: boolean; completed: boolean; challengeAnswer?: string } {
  const entry = map[lessonId];
  const watched = entry?.watched ?? false;
  const challengeCompleted = entry?.challengeCompleted ?? false;
  return {
    watched,
    challengeCompleted,
    completed: watched && challengeCompleted,
    challengeAnswer: entry?.challengeAnswer,
  };
}

export function getCompletedLessonIds(map: LessonProgressMap): string[] {
  return Object.entries(map)
    .filter(([, e]) => e.watched && e.challengeCompleted)
    .map(([id]) => id);
}

export function getWatchedLessonIds(map: LessonProgressMap): string[] {
  return Object.entries(map).filter(([, e]) => e.watched).map(([id]) => id);
}

export function getPendingChallengeIds(map: LessonProgressMap): string[] {
  return Object.entries(map)
    .filter(([, e]) => e.watched && !e.challengeCompleted)
    .map(([id]) => id);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LessonEntry {
  sprint: Sprint;
  lesson: Lesson;
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
  map: LessonProgressMap
): LessonEntry | undefined {
  return getOrderedLessonEntries().find(
    ({ lesson }) => !map[lesson.id]?.watched
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
  watched: number,
  total: number
): SprintStatus {
  if (watched === 0) return "nao-iniciada";
  if (completed >= total) return "concluida";
  return "em-andamento";
}

export function getSprintProgressFor(
  sprintId: string,
  map: LessonProgressMap
): SprintProgress {
  const sprint = sprints.find((s) => s.id === sprintId);
  if (!sprint) {
    return {
      sprintId,
      completedLessons: 0,
      watchedLessons: 0,
      pendingChallenges: 0,
      totalLessons: 0,
      percentage: 0,
      status: "nao-iniciada",
    };
  }
  const total = sprint.lessons.length;
  let completedCount = 0;
  let watchedCount = 0;
  let pendingCount = 0;

  for (const lesson of sprint.lessons) {
    const entry = map[lesson.id];
    if (!entry) continue;
    if (entry.watched) watchedCount++;
    if (entry.watched && entry.challengeCompleted) completedCount++;
    if (entry.watched && !entry.challengeCompleted) pendingCount++;
  }

  return {
    sprintId,
    completedLessons: completedCount,
    watchedLessons: watchedCount,
    pendingChallenges: pendingCount,
    totalLessons: total,
    percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
    status: getSprintStatus(completedCount, watchedCount, total),
  };
}

// ─── XP & Level ──────────────────────────────────────────────────────────────

export function calculateXp(map: LessonProgressMap): number {
  let xp = 0;
  for (const entry of Object.values(map)) {
    if (entry.watched) xp += XP_PER_WATCH;
    if (entry.challengeCompleted) xp += XP_PER_CHALLENGE;
  }
  return xp;
}

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

export function getOverallProgress(map: LessonProgressMap) {
  const totalLessons = getTotalLessonsCount();
  const valid = getValidLessonIds();
  let completedCount = 0;
  let watchedCount = 0;
  let pendingChallenges = 0;

  for (const [id, entry] of Object.entries(map)) {
    if (!valid.has(id)) continue;
    if (entry.watched) watchedCount++;
    if (entry.watched && entry.challengeCompleted) completedCount++;
    if (entry.watched && !entry.challengeCompleted) pendingChallenges++;
  }

  const overallPercentage =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const xp = calculateXp(map);
  const level = calculateLevel(xp);
  const allComplete = completedCount >= totalLessons && totalLessons > 0;

  return {
    completedCount,
    watchedCount,
    pendingChallenges,
    totalLessons,
    overallPercentage,
    xp,
    level,
    allComplete,
  };
}

// Keep for backward compat export
export { PROGRESS_KEY_V2 as PROGRESS_STORAGE_KEY };
