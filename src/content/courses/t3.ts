import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "t3",
  emoji: "🧊",
  title: "T3 Stack",
  subtitle: "Next · tRPC · TS · Tailwind · Prisma",
  category: "stacks",
  tagline: "La receta moderna para tipado seguro de extremo a extremo.",
  description:
    "El T3 Stack es una receta creada por Theo (t3.gg) para apps TypeScript serias: Next.js, tRPC, Tailwind CSS y Prisma, con el objetivo de que los tipos fluyan **sin fisuras** desde la base de datos hasta el botón del navegador. Menos traducciones, menos bugs.",
  objectives: [
    "Entender por qué el tipado extremo-a-extremo cambia el desarrollo",
    "Ver cómo Next.js estructura rutas y páginas",
    "Descubrir tRPC: funciones del servidor tipadas para el cliente",
    "Modelar datos con Prisma y sus migraciones",
    "Ensamblar mentalmente una app T3 completa",
  ],
  prerequisites: ["Comodidad con TypeScript (curso JS/TS recomendado)."],
  color: "#8b5cf6",
  gradient: ["#8b5cf6", "#3ecf8e"],
  lessons: [
    {
      id: "t3-que-es",
      title: "La filosofía del T3",
      durationMin: 12,
      summary: "Opciones seguras por defecto y tipos en todas partes.",
      xp: 40,
      blocks: [
        {
          t: "theory",
          md: "**T3** = **T**ypeScript-first, **T**ailwind, **T**he rest (el resto). Sus tres principios:\n\n1. **Opiniones seguras** — el stack elige por ti lo mainstream y probado.\n2. **Fallas temprano** — los tipos te atrapan antes de desplegar.\n3. **Seguridad de tipos de punta a punta** — un cambio en la DB se refleja en el autocompletado del botón.\n\n> **Analogía del puente colgante:** cada piso (DB, API, UI) está unido por cables **tipados**. Si un cable tiembla, todo el puente lo sabe al escribir código — no en producción.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    DB[(PostgreSQL)] -->|"Prisma schema<br/>tipado"| API[API tRPC<br/>procedures]
    API -->|"types inferidos<br/>compartidos"| UI[Next.js + React]
    UI -->|"Tailwind<br/>estilo"| UX[UI final]
    UI -->|"llamada tipada<br/>trpc.x.query()"| API
    API -->|"consulta tipada<br/>prisma.x.findMany()"| DB
    style API fill:#102,color:#cbb8ff,stroke:#8b5cf6`,
          caption: "Prisma tipa la DB, tRPC tipa la API, Typescript tipa el cliente: un solo contrato en todo el camino.",
        },
        {
          t: "quiz",
          question: "¿Qué significa 'tipado de extremo a extremo'?",
          options: [
            "Que todos los datos se convierten a string",
            "Que los mismos tipos acompañan los datos desde la BD hasta la UI",
            "Que el código solo corre en los extremos",
            "Que solo hay tipos en el frontend",
          ],
          correct: 1,
          explanation:
            "tRPC + Prisma + TypeScript garantizan que un tipo definido en la base de datos llegue intacto al autocompletado del navegador.",
        },
      ],
    },
    {
      id: "t3-next",
      title: "Next.js: el motor del T3",
      durationMin: 15,
      summary: "Enrutado por archivos y renderizado en el servidor.",
      xp: 45,
      blocks: [
        {
          t: "theory",
          md: "**Next.js** es el framework de React para producción. Dos ideas que dominan:\n\n- **Enrutado por archivos**: `app/curso/[id]/page.tsx` es una url real `/curso/1`.\n- **Componentes servidor vs cliente**: el servidor puede renderizar HTML listo (rápido y SEO) y el navegador añade interactividad.\n\n> **Analogía del restaurante con cocina abierta:** Next sirve platos ya cocinados (HTML listo) y, si haces clic, la cocina te manda más ingredientes rápidos (edge/server).",
        },
        {
          t: "code",
          lang: "ts",
          title: "Estructura de rutas por archivos",
          code: `// app/cursos/[id]/page.tsx      ->  /cursos/rust
// app/cursos/page.tsx           ->  /cursos
// app/api/hello/route.ts        ->  /api/hello (API endpoint)
// app/perfil/layout.tsx         ->  layout compartido para /perfil/*

// Cada 'page.tsx' exporta por defecto un componente React:
const idDeLaRuta = "rust";

const paginas = [
  { ruta: "/", archivo: "app/page.tsx" },
  { ruta: "/cursos/rust", archivo: "app/cursos/[id]/page.tsx" },
  { ruta: "/api/hello", archivo: "app/api/hello/route.ts" },
];

for (const p of paginas) {
  console.log(p.ruta.padEnd(14), "<-", p.archivo);
}

console.log("\\nEl archivo [id] captura el segmento:", idDeLaRuta);`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "🗂️ Un archivo, una ruta",
          md: "En el App Router, la estructura de `app/` *es* el mapa de URLs. `[id]` entre corchetes es un segmento dinámico. Todo lo demás (layouts, loading, error) son convenciones de nombre fijo.",
        },
        {
          t: "quiz",
          question: "¿Qué URL genera `app/cursos/[id]/page.tsx` con `id=go`?",
          options: ["`/cursos/go`", "`/cursos/%5Bid%5D`", "`/id/cursos/go`", "`/go/cursos`"],
          correct: 0,
          explanation:
            "El segmento entre corchetes se rellena con el valor de la URL: `/cursos/go`. Es un segmento dinámico.",
        },
      ],
    },
    {
      id: "t3-trpc",
      title: "tRPC: funciones del servidor tipadas",
      durationMin: 18,
      summary: "Llama al backend como si fuera una función local.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "**tRPC** convierte el backend en **funciones tipadas** que el cliente puede llamar como si estuvieran en el mismo archivo.\n\n- Sin esquemas REST manuales, sin generar clientes a mano.\n- Un `router` con `procedures` (query = lectura, mutation = escritura).\n- El cliente *infiere* los tipos del servidor automáticamente.\n\n> **Analogía del teléfono directo:** en vez de escribir cartas (JSON a mano) a otro país, tRPC te da una llamada directa donde el oyente 'ya conoce' tu idioma: los tipos.",
        },
        {
          t: "code",
          lang: "ts",
          title: "El patrón de tRPC en TS",
          code: `type User = { nombre: string; rol: "admin" | "lector" };

// En el servidor definiríamos router.n/procedure
const usuarios: User[] = [
  { nombre: "Ada", rol: "admin" },
  { nombre: "Grace", rol: "lector" },
];

// 'query' = lectura, 'mutation' = escritura. Esto es tRPC:
const trpcServer = {
  queryUsuarios: (): User[] => usuarios,
  mutationCrearUsuario: (nombre: string): User => {
    const u = { nombre, rol: "lector" as const };
    usuarios.push(u);
    return u;
  },
};

// El CLIENTE llama como función local, con tipos completos:
const lista = trpcServer.queryUsuarios();
console.log("Usuarios:", lista.map((u) => u.nombre));

const nuevo = trpcServer.mutationCrearUsuario("Linus");
console.log("Creado:", nuevo.nombre, "| rol:", nuevo.rol);

console.log("\\n(tRPC real infiere estos tipos automáticamente en tu editor)");`,
          run: true,
        },
        {
          t: "diagram",
          mermaid: `sequenceDiagram
    participant C as Cliente React
    participant S as Servidor tRPC
    C->>S: trpc.usuarios.listar.query()
    S->>S: valida (zod) + ejecuta
    S-->>C: User[] tipado
    C->>S: trpc.usuarios.crear.mutate({nombre})
    S-->>C: User tipado
    Note over C,S: Un cambio en el servidor se refleja<br/>en el autocompletado del cliente`,
          caption: "tRPC llamadas tipadas: el cliente 'sabe' la forma exacta de cada respuesta.",
        },
        {
          t: "quiz",
          question: "En tRPC, ¿qué es una 'query' frente a una 'mutation'?",
          options: [
            "Query lee datos; mutation los modifica",
            "Query es más rápida",
            "Mutation solo usa HTTP DELETE",
            "Son lo mismo",
          ],
          correct: 0,
          explanation:
            "Por convención tRPC separa lectura (query) de escritura (mutation), igual que REST separa GET de POST/PUT/DELETE.",
        },
      ],
    },
    {
      id: "t3-prisma",
      title: "Prisma: el esquema que genera todo",
      durationMin: 18,
      summary: "Define tu modelo de datos una vez y deja que Prisma haga el resto.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "**Prisma** es un ORM (mapea la base de datos a objetos TypeScript). Su magia:\n\n- Escribes el **schema** (modelos) en `schema.prisma`.\n- Prisma genera **tipos** y un **cliente** para consultar con autocompletado.\n- Las **migraciones** evolucionan la BD sin perder datos.\n\n> **Analogía del arquitecto digital:** defines el plano (schema) y Prisma construye el edificio (tablas), genera llaves tipadas (cliente) y gestiona las reformas (migraciones).",
        },
        {
          t: "code",
          lang: "ts",
          title: "Cómo se ve el mundo Prisma",
          code: `// schema.prisma (el "plano")
const modeloPrisma = \`// Ejemplo de schema (concepto)
model Curso {
  id       Int     @id @default(autoincrement())
  titulo   String
  horas    Int     @default(0)
  lecciones Leccion[]
}

model Leccion {
  id        Int    @id @default(autoincrement())
  cursoId   Int
  titulo    String
  curso     Curso  @relation(fields: [cursoId], references: [id])
}\`;

console.log("Schema:\n" + modeloPrisma + "\n");

// El cliente generado te deja consultas tipadas como estas:
type Curso = { id: number; titulo: string; horas: number };

const consultaEjemplo: Curso[] = [
  { id: 1, titulo: "Rust", horas: 12 },
  { id: 2, titulo: "t3", horas: 8 },
];

// prisma.curso.findMany({ where: { horas: { gte: 10 } } })
const result = consultaEjemplo.filter((c) => c.horas >= 10);
console.log("Simula findMany con horas >= 10:", result.map((c) => c.titulo));`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "💾 ¿PostgreSQL, MySQL o SQLite?",
          md: "Prisma soporta varias bases. En este mismo curso raíz (la app que estás usando ahora) la persistencia es SQLite pura; Prisma aporta exactamente esta comodidad a escala PostgreSQL en producción.",
        },
        {
          t: "quiz",
          question: "¿Qué resuelve una 'migración' con Prisma?",
          options: [
            "Borra la base de datos",
            "Aplica cambios del schema a la BD conservando los datos",
            "Renombra los modelos",
            "Convierte SQL a TypeScript",
          ],
          correct: 1,
          explanation:
            "La migración traduce el nuevo estado del schema.prisma a SQL aplicable, preservando los datos existentes.",
        },
      ],
    },
    {
      id: "t3-proyecto",
      title: "Proyecto: ensambla una app T3",
      durationMin: 18,
      summary: "DB → API → UI: el recorrido completo de un dato.",
      xp: 70,
      blocks: [
        {
          t: "theory",
          md: "Es la hora de juntar el viaje: un dato (p. ej. una tarea) recorre **Prisma → tRPC → Next.js → Tailwind**. Un cambio de esquema se nota en el navegador sin escribir traducciones. Ese flujo continuo *es* la promesa del T3. Repasemos las piezas como ensamblando un circuito.",
        },
        {
          t: "diagram",
          mermaid: `flowchart TD
    S[Escribes schema.prisma] -->|migrate| DB[(PostgreSQL)]
    S -->|"genera tipos"| CLT[Prisma Client tipado]
    DB --> CLT
    CLT --> R[tRPC router]
    R -->|infer types| UI[Next.js/React]
    UI -->|Tailwind| UI2[Interfaz bonita]
    UI -->|trpc.query/mutate| R
    R -->|prisma.crud| DB`,
          caption: "El ciclo completo del T3: un único ecosistema de tipos, una sola mentalidad.",
        },
        {
          t: "code",
          lang: "ts",
          title: "Mini demo: el viaje tipado del dato",
          code: `// PRISMA (acceso a datos)
type Tarea = { id: number; titulo: string; hecha: boolean };
let tabla: Tarea[] = [];

// Componentes de una app T3
const prisma = {
  tarea: {
    create: (d: { titulo: string }): Tarea => {
      const t = { id: tabla.length + 1, titulo: d.titulo, hecha: false };
      tabla.push(t);
      return t;
    },
    findMany: (): Tarea[] => [...tabla],
  },
};

const trpc = {
  tareas: {
    crear: (titulo: string) => prisma.tarea.create({ titulo }),
    listar: () => prisma.tarea.findMany(),
  },
};

// La 'UI' (simulamos botones React)
const accionBoton = (titulo: string): void => {
  const creada = trpc.tareas.crear(titulo);
  console.log("Componente recibe tarea con tipos:", creada);
};

accionBoton("Migrar la app a T3");
accionBoton("Añadir Prisma");
console.log("Persistido en la 'DB':", prisma.tarea.findMany());

console.log("\\nEse mismo objeto tipado llega al navegador sin traducciones.");`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "🚀 Tu siguiente paso",
          md: "Crea una app con `npx create-t3-app@latest`. Verás exactamente esto: `schema.prisma`, un `router` trpc y pages de Next, ya interconectados y tipados al instante.",
        },
        {
          t: "quiz",
          question: "¿Cuál es el valor más grande del T3 Stack?",
          options: [
            "Pintar interfaces más bonitas",
            "Un solo sistema de tipos que cruza BD, API y UI",
            "Menos archivos en total",
            "Ejecutarse sin servidor",
          ],
          correct: 1,
          explanation:
            "El tipado extremo-a-extremo es la esencia del T3: el editor te guía de la BD al botón, eliminando traducciones manuales y errores.",
        },
      ],
    },
  ],
};