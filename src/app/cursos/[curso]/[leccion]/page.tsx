import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getLesson, getTotalLessons } from "@/lib/content/registry";
import { getCurrentUser } from "@/lib/auth/session";
import { getLessonProgress } from "@/lib/db/progress";
import { BlockRenderer } from "@/components/BlockRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ curso: string; leccion: string }>;
}): Promise<Metadata> {
  const { curso, leccion } = await params;
  const found = getLesson(curso, leccion);
  return { title: found ? `${found.lesson.title} — CursosTech` : "Lección no encontrada" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ curso: string; leccion: string }>;
}) {
  const { curso, leccion } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=" + encodeURIComponent(`/cursos/${curso}/${leccion}`));
  }

  const found = getLesson(curso, leccion);
  if (!found) notFound();
  const { course, lesson, idx } = found;

  const progress = getLessonProgress(user.id, course.id, lesson.id);
  const isCompleted = progress?.status === "completed";
  const prev = idx > 0 ? course.lessons[idx - 1] : null;
  const next = idx < course.lessons.length - 1 ? course.lessons[idx + 1] : null;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <nav className="mb-2 flex flex-wrap items-center gap-2 text-xs text-dim">
        <Link href="/cursos" className="hover:text-accent">Cursos</Link>
        <span>/</span>
        <Link href={`/cursos/${course.id}`} className="hover:text-accent">{course.title}</Link>
        <span>/</span>
        <span className="text-txt2">{lesson.title}</span>
      </nav>

      <header className="mb-1 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-dim">
            Lección {idx + 1} de {course.lessons.length}
          </p>
          <h1 className="text-2xl font-black">
            {course.emoji} {lesson.title}
          </h1>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-dim">
          <span className="chip !cursor-default">{lesson.xp} XP</span>
          {isCompleted && <span className="font-bold text-ok">✓ completada</span>}
        </div>
      </header>
      {!isCompleted && (
        <p className="mt-3">
          <span className="chip">
            💡 Completa el mini quiz (página abajo) para ganar {lesson.xp} XP
          </span>
        </p>
      )}

      <div className="mt-8 space-y-8">
        {lesson.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} courseId={course.id} lessonId={lesson.id} lessonXp={lesson.xp} />
        ))}
      </div>

      <div className="mt-12 flex items-stretch justify-between gap-3">
        {prev ? (
          <Link href={`/cursos/${course.id}/${prev.id}`} className="btn btn-ghost flex-1 px-4 py-3 text-sm">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/cursos/${course.id}/${next.id}`} className="btn btn-primary flex-1 px-4 py-3 text-sm">
            {next.title} →
          </Link>
        ) : (
          <Link href={`/cursos/${course.id}`} className="btn btn-primary flex-1 px-4 py-3 text-sm">
            Curso completado — volver 🎉
          </Link>
        )}
      </div>

      <p className="mt-10 text-center text-[0.7rem] text-dim">
        {course.id}/{lesson.id} · {getTotalLessons()} lecciones en el catálogo
      </p>
    </div>
  );
}