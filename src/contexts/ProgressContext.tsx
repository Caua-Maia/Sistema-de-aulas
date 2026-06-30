"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { sprints } from "@/data/mock";
import {
  findSprintIdForLesson,
  getLessonNavigation,
  getLessonProgressEntry,
  getNextIncompleteLesson,
  getOverallProgress,
  getSprintProgressFor,
  loadProgressMapFromStorage,
  loadProgressMapFromSupabase,
  LessonProgressEntry,
  saveProgressMapToStorage,
  upsertLessonProgressRow,
  upsertSprintProgressRow,
} from "@/lib/progress";
import { LessonProgressMap, Sprint, SprintProgress } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PendingChallengeEntry {
  sprintId: string;
  sprintNumber: number;
  lessonId: string;
  lessonTitle: string;
}

interface ProgressContextValue {
  progressMap: LessonProgressMap;
  isLoaded: boolean;
  completedCount: number;
  watchedCount: number;
  pendingChallengesCount: number;
  totalLessons: number;
  overallPercentage: number;
  xp: number;
  level: number;
  allComplete: boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  isLessonWatched: (lessonId: string) => boolean;
  isChallengeCompleted: (lessonId: string) => boolean;
  getLessonAnswer: (lessonId: string) => string | undefined;
  markLessonWatched: (lessonId: string) => void;
  markChallengeCompleted: (lessonId: string, answer?: string) => void;
  getSprintProgress: (sprintId: string) => SprintProgress;
  getNextLesson: () => ReturnType<typeof getNextIncompleteLesson>;
  getNavigation: (lessonId: string) => ReturnType<typeof getLessonNavigation>;
  getPendingChallenges: () => PendingChallengeEntry[];
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ProgressContext = createContext<ProgressContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const userId = user?.id;

  const [progressMap, setProgressMap] = useState<LessonProgressMap>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const prevUserIdRef = useRef<string | undefined>(undefined);

  // Carrega o progresso do Supabase ao mudar de usuário (fallback: cache local)
  useEffect(() => {
    if (prevUserIdRef.current === userId) return;
    prevUserIdRef.current = userId;

    setIsLoaded(false);
    setProgressMap({});

    if (!userId) {
      setIsLoaded(true);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const map = await loadProgressMapFromSupabase(userId);
        if (cancelled) return;
        setProgressMap(map);
        saveProgressMapToStorage(map, userId); // atualiza cache de fallback
      } catch (err) {
        console.error(
          "Falha ao carregar progresso do Supabase — usando cache local:",
          err
        );
        if (!cancelled) setProgressMap(loadProgressMapFromStorage(userId));
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // ─── Persistência ─────────────────────────────────────────────────────────────

  /** Salva uma aula no Supabase (lesson_progress + agregado sprint_progress) e no cache local. */
  const persistLesson = useCallback(
    async (
      lessonId: string,
      entry: LessonProgressEntry,
      fullMap: LessonProgressMap
    ) => {
      if (!userId) return;

      saveProgressMapToStorage(fullMap, userId); // fallback otimista

      try {
        await upsertLessonProgressRow(userId, lessonId, entry);
        const sprintId = findSprintIdForLesson(lessonId);
        if (sprintId) {
          await upsertSprintProgressRow(userId, sprintId, fullMap);
        }
      } catch (err) {
        console.error("Falha ao salvar progresso no Supabase:", err);
      }
    },
    [userId]
  );

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const markLessonWatched = useCallback(
    (lessonId: string) => {
      setProgressMap((prev) => {
        if (prev[lessonId]?.watched) return prev;
        const entry: LessonProgressEntry = {
          watched: true,
          challengeCompleted: prev[lessonId]?.challengeCompleted ?? false,
          ...(prev[lessonId]?.challengeAnswer
            ? { challengeAnswer: prev[lessonId].challengeAnswer }
            : {}),
        };
        const updated: LessonProgressMap = { ...prev, [lessonId]: entry };
        void persistLesson(lessonId, entry, updated);
        return updated;
      });
    },
    [persistLesson]
  );

  const markChallengeCompleted = useCallback(
    (lessonId: string, answer?: string) => {
      setProgressMap((prev) => {
        if (prev[lessonId]?.challengeCompleted) return prev;
        const entry: LessonProgressEntry = {
          watched: prev[lessonId]?.watched ?? false,
          challengeCompleted: true,
          ...(answer
            ? { challengeAnswer: answer }
            : prev[lessonId]?.challengeAnswer
              ? { challengeAnswer: prev[lessonId].challengeAnswer }
              : {}),
        };
        const updated: LessonProgressMap = { ...prev, [lessonId]: entry };
        void persistLesson(lessonId, entry, updated);
        return updated;
      });
    },
    [persistLesson]
  );

  // ─── Queries ────────────────────────────────────────────────────────────────

  const isLessonCompleted = useCallback(
    (lessonId: string) =>
      getLessonProgressEntry(lessonId, progressMap).completed,
    [progressMap]
  );

  const isLessonWatched = useCallback(
    (lessonId: string) =>
      getLessonProgressEntry(lessonId, progressMap).watched,
    [progressMap]
  );

  const isChallengeCompleted = useCallback(
    (lessonId: string) =>
      getLessonProgressEntry(lessonId, progressMap).challengeCompleted,
    [progressMap]
  );

  const getLessonAnswer = useCallback(
    (lessonId: string) =>
      getLessonProgressEntry(lessonId, progressMap).challengeAnswer,
    [progressMap]
  );

  const getSprintProgress = useCallback(
    (sprintId: string) => getSprintProgressFor(sprintId, progressMap),
    [progressMap]
  );

  const getNextLesson = useCallback(
    () => getNextIncompleteLesson(progressMap),
    [progressMap]
  );

  const getNavigation = useCallback(
    (lessonId: string) => getLessonNavigation(lessonId),
    []
  );

  const getPendingChallenges = useCallback((): PendingChallengeEntry[] => {
    const result: PendingChallengeEntry[] = [];
    for (const sprint of sprints as Sprint[]) {
      for (const lesson of sprint.lessons) {
        const entry = progressMap[lesson.id];
        if (entry?.watched && !entry.challengeCompleted) {
          result.push({
            sprintId: sprint.id,
            sprintNumber: sprint.number,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
          });
        }
      }
    }
    return result;
  }, [progressMap]);

  const overall = useMemo(() => getOverallProgress(progressMap), [progressMap]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progressMap,
      isLoaded,
      completedCount: overall.completedCount,
      watchedCount: overall.watchedCount,
      pendingChallengesCount: overall.pendingChallenges,
      totalLessons: overall.totalLessons,
      overallPercentage: overall.overallPercentage,
      xp: overall.xp,
      level: overall.level,
      allComplete: overall.allComplete,
      isLessonCompleted,
      isLessonWatched,
      isChallengeCompleted,
      getLessonAnswer,
      markLessonWatched,
      markChallengeCompleted,
      getSprintProgress,
      getNextLesson,
      getNavigation,
      getPendingChallenges,
    }),
    [
      progressMap,
      isLoaded,
      overall,
      isLessonCompleted,
      isLessonWatched,
      isChallengeCompleted,
      getLessonAnswer,
      markLessonWatched,
      markChallengeCompleted,
      getSprintProgress,
      getNextLesson,
      getNavigation,
      getPendingChallenges,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProgressContext() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgressContext must be used within ProgressProvider");
  }
  return context;
}
