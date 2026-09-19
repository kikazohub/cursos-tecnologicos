import Link from "next/link";
import { getCourses } from "@/lib/content/registry";
import { CATEGORIES, type CategoryId } from "@/lib/content/types";
import { getCurrentUser } from "@/lib/auth/session";
import { getCourseProgress } from "@/lib/db/progress";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const user = await getCurrentUser();
  const courses = getCourses();

  const selected: CategoryId | undefined =
    cat && CATEGORIES.some((c) => c.id === cat) ? (cat as CategoryId) : undefined;

  const filtered = selected ? courses.filter((c) => c.category === selected) : courses;

  const completedLessonsByCourse = new Map<string, number>();
  if (user) {
    for (const c of courses) {
      const prog = getCourseProgress(user.id, c.id);
      completedLessonsByCourse.set(
        c.id,
        prog.filter((p) => p.status === "completed").length
      );
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-3xl font-black">
        Catálogo {selected && CATEGORIES.find((c) => c.id === selected)?.name}
      </h1>
      <p className="mt-1 text-txt2">
        {filtered.length} cursos · haz login para guardar tu progreso y ganar XP.
      </p>

      <div className="mb-8 mt-4 flex flex-wrap gap-2">
        <Link
          href="/cursos"
          className={`chip ${!selected ? "chip-active" : ""}`}
        >
          Todos
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`/cursos?cat=${c.id}`}
            className={`chip ${selected === c.id ? "chip-active" : ""}`}
          >
            {c.icon} {c.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => {
          const done = completedLessonsByCourse.get(course.id) ?? 0;
          const pct = Math.round((done / course.lessons.length) * 100);
          return (
            <Link
              key={course.id}
              href={`/cursos/${course.id}`}
              className="glass card-hover subtle-shadow group rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl text-2xl" style={{ background: `${course.color}22`, border: `1px solid ${course.color}55` }}>
                  {course.emoji}
                </span>
                <span className="chip !cursor-default text-[0.7rem]">
                  {CATEGORIES.find((c) => c.id === course.category)?.icon}{" "}
                  {CATEGORIES.find((c) => c.id === course.category)?.name.split(" ")[0]}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-bold group-hover:text-accent">
                {course.title}
              </h2>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-dim">
                {course.subtitle}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-txt2">{course.tagline}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-dim">
                <span>{course.lessons.length} lecciones · ~{course.lessons.reduce((a, l) => a + l.durationMin, 0)} min</span>
                {user && (
                  <span className={done >= course.lessons.length ? "font-bold text-ok" : ""}>
                    {done >= course.lessons.length ? "✓ Completado" : `${done}/${course.lessons.length}`}
                  </span>
                )}
              </div>
              {user && done > 0 && done < course.lessons.length && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-edge">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent2"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}