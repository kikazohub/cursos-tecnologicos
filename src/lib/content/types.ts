export type CategoryId = "lenguajes" | "stacks" | "entorno" | "ia" | "devops";

export type ExecLang = "node" | "python" | "go" | "rust" | "shell";

export type CodeLang =
  | ExecLang
  | "ts"
  | "js"
  | "yaml"
  | "json"
  | "dockerfile"
  | "md"
  | "text"
  | "sh"
  | "bash"
  | "ini"
  | "hcl";

export type Block =
  | { t: "theory"; md: string }
  | {
      t: "code";
      lang: CodeLang;
      title?: string;
      md?: string;
      code: string;
      run?: boolean;
      files?: Record<string, string>;
    }
  | { t: "terminal"; title?: string; md?: string; cmd: string }
  | {
      t: "demo";
      title?: string;
      md?: string;
      lang?: "sh" | "bash" | "ps";
      lines: Array<{ prompt: string; out?: string[]; note?: string }>;
    }
  | { t: "diagram"; md?: string; mermaid: string; caption?: string }
  | {
      t: "callout";
      kind: "info" | "tip" | "warning" | "danger";
      title?: string;
      md: string;
    }
  | {
      t: "quiz";
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    };

export interface Lesson {
  id: string;
  title: string;
  durationMin: number;
  summary: string;
  blocks: Block[];
  xp: number;
}

export interface Course {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  category: CategoryId;
  tagline: string;
  description: string;
  objectives: string[];
  prerequisites: string[];
  color: string;
  gradient: [string, string];
  lessons: Lesson[];
}

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "lenguajes",
    name: "Lenguajes de Programación",
    icon: "⌨️",
    description:
      "Los bloques con los que construimos todo el software moderno.",
  },
  {
    id: "stacks",
    name: "Stacks Tecnológicos",
    icon: "🛠️",
    description:
      "Combinaciones de tecnologías que funcionan juntas en producción.",
  },
  {
    id: "entorno",
    name: "Entorno de Desarrollo",
    icon: "💻",
    description:
      "Las herramientas que usas todos los días para escribir y compartir código.",
  },
  {
    id: "ia",
    name: "Herramientas de IA",
    icon: "🤖",
    description:
      "Asistentes inteligentes que multiplican tu productividad como dev.",
  },
  {
    id: "devops",
    name: "DevOps e Infraestructura",
    icon: "☁️",
    description:
      "Despliega, escala y monitoriza tus aplicaciones como un profesional.",
  },
];