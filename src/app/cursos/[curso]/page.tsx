import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getCourse } from "@/lib/content/registry";
import { CATEGORIES } from "@/lib/content/types";
import { getCurrentUser } from "@/lib/auth/session";
import { getCourseProgress, isCourseCompleted } from "@/lib/db/progress";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ curso: string }>;
}): Promise<Metadata> {
  const { curso } = await params;
  const course = getCourse(curso);
  return { title: course ? `${course.title} — CursosTech` : "Curso no encontrado" };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ curso: string }>;
}) {
  const { curso } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=" + encodeURIComponent(`/cursos/${curso}`));

  const course = getCourse(curso);
  if (!course) notFound();

  const category = CATEGORIES.find((c) => c.id === course.category);
  const progress = getCourseProgress(user.id, course.id);
  const completedSet = new Set(
    progress.filter((p) => p.status === "completed").map((p) => p.lesson_id)
  );
  const completedCount = completedSet.size;
  const done = isCourseCompleted(user.id, course.id);
  const totalMin = course.lessons.reduce((a, l) => a + l.durationMin, 0);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/cursos" className="text-sm text-accent hover:underline">
        ← Catálogo
      </Link>

      <header className="glass subtle-shadow mt-4 rounded-3xl p-7">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl text-4xl" style={{ background: `${course.color}22`, border: `1px solid ${course.color}55` }}>
            {course.emoji}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-dim">
              {category?.icon} {category?.name}
            </p>
            <h1 className="text-3xl font-black">{course.title}</h1>
            <p className="text-sm font-semibold text-txt2">{course.subtitle}</p>
          </div>
        </div>
        <p className="mt-4 text-txt2">{course.description}</p>

        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="chip !cursor-default">{course.lessons.length} lecciones</span>
          <span className="chip !cursor-default">≈ {totalMin} min</span>
          <span className="chip !cursor-default">
            {course.lessons.reduce((a, l) => a + l.xp, 0) + 500} XP total
          </span>
          {done && <span className="chip !cursor-default border-ok/50 text-ok">✓ curso completado</span>}
        </div>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h2 className="mb-2 font-bold">🎯 Aprenderás</h2>
          <ul className="space-y-1.5 text-sm text-txt2">
            {course.objectives.map((o, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent">▸</span> {o}
              </li>
            ))}
          </ul>
        </div>
        {course.prerequisites.length > 0 && (
          <div className="glass rounded-2xl p-5">
            <h2 className="mb-2 font-bold">🧰 Requisitos</h2>
            <ul className="space-y-1.5 text-sm text-txt2">
              {course.prerequisites.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent">▸</span> {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Lecciones</h2>
          <span className="text-sm text-txt2">
            {completedCount}/{course.lessons.length} completadas
          </span>
        </div>

        {completedCount > 0 && (
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-edge">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-all"
              style={{ width: `${(completedCount / course.lessons.length) * 100}%` }}
            />
          </div>
        )}

        <ol className="space-y-3">
          {course.lessons.map((lesson, i) => {
            const isDone = completedSet.has(lesson.id);
            const isFirstPending = !isDone && completedSet.size === i;
            return (
              <li key={lesson.id}>
                <Link
                  href={`/cursos/${course.id}/${lesson.id}`}
                  className={`glass card-hover flex items-center gap-4 rounded-2xl p-4 ${
                    isDone ? "opacity-70" : ""
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-black ${
                      isDone
                        ? "bg-ok/15 text-ok"
                        : isFirstPending
                          ? "bg-gradient-to-br from-accent to-accent2 text-[#060a12]"
                          : "bg-surface2 text-dim"
                    }`}
                  >
                    {isDone ? "✓" : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{lesson.title}</p>
                    <p className="truncate text-sm text-dim">{lesson.summary}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-xs text-dim">
                    <span>{lesson.durationMin} min</span>
                    <span className="chip !cursor-default">{lesson.xp} XP</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}