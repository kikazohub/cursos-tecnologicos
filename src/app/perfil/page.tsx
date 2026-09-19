import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getCourses } from "@/lib/content/registry";
import { getCourseProgress, getAllLessonProgress } from "@/lib/db/progress";
import {
  LEVELS,
  BADGES,
  getTotalXp,
  getStreak,
  getBadges,
} from "@/lib/gamification";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/perfil");

  const xp = getTotalXp(user.id);
  const streak = getStreak(user.id);
  const owned = new Set(getBadges(user.id));
  const allProgress = getAllLessonProgress(user.id);
  const completedLessons = allProgress.filter((p) => p.status === "completed").length;
  const courses = getCourses();

  let current = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.minXp) current = l;
  const next = LEVELS[current.index + 1] ?? current;
  const pct = Math.min(100, Math.round(((xp - current.minXp) / Math.max(next.minXp - current.minXp, 1)) * 100));

  const perCourse = courses.map((c) => {
    const prog = getCourseProgress(user.id, c.id);
    const done = prog.filter((p) => p.status === "completed").length;
    return {
      course: c,
      done,
      total: c.lessons.length,
      complete: done >= c.lessons.length,
    };
  });
  const completedIds = perCourse.filter((p) => p.complete).map((p) => p.course);
  const totalLessons = courses.reduce((a, c) => a + c.lessons.length, 0);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass subtle-shadow rounded-3xl p-7">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent2 text-2xl font-black text-[#060a12]">
              {user.username.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <h1 className="text-2xl font-black">{user.username}</h1>
              <p className="text-sm text-txt2">
                Nivel {current.index} · <b className="text-txt">{current.name}</b>
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-bold text-txt">{xp} XP</span>
              <span className="text-dim">
                {current.index < LEVELS.length - 1
                  ? `${next.minXp - xp} XP para ${next.name}`
                  : "Nivel máximo alcanzado"}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-edge">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[0.7rem] text-dim">
              {LEVELS.slice(0, 6).map((l) => (
                <span key={l.name} className={xp >= l.minXp ? "font-bold text-accent" : ""}>
                  {l.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-edge bg-bg2 p-4">
              <p className="text-2xl font-black text-txt">{completedLessons}</p>
              <p className="text-xs text-dim">lecciones de {totalLessons}</p>
            </div>
            <div className="rounded-2xl border border-edge bg-bg2 p-4">
              <p className={`text-2xl font-black ${streak.streak > 0 ? "text-warn" : "text-txt"}`}>
                {streak.streak} 🔥
              </p>
              <p className="text-xs text-dim">
                {streak.todayActive ? "racha activa hoy" : streak.streak > 0 ? "racha (haz algo hoy)" : "sin racha"}
              </p>
            </div>
            <div className="rounded-2xl border border-edge bg-bg2 p-4">
              <p className="text-2xl font-black text-ok">{perCourse.filter((p) => p.complete).length}</p>
              <p className="text-xs text-dim">cursos completados</p>
            </div>
          </div>
        </section>

        <section className="glass subtle-shadow rounded-3xl p-7">
          <h2 className="mb-4 text-lg font-bold">🪙 Medallas</h2>
          {owned.size === 0 && (
            <p className="text-sm text-txt2">Completa lecciones para ganar tu primera medalla.</p>
          )}
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((b) => {
              const have = owned.has(b.id);
              return (
                <div
                  key={b.id}
                  title={b.description}
                  className={`rounded-2xl border p-3 text-center transition-all ${
                    have ? "border-accent/40 bg-accent/10" : "border-edge bg-bg2 opacity-40 grayscale"
                  }`}
                >
                  <span className="text-2xl">{have ? b.emoji : "?"}</span>
                  <p className="mt-1 truncate text-[0.7rem] font-semibold text-txt2">{b.name}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-6 glass rounded-3xl p-7">
        <h2 className="mb-4 text-lg font-bold">📚 Tu progreso en los cursos</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {perCourse.map(({ course, done, total, complete }) => (
            <Link
              key={course.id}
              href={`/cursos/${course.id}`}
              className={`rounded-2xl border p-4 transition-all hover:border-edge2 ${
                complete ? "border-ok/40 bg-ok/5" : "border-edge bg-bg2"
              }`}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">
                  {course.emoji} {course.title}
                </span>
                {complete && <span className="font-bold text-ok">✓</span>}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-edge">
                <div
                  className={`h-full rounded-full ${complete ? "bg-ok" : "bg-gradient-to-r from-accent to-accent2"}`}
                  style={{ width: `${Math.round((done / total) * 100)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-dim">{done}/{total} lecciones</p>
            </Link>
          ))}
        </div>
      </section>

      {completedIds.length > 0 && (
        <section className="mt-6 glass rounded-3xl p-7">
          <h2 className="mb-4 text-lg font-bold">🏅 Certificados</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {completedIds.map((course) => (
              <div
                key={course.id}
                className="subtle-shadow rounded-2xl border border-accent/30 bg-gradient-to-br from-surface to-bg2 p-5"
                style={{ boxShadow: `0 0 0 1px ${course.color}33, 0 20px 40px -24px ${course.color}` }}
              >
                <p className="text-[0.7rem] font-bold uppercase tracking-widest text-dim">
                  Certificado de finalización
                </p>
                <p className="mt-1 text-2xl">{course.emoji}</p>
                <h3 className="text-lg font-black">{course.title}</h3>
                <p className="text-sm text-txt2">
                  Otorgado a <b className="text-txt">{user.username}</b>
                </p>
                <p className="mt-3 text-xs text-dim">
                  Curso completo · {course.lessons.length} lecciones dominadas
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}