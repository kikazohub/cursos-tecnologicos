import Link from "next/link";
import {
  getCourses,
  getTotalCourses,
  getTotalLessons,
} from "@/lib/content/registry";
import { CATEGORIES } from "@/lib/content/types";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const courses = getCourses();
  const totalLessons = getTotalLessons();

  return (
    <div className="relative">
      <section className="bg-grid relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-24 text-center">
          <p className="chip mx-auto mb-5 !cursor-default">
            {getTotalCourses()} cursos · {totalLessons} lecciones · 100% práctico
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            Aprende a programar{" "}
            <span className="text-gradient">haciendo</span>, no viendo videos
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-txt2">
            Terminales de verdad para golang, rust, python y node · diagramas interactivos ·
            quizzes · XP, medallas y rachas. De novato a DevOps en 18 cursos.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/cursos" className="btn btn-primary px-6 py-3 text-sm">
              Explorar catálogo →
            </Link>
            <Link href="/registro" className="btn btn-ghost px-6 py-3 text-sm">
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="mb-2 text-2xl font-bold">Rutas de aprendizaje</h2>
        <p className="mb-8 text-txt2">Cinco categorías, un mismo objetivo: ser mejor dev cada día.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const count = courses.filter((x) => x.category === c.id).length;
            return (
              <Link
                key={c.id}
                href={`/cursos?cat=${c.id}`}
                className="glass card-hover subtle-shadow rounded-2xl p-5"
              >
                <span className="text-3xl">{c.icon}</span>
                <h3 className="mt-3 font-bold">{c.name}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-dim">{c.description}</p>
                <p className="mt-3 text-xs font-semibold text-accent">{count} cursos</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}