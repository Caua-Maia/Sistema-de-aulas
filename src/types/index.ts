export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  content: string;
  challenge: string;
  order: number;
}

export interface Sprint {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export type SprintStatus = "nao-iniciada" | "em-andamento" | "concluida";

export interface SprintProgress {
  sprintId: string;
  completedLessons: number;
  watchedLessons: number;
  pendingChallenges: number;
  totalLessons: number;
  percentage: number;
  status: SprintStatus;
}

export interface LessonProgress {
  watched: boolean;
  challengeCompleted: boolean;
  completed: boolean;
}

/** Stored in localStorage: only raw booleans + optional answer text */
export type LessonProgressMap = Record<
  string,
  { watched: boolean; challengeCompleted: boolean; challengeAnswer?: string }
>;
