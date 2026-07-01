/**
 * Serviço de dados para o Painel do Monitor.
 * Toda leitura requer que o usuário autenticado seja o monitor
 * (garantido pelas RLS policies + verificação no MonitorLayout).
 */

import { supabase } from "@/lib/supabase";
import { calculateLevel, XP_PER_CHALLENGE, XP_PER_WATCH } from "@/lib/progress";
import { getTotalLessonsCount, sprints } from "@/data/mock";

// ─── Tipos públicos ───────────────────────────────────────────────────────────

export interface MonitorOverview {
  totalStudents: number;
  totalWatched: number;
  totalChallengesCompleted: number;
  totalPendingChallenges: number;
  averageProgress: number; // 0–100
}

export interface StudentSummary {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  watchedCount: number;
  challengesCompleted: number;
  pendingChallenges: number;
  completionPercentage: number;
  createdAt: string;
}

export interface SprintProgressSummary {
  sprintId: string;
  sprintNumber: number;
  sprintTitle: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
}

export interface LessonDetail {
  lessonId: string;
  lessonTitle: string;
  lessonOrder: number;
  sprintId: string;
  sprintNumber: number;
  sprintTitle: string;
  challengeCompleted: boolean;
  challengeAnswer?: string | null;
}

export interface StudentDetail {
  profile: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  };
  xp: number;
  level: number;
  overallProgress: number;
  watchedCount: number;
  challengesCompleted: number;
  pendingChallengesCount: number;
  sprintProgress: SprintProgressSummary[];
  watchedLessons: LessonDetail[];
  pendingChallengesList: LessonDetail[];
}

// ─── Tipos internos (Supabase rows) ──────────────────────────────────────────

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface LessonProgressRow {
  user_id: string;
  lesson_id: string;
  watched: boolean | null;
  challenge_completed: boolean | null;
  challenge_answer: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TOTAL_LESSONS = getTotalLessonsCount();

function calcCompletion(
  rows: Pick<LessonProgressRow, "watched" | "challenge_completed">[]
): number {
  if (TOTAL_LESSONS === 0) return 0;
  const completed = rows.filter((r) => r.watched && r.challenge_completed).length;
  return Math.round((completed / TOTAL_LESSONS) * 100);
}

function calcXp(
  rows: Pick<LessonProgressRow, "watched" | "challenge_completed">[]
): number {
  let xp = 0;
  for (const r of rows) {
    if (r.watched) xp += XP_PER_WATCH;
    if (r.challenge_completed) xp += XP_PER_CHALLENGE;
  }
  return xp;
}

// ─── getMonitorOverview ───────────────────────────────────────────────────────

export async function getMonitorOverview(): Promise<MonitorOverview> {
  const [{ data: profiles, error: pErr }, { data: lessonRows, error: lErr }] =
    await Promise.all([
      supabase.from("profiles").select("id"),
      supabase
        .from("lesson_progress")
        .select("user_id, watched, challenge_completed"),
    ]);

  if (pErr) throw pErr;
  if (lErr) throw lErr;

  const rows = (lessonRows ?? []) as Pick<
    LessonProgressRow,
    "user_id" | "watched" | "challenge_completed"
  >[];

  const totalStudents = (profiles ?? []).length;
  const totalWatched = rows.filter((r) => r.watched).length;
  const totalChallengesCompleted = rows.filter((r) => r.challenge_completed).length;
  const totalPendingChallenges = rows.filter(
    (r) => r.watched && !r.challenge_completed
  ).length;

  // Média de conclusão por aluno
  const byUser = new Map<string, number>();
  for (const r of rows) {
    if (!byUser.has(r.user_id)) byUser.set(r.user_id, 0);
    if (r.watched && r.challenge_completed)
      byUser.set(r.user_id, byUser.get(r.user_id)! + 1);
  }
  let sumPct = 0;
  for (const completed of byUser.values()) {
    sumPct += TOTAL_LESSONS > 0 ? (completed / TOTAL_LESSONS) * 100 : 0;
  }
  const averageProgress = byUser.size > 0 ? Math.round(sumPct / byUser.size) : 0;

  return {
    totalStudents,
    totalWatched,
    totalChallengesCompleted,
    totalPendingChallenges,
    averageProgress,
  };
}

// ─── getStudentsProgress ──────────────────────────────────────────────────────

export async function getStudentsProgress(): Promise<StudentSummary[]> {
  const [{ data: profiles, error: pErr }, { data: lessonRows, error: lErr }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, name, email, created_at")
        .order("created_at"),
      supabase
        .from("lesson_progress")
        .select("user_id, watched, challenge_completed"),
    ]);

  if (pErr) throw pErr;
  if (lErr) throw lErr;

  const rowsByUser = new Map<
    string,
    Pick<LessonProgressRow, "watched" | "challenge_completed">[]
  >();
  for (const r of (lessonRows ?? []) as Pick<
    LessonProgressRow,
    "user_id" | "watched" | "challenge_completed"
  >[]) {
    if (!rowsByUser.has(r.user_id)) rowsByUser.set(r.user_id, []);
    rowsByUser.get(r.user_id)!.push(r);
  }

  return ((profiles ?? []) as ProfileRow[]).map((p) => {
    const rows = rowsByUser.get(p.id) ?? [];
    const xp = calcXp(rows);
    const watchedCount = rows.filter((r) => r.watched).length;
    const challengesCompleted = rows.filter((r) => r.challenge_completed).length;
    const pendingChallenges = rows.filter(
      (r) => r.watched && !r.challenge_completed
    ).length;

    return {
      id: p.id,
      name: p.name,
      email: p.email,
      createdAt: p.created_at,
      xp,
      level: calculateLevel(xp),
      watchedCount,
      challengesCompleted,
      pendingChallenges,
      completionPercentage: calcCompletion(rows),
    };
  });
}

// ─── getStudentDetails ────────────────────────────────────────────────────────

export async function getStudentDetails(
  userId: string
): Promise<StudentDetail | null> {
  const [{ data: profile, error: pErr }, { data: lessonRows, error: lErr }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, name, email, created_at")
        .eq("id", userId)
        .single(),
      supabase
        .from("lesson_progress")
        .select("lesson_id, watched, challenge_completed, challenge_answer")
        .eq("user_id", userId),
    ]);

  if (pErr || !profile) return null;
  if (lErr) throw lErr;

  const rows = (lessonRows ?? []) as Omit<LessonProgressRow, "user_id">[];
  const rowIndex = new Map(rows.map((r) => [r.lesson_id, r]));

  const xp = calcXp(rows);
  const level = calculateLevel(xp);
  const overallProgress = calcCompletion(rows);
  const watchedCount = rows.filter((r) => r.watched).length;
  const challengesCompleted = rows.filter((r) => r.challenge_completed).length;
  const pendingChallengesCount = rows.filter(
    (r) => r.watched && !r.challenge_completed
  ).length;

  // Progresso por sprint
  const sprintProgress: SprintProgressSummary[] = sprints.map((sprint) => {
    const total = sprint.lessons.length;
    const completed = sprint.lessons.filter((l) => {
      const r = rowIndex.get(l.id);
      return r?.watched && r.challenge_completed;
    }).length;
    return {
      sprintId: sprint.id,
      sprintNumber: sprint.number,
      sprintTitle: sprint.title,
      completedLessons: completed,
      totalLessons: total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  // Listas de aulas
  const watchedLessons: LessonDetail[] = [];
  const pendingChallengesList: LessonDetail[] = [];

  for (const sprint of sprints) {
    for (const lesson of sprint.lessons) {
      const r = rowIndex.get(lesson.id);
      if (!r?.watched) continue;
      const detail: LessonDetail = {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        lessonOrder: lesson.order,
        sprintId: sprint.id,
        sprintNumber: sprint.number,
        sprintTitle: sprint.title,
        challengeCompleted: Boolean(r.challenge_completed),
        challengeAnswer: r.challenge_answer,
      };
      watchedLessons.push(detail);
      if (!r.challenge_completed) pendingChallengesList.push(detail);
    }
  }

  return {
    profile: profile as ProfileRow,
    xp,
    level,
    overallProgress,
    watchedCount,
    challengesCompleted,
    pendingChallengesCount,
    sprintProgress,
    watchedLessons,
    pendingChallengesList,
  };
}
