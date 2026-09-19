import "server-only";
import { getDb } from "./db/db";
import { addActivity } from "./db/progress";
import { getCoursesByCategory, getTotalCourses } from "./content/registry";
import { completedCourseIds, getAllLessonProgress } from "./db/progress";

export interface Level {
  index: number;
  name: string;
  minXp: number;
}

export const LEVELS: Level[] = [
  { index: 0, name: "Novato", minXp: 0 },
  { index: 1, name: "Aprendiz", minXp: 300 },
  { index: 2, name: "Coder", minXp: 800 },
  { index: 3, name: "Desarrollador", minXp: 1600 },
  { index: 4, name: "Senior", minXp: 3200 },
  { index: 5, name: "Arquitecto", minXp: 6400 },
];

export function levelForXp(xp: number): Level {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.minXp) current = l;
  }
  return current;
}

export function xpProgress(xp: number): { current: number; next: number; pct: number } {
  const level = levelForXp(xp);
  const nextLevel = LEVELS[level.index + 1] ?? level;
  const span = nextLevel.minXp - level.minXp;
  const done = xp - level.minXp;
  return {
    current: done,
    next: Math.max(span, 1),
    pct: Math.min(100, Math.round((done / Math.max(span, 1)) * 100)),
  };
}

export interface BadgeDef {
  id: string;
  emoji: string;
  name: string;
  description: string;
  global?: boolean;
}

export const BADGES: BadgeDef[] = [
  { id: "primeros-pasos", emoji: "🐣", name: "Primeros pasos", description: "Crea tu cuenta en la plataforma." },
  { id: "primera-leccion", emoji: "📘", name: "Primera lección", description: "Completa tu primera lección." },
  { id: "primer-curso", emoji: "✅", name: "Curso completado", description: "Termina tu primer curso completo." },
  { id: "racha-3", emoji: "🔥", name: "En racha", description: "Aprende 3 días seguidos." },
  { id: "racha-7", emoji: "⚡", name: "Imparable", description: "Aprende 7 días seguidos." },
  { id: "xp-1000", emoji: "💯", name: "Máquina", description: "Acumula 1000 XP." },
  { id: "xp-3000", emoji: "🚀", name: "Cohete", description: "Acumula 3000 XP." },
  { id: "maestro-lenguajes", emoji: "⌨️", name: "Maestro de lenguajes", description: "Completa todos los cursos de lenguajes." },
  { id: "maestro-stacks", emoji: "🛠️", name: "Maestro de stacks", description: "Completa todos los cursos de stacks." },
  { id: "maestro-entorno", emoji: "💻", name: "Maestro de entorno", description: "Completa todos los cursos de entorno." },
  { id: "maestro-ia", emoji: "🤖", name: "Maestro de IA", description: "Completa todos los cursos de IA." },
  { id: "maestro-devops", emoji: "☁️", name: "Maestro DevOps", description: "Completa todos los cursos de DevOps." },
  { id: "completista", emoji: "🏆", name: "Completista", description: "Termina TODOS los cursos del catálogo." },
];

export function getBadges(userId: number): string[] {
  const db = getDb();
  const rows = db.prepare("SELECT badge_id FROM badges WHERE user_id = ?").all(userId) as {
    badge_id: string;
  }[];
  return rows.map((r) => r.badge_id);
}

export function awardBadge(userId: number, badgeId: string): boolean {
  const db = getDb();
  const res = db
    .prepare("INSERT OR IGNORE INTO badges (user_id, badge_id) VALUES (?, ?)")
    .run(userId, badgeId);
  return res.changes > 0;
}

export function getTotalXp(userId: number): number {
  const db = getDb();
  const row = db
    .prepare("SELECT COALESCE(SUM(xp), 0) AS total FROM activity WHERE user_id = ?")
    .get(userId) as { total: number };
  return row.total;
}

export function awardXp(userId: number, xp: number, day: string = todayKey()): void {
  if (xp <= 0) return;
  addActivity(userId, day, xp);
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function shiftDay(d: Date, offset: number): string {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + offset);
  return `${copy.getFullYear()}-${String(copy.getMonth() + 1).padStart(2, "0")}-${String(
    copy.getDate()
  ).padStart(2, "0")}`;
}

export function getStreak(userId: number): { streak: number; todayActive: boolean } {
  const db = getDb();
  const rows = db
    .prepare("SELECT DISTINCT day FROM activity WHERE user_id = ?")
    .all(userId) as { day: string }[];
  const daySet = new Set(rows.map((r) => r.day));
  if (daySet.size === 0) return { streak: 0, todayActive: false };

  const today = todayKey();
  const todayActive = daySet.has(today);

  // La racha cuenta desde hoy si hay actividad hoy, o desde ayer (racha aún viva).
  let expected = today;
  if (!todayActive) expected = shiftDay(new Date(), -1);
  if (!daySet.has(expected)) return { streak: 0, todayActive };

  let count = 0;
  while (daySet.has(expected)) {
    count += 1;
    expected = shiftDay(new Date(expected + "T12:00:00Z"), -1);
  }
  return { streak: count, todayActive };
}

export function evaluateBadges(userId: number): string[] {
  const awarded = new Set(getBadges(userId));
  const gained: string[] = [];

  const xp = getTotalXp(userId);
  const streak = getStreak(userId).streak;
  const lessons = getAllLessonProgress(userId).length;
  const completed = new Set(completedCourseIds(userId));
  const totalCourses = getTotalCourses();

  const check = (condition: boolean, badgeId: string) => {
    if (condition && !awarded.has(badgeId)) {
      if (awardBadge(userId, badgeId)) gained.push(badgeId);
    }
  };

  check(lessons >= 1, "primera-leccion");
  check(completed.size >= 1, "primer-curso");
  check(streak >= 3, "racha-3");
  check(streak >= 7, "racha-7");
  check(xp >= 1000, "xp-1000");
  check(xp >= 3000, "xp-3000");

  for (const category of ["lenguajes", "stacks", "entorno", "ia", "devops"] as const) {
    const inCategory = getCoursesByCategory(category);
    const allDone = inCategory.every((c) => completed.has(c.id));
    check(allDone, `maestro-${category}`);
  }

  check(completed.size >= totalCourses, "completista");

  return gained;
}