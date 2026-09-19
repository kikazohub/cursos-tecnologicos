import "server-only";
import { getDb } from "./db";

export interface LessonProgressRow {
  user_id: number;
  course_id: string;
  lesson_id: string;
  status: "started" | "completed";
  score: number | null;
  completed_at: string | null;
}

export function getLessonProgress(
  userId: number,
  courseId: string,
  lessonId: string
): LessonProgressRow | undefined {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM lesson_progress WHERE user_id = ? AND course_id = ? AND lesson_id = ?`
    )
    .get(userId, courseId, lessonId) as LessonProgressRow | undefined;
}

export function getCourseProgress(userId: number, courseId: string): LessonProgressRow[] {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM lesson_progress WHERE user_id = ? AND course_id = ?`)
    .all(userId, courseId) as unknown as LessonProgressRow[];
}

export function getAllLessonProgress(userId: number): LessonProgressRow[] {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM lesson_progress WHERE user_id = ?`)
    .all(userId) as unknown as LessonProgressRow[];
}

export function isLessonCompleted(userId: number, courseId: string, lessonId: string): boolean {
  const row = getLessonProgress(userId, courseId, lessonId);
  return row?.status === "completed";
}

export function markLessonCompleted(
  userId: number,
  courseId: string,
  lessonId: string,
  score: number
): boolean {
  const db = getDb();
  const existing = getLessonProgress(userId, courseId, lessonId);
  if (existing?.status === "completed") return false;

  db.prepare(
    `INSERT INTO lesson_progress (user_id, course_id, lesson_id, status, score, completed_at)
     VALUES (?, ?, ?, 'completed', ?, datetime('now'))
     ON CONFLICT(user_id, course_id, lesson_id)
     DO UPDATE SET status = 'completed', score = excluded.score, completed_at = datetime('now')`
  ).run(userId, courseId, lessonId, score);
  return true;
}

export function isCourseCompleted(userId: number, courseId: string): boolean {
  const db = getDb();
  const row = db
    .prepare(`SELECT 1 FROM course_completions WHERE user_id = ? AND course_id = ?`)
    .get(userId, courseId);
  return !!row;
}

export function completedCourseIds(userId: number): string[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT course_id FROM course_completions WHERE user_id = ?`)
    .all(userId) as { course_id: string }[];
  return rows.map((r) => r.course_id);
}

export function markCourseCompleted(userId: number, courseId: string): boolean {
  const db = getDb();
  const already = isCourseCompleted(userId, courseId);
  if (already) return false;
  db.prepare(
    `INSERT OR IGNORE INTO course_completions (user_id, course_id) VALUES (?, ?)`
  ).run(userId, courseId);
  return true;
}

export function recordQuizResult(
  userId: number,
  courseId: string,
  lessonId: string,
  score: number,
  total: number
): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO quiz_results (user_id, course_id, lesson_id, score, total) VALUES (?, ?, ?, ?, ?)`
  ).run(userId, courseId, lessonId, score, total);
}

export function addActivity(userId: number, day: string, xp: number): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO activity (user_id, day, xp) VALUES (?, ?, ?)
     ON CONFLICT(user_id, day) DO UPDATE SET xp = xp + excluded.xp`
  ).run(userId, day, xp);
}