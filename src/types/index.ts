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
  totalLessons: number;
  percentage: number;
  status: SprintStatus;
}
