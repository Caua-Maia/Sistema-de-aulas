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
  getLessonNavigation,
  getLessonProgressEntry,
  getNextIncompleteLesson,
  getOverallProgress,
  getProgressKey,
  getSprintProgressFor,
  loadProgressMapFromStorage,
  saveProgressMapToStorage,
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

  // Load on user change
  useEffect(() => {
    if (prevUserIdRef.current === userId) return;
    prevUserIdRef.current = userId;
    setIsLoaded(false);
    setProgressMap({});
    if (userId) {
      setProgressMap(loadProgressMapFromStorage(userId));
    }
    setIsLoaded(true);
  }, [userId]);

  // Sync across tabs
  useEffect(() => {
    if (!userId) return;
    const key = getProgressKey(userId);
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) {
        setProgressMap(loadProgressMapFromStorage(userId));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [userId]);

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const markLessonWatched = useCallback(
    (lessonId: string) => {
      setProgressMap((prev) => {
        if (prev[lessonId]?.watched) return prev;
        const updated: LessonProgressMap = {
          ...prev,
          [lessonId]: {
            challengeCompleted: prev[lessonId]?.challengeCompleted ?? false,
            ...(prev[lessonId]?.challengeAnswer
              ? { challengeAnswer: prev[lessonId].challengeAnswer }
              : {}),
            watched: true,
          },
        };
        saveProgressMapToStorage(updated, userId);
        return updated;
      });
    },
    [userId]
  );

  const markChallengeCompleted = useCallback(
    (lessonId: string, answer?: string) => {
      setProgressMap((prev) => {
        if (prev[lessonId]?.challengeCompleted) return prev;
        const updated: LessonProgressMap = {
          ...prev,
          [lessonId]: {
            watched: prev[lessonId]?.watched ?? false,
            challengeCompleted: true,
            ...(answer
              ? { challengeAnswer: answer }
              : prev[lessonId]?.challengeAnswer
                ? { challengeAnswer: prev[lessonId].challengeAnswer }
                : {}),
          },
        };
        saveProgressMapToStorage(updated, userId);
        return updated;
      });
    },
    [userId]
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
