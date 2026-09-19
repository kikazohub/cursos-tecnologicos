import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getLesson, getCourses, getTotalLessons, getTotalCourses } from "@/lib/content/registry";
import {
  getCourseProgress,
  markLessonCompleted,
  markCourseCompleted,
  recordQuizResult,
  completedCourseIds,
} from "@/lib/db/progress";
import {
  getTotalXp,
  levelForXp,
  xpProgress,
  getStreak,
  getBadges,
  BADGES,
  awardXp,
  evaluateBadges,
  type BadgeDef,
} from "@/lib/gamification";

export const dynamic = "force-dynamic";

function buildSummary(userId: number) {
  const xp = getTotalXp(userId);
  const streak = getStreak(userId);
  const badges = getBadges(userId);
  const badgeDefs = BADGES.filter((b) => badges.includes(b.id));
  const completedIds = new Set(completedCourseIds(userId));
  const courses = getCourses().map((c) => {
    const prog = getCourseProgress(userId, c.id);
    const done = prog.filter((p) => p.status === "completed").length;
    return {
      courseId: c.id,
      title: c.title,
      emoji: c.emoji,
      totalLessons: c.lessons.length,
      completedLessons: done,
      done: done >= c.lessons.length,
    };
  });
  return {
    xp,
    level: levelForXp(xp),
    levelProgress: xpProgress(xp),
    streak,
    badges: badgeDefs,
    totalLessons: getTotalLessons(),
    totalCourses: getTotalCourses(),
    completedCourses: completedIds.size,
    courses,
  };
}

export type ProgressResponse = {
  ok: boolean;
  error?: string;
  summary?: ReturnType<typeof buildSummary>;
  xpEarned?: number;
  lessonCompleted?: boolean;
  courseCompleted?: boolean;
  newBadges?: string[];
};

export async function GET(): Promise<NextResponse<ProgressResponse>> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Inicia sesión." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, summary: buildSummary(user.id) });
}

export async function POST(request: Request): Promise<NextResponse<ProgressResponse>> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Inicia sesión." }, { status: 401 });
  }

  let body: { courseId?: unknown; lessonId?: unknown; score?: unknown; total?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const courseId = typeof body.courseId === "string" ? body.courseId : "";
  const lessonId = typeof body.lessonId === "string" ? body.lessonId : "";
  const score = typeof body.score === "number" ? body.score : NaN;
  const total = typeof body.total === "number" ? body.total : NaN;

  const found = getLesson(courseId, lessonId);
  if (!found || !Number.isFinite(score) || total <= 0) {
    return NextResponse.json({ ok: false, error: "Parámetros inválidos" }, { status: 400 });
  }

  const pct = score / total;
  let xpEarned = 0;
  let lessonCompleted = false;
  let courseCompleted = false;

  if (pct >= 0.7) {
    lessonCompleted = markLessonCompleted(user.id, courseId, lessonId, pct);
    if (lessonCompleted) {
      recordQuizResult(user.id, courseId, lessonId, pct, total);
      awardXp(user.id, found.lesson.xp);
      xpEarned += found.lesson.xp;

      const done = getCourseProgress(user.id, courseId).filter(
        (p) => p.status === "completed"
      ).length;
      if (!completedCourseIds(user.id).includes(courseId) && done >= found.course.lessons.length) {
        markCourseCompleted(user.id, courseId);
        awardXp(user.id, 500);
        xpEarned += 500;
        courseCompleted = true;
      }
    }
  }

  const newBadges = evaluateBadges(user.id);

  return NextResponse.json({
    ok: true,
    xpEarned,
    lessonCompleted,
    courseCompleted,
    newBadges,
    summary: buildSummary(user.id),
  });
}

export type { BadgeDef };