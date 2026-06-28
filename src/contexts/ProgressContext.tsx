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
import {
  getLessonNavigation,
  getNextIncompleteLesson,
  getOverallProgress,
  getProgressKey,
  getSprintProgressFor,
  loadProgressFromStorage,
  PROGRESS_STORAGE_KEY,
  saveProgressToStorage,
} from "@/lib/progress";
import { SprintProgress } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProgressContextValue {
  completedLessons: string[];
  isLoaded: boolean;
  completedCount: number;
  totalLessons: number;
  overallPercentage: number;
  xp: number;
  level: number;
  allComplete: boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  markLessonComplete: (lessonId: string) => boolean;
  getSprintProgress: (sprintId: string) => SprintProgress;
  getNextLesson: () => ReturnType<typeof getNextIncompleteLesson>;
  getNavigation: (lessonId: string) => ReturnType<typeof getLessonNavigation>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ProgressContext = createContext<ProgressContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const userId = user?.id;

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Track current userId to detect user changes (e.g. logout + login as different user)
  const prevUserIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (prevUserIdRef.current === userId) return;
    prevUserIdRef.current = userId;

    // Reset and reload for the new user (or clear on logout)
    setIsLoaded(false);
    setCompletedLessons([]);

    if (userId) {
      setCompletedLessons(loadProgressFromStorage(userId));
    }
    setIsLoaded(true);
  }, [userId]);

  // Listen for localStorage changes from other tabs
  useEffect(() => {
    if (!userId) return;

    const key = getProgressKey(userId);
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === PROGRESS_STORAGE_KEY) {
        setCompletedLessons(loadProgressFromStorage(userId));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [userId]);

  const isLessonCompleted = useCallback(
    (lessonId: string) => completedLessons.includes(lessonId),
    [completedLessons]
  );

  const markLessonComplete = useCallback(
    (lessonId: string): boolean => {
      let wasAdded = false;
      setCompletedLessons((prev) => {
        if (prev.includes(lessonId)) return prev;
        wasAdded = true;
        const updated = [...prev, lessonId];
        saveProgressToStorage(updated, userId);
        return updated;
      });
      return wasAdded;
    },
    [userId]
  );

  const getSprintProgress = useCallback(
    (sprintId: string) => getSprintProgressFor(sprintId, completedLessons),
    [completedLessons]
  );

  const getNextLesson = useCallback(
    () => getNextIncompleteLesson(completedLessons),
    [completedLessons]
  );

  const getNavigation = useCallback(
    (lessonId: string) => getLessonNavigation(lessonId),
    []
  );

  const overall = useMemo(
    () => getOverallProgress(completedLessons),
    [completedLessons]
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      completedLessons: overall.completedLessonIds,
      isLoaded,
      completedCount: overall.completedCount,
      totalLessons: overall.totalLessons,
      overallPercentage: overall.overallPercentage,
      xp: overall.xp,
      level: overall.level,
      allComplete: overall.allComplete,
      isLessonCompleted,
      markLessonComplete,
      getSprintProgress,
      getNextLesson,
      getNavigation,
    }),
    [
      overall,
      isLoaded,
      isLessonCompleted,
      markLessonComplete,
      getSprintProgress,
      getNextLesson,
      getNavigation,
    ]
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProgressContext(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgressContext must be used within ProgressProvider");
  }
  return context;
}
