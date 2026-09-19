import { course as ansible } from "@/content/courses/ansible";
import { course as chatgptClaude } from "@/content/courses/chatgpt-claude";
import { course as cicd } from "@/content/courses/cicd";
import { course as copilot } from "@/content/courses/copilot";
import { course as docker } from "@/content/courses/docker";
import { course as github } from "@/content/courses/github";
import { course as go } from "@/content/courses/go";
import { course as javascriptTypeScript } from "@/content/courses/javascript-typescript";
import { course as kubernetes } from "@/content/courses/kubernetes";
import { course as mern } from "@/content/courses/mern";
import { course as nextjsBd } from "@/content/courses/nextjs-bd";
import { course as postman } from "@/content/courses/postman";
import { course as prometheusGrafana } from "@/content/courses/prometheus-grafana";
import { course as python } from "@/content/courses/python";
import { course as rust } from "@/content/courses/rust";
import { course as t3 } from "@/content/courses/t3";
import { course as terraform } from "@/content/courses/terraform";
import { course as vscode } from "@/content/courses/vscode";
import type { Course } from "@/lib/content/types";

const COURSES: Course[] = [
  javascriptTypeScript,
  python,
  go,
  rust,
  mern,
  t3,
  nextjsBd,
  vscode,
  github,
  postman,
  copilot,
  chatgptClaude,
  docker,
  kubernetes,
  terraform,
  ansible,
  cicd,
  prometheusGrafana,
];

const duplicates = new Set<string>();
const seen = new Set<string>();

for (const course of COURSES) {
  if (seen.has(course.id)) duplicates.add(course.id);
  seen.add(course.id);
  const lessonIds = new Set<string>();
  for (const lesson of course.lessons) {
    if (lessonIds.has(lesson.id)) {
      console.warn(`Registry: lesson duplicada en ${course.id}: ${lesson.id}`);
    }
    lessonIds.add(lesson.id);
    for (const block of lesson.blocks) {
      if (block.t === "quiz" && block.correct >= block.options.length) {
        throw new Error(`Quiz inválido en ${course.id}/${lesson.id}: correct fuera de rango`);
      }
    }
  }
}

if (duplicates.size > 0) {
  throw new Error(`Cursos duplicados en registro: ${[...duplicates].join(", ")}`);
}

export function getCourses(): Course[] {
  return COURSES;
}

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getCoursesByCategory(category: Course["category"]): Course[] {
  return COURSES.filter((c) => c.category === category);
}

export function getLesson(
  courseId: string,
  lessonId: string,
): { course: Course; lesson: Course["lessons"][number]; idx: number } | undefined {
  const course = getCourse(courseId);
  if (!course) return undefined;
  const idx = course.lessons.findIndex((l) => l.id === lessonId);
  if (idx === -1) return undefined;
  return { course, lesson: course.lessons[idx], idx };
}

export function getTotalCourses(): number {
  return COURSES.length;
}

export function getTotalLessons(): number {
  return COURSES.reduce((acc, c) => acc + c.lessons.length, 0);
}