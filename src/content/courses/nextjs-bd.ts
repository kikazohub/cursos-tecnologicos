import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "nextjs-bd",
  emoji: "▲",
  title: "Next.js + Base de Datos",
  subtitle: "Next.js · PostgreSQL · MongoDB",
  category: "stacks",
  tagline: "El estándar actual: apps web rápidas con renderizado híbrido.",
  description:
    "Next.js se ha convertido en la forma estándar de construir la web: páginas estáticas rapidísimas, renderizado en servidor y APIs en un solo proyecto. Aquí aprenderás cómo conectar ese Next.js a bases de datos reales —PostgreSQL (SQL) o MongoDB (documentos)— ejecutando consultas de verdad en este sandbox.",
  objectives: [
    "Entender el renderizado híbrido de Next.js (estático + servidor)",
    "Estructurar una app con enrutado por archivos y route handlers",
    "Ejecutar SQL real y entender las tablas de PostgreSQL",
    "Comparar el modelo de documentos de MongoDB",
    "Diseñar el esquema de una app real",
  ],
  prerequisites: ["Bases de React/TS o el curso JS/TS."],
  color: "#111111",
  gradient: ["#000000", "#38bdf8"],
  lessons: [
    {
      id: "next-render",
      title: "Renderizado híbrido",
      durationMin: 14,
      summary: "Por qué Next.js domina: mezcla estático, servidor y cliente.",
      xp: 45,
      blocks: [
        {
          t: "theory",
          md: "La mayor aportación de Next.js es **elegir cuándo renderizar cada página**:\n\n- **Estático (SSG)**: HTML generado en el build. Instantáneo para el lector (blogs, docs).\n- **Servidor (SSR)**: HTML generado por petición. Ideal para datos personalizados (tu perfil).\n- **Cliente (CSR)**: el navegador pinta con datos que llegan vía API (dashboards en vivo).\n\n> **Analogía del menú de restaurante:** el menú del día (estático) está impreso; el plato a la carta (servidor) se cocina al pedir; y el café con hielo extra (cliente) se ajusta en tu mesa.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    subgraph Estrategia
        A[ESTÁTICO<br/>build time] ==> A2["HTML fijo.<br/>CDN global"]
        B[SERVIDOR<br/>request time] ==> B2["HTML personalizado.<br/>leído de BD"]
        C[CLIENTE<br/>runtime] ==> C2["Interactivo.<br/>fetches a API"]
    end
    A2 --> U[Usuario la ve al instante]
    B2 --> U
    C2 --> U`,
          caption: "Un solo proyecto, tres estrategias. Next.js decide por página (o segmento).",
        },
        {
          t: "callout",
          kind: "tip",
          title: "🧭 Regla práctica",
          md: "Si el contenido es público y cambia poco → estático. Si depende del usuario → servidor. Si cambia cada segundo → cliente. El App Router te permite mezclar todo en la misma app.",
        },
        {
          t: "quiz",
          question: "¿Cuándo tiene sentido el renderizado estático (SSG)?",
          options: [
            "Contenido público que casi no cambia (blog, docs)",
            "El dashboard de cada usuario",
            "Chats en tiempo real",
            "Siempre, sin excepción",
          ],
          correct: 0,
          explanation:
            "SSG genera HTML en el build, ideal para contenido poco cambiante: velocidad máxima con CDN global.",
        },
      ],
    },
    {
      id: "next-api",
      title: "Rutas y API en Next.js",
      durationMin: 16,
      summary: "Un archivo por ruta: páginas y endpoints del mismo lugar.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "En Next.js, **la carpeta `app/` es el mapa de tu web**: cada `page.tsx` es una página y cada `route.ts` un endpoint HTTP. Una sola app: navegación + API + DB, sin dos proyectos distintos.\n\n| Archivo | Sirve |\n|---------|-------|\n| `app/page.tsx` | `/` |\n| `app/cursos/[id]/page.tsx` | `/cursos/rust` |\n| `app/api/cursos/route.ts` | `GET/POST /api/cursos` |\n| `app/api/cursos/[id]/route.ts` | `PUT/DELETE /api/cursos/1` |",
        },
        {
          t: "code",
          lang: "ts",
          title: "El patrón de un route handler",
          md: "Este es un `route.ts` real (simulado aquí para ejecutarlo): recibe una petición y responde JSON, conectándose a lo que sería tu base de datos.",
          code: `type Curso = { id: number; titulo: string };

// Simula tu base de datos
const cursos: Curso[] = [{ id: 1, titulo: "Next.js + BD" }];

// app/api/cursos/route.ts
async function GET_Handler() {
  // en Next: export async function GET() { ... }
  return Response.json({ data: cursos });
}

// app/api/cursos/[id]/route.ts
async function GET_One(id: number) {
  const curso = cursos.find((c) => c.id === id);
  return Response.json({ data: curso ?? null });
}

// app/api/cursos/route.ts (mutation)
async function POST_Handler(cuerpo: { titulo: string }) {
  const nuevo: Curso = { id: cursos.length + 1, titulo: cuerpo.titulo };
  cursos.push(nuevo);
  return new Response(JSON.stringify({ data: nuevo }), { status: 201 });
}

const lista = await GET_Handler().then((r) => r.json());
console.log("GET /api/cursos:", lista);

const uno = await GET_One(1).then((r) => r.json());
console.log("GET /api/cursos/1:", uno.data?.titulo);

const creado = await POST_Handler({ titulo: "Docker" }).then((r) => r.json());
console.log("POST /api/cursos:", creado.data.titulo, "(status 201)");`,
          run: true,
        },
        {
          t: "callout",
          kind: "warning",
          title: "🚨 Cliente vs Servidor",
          md: "Las `route.ts` corren SOLO en el servidor: ahí es donde va la lógica con credenciales, APIs externas y consultas a BD. El cliente nunca debe tocar tus secretos.",
        },
        {
          t: "quiz",
          question: "¿Qué archivo crea el endpoint `POST /api/productos`?",
          options: [
            "`app/productos/route.ts` con `POST`",
            "`app/api/productos/route.ts` con `POST`",
            "`app/api/GET/productos/page.tsx`",
            "Cualquier archivo de la carpeta pages",
          ],
          correct: 1,
          explanation:
            "Los endpoints viven en `app/api/.../route.ts`; dentro exportas funciones `GET`, `POST`, `PUT`, `DELETE` según el verbo.",
        },
      ],
    },
    {
      id: "next-postgres",
      title: "PostgreSQL: SQL de verdad",
      durationMin: 18,
      summary: "Tablas, relaciones y consultas — ejecutando SQL aquí mismo.",
      xp: 60,
      blocks: [
        {
          t: "theory",
          md: "**PostgreSQL** es la base relacional más avanzada del mundo open source. Guarda los datos en **tablas** con columnas fijas y los conecta mediante relaciones. El lenguaje: **SQL**.\n\n> **Analogía del Excel profesional:** cada tabla es una hoja de cálculo con columnas tipadas; las *foreign keys* enlazan filas entre hojas. Riguroso, consistente y veloz a gran escala.",
        },
        {
          t: "code",
          lang: "node",
          title: "SQL real con node:sqlite",
          md: "La sintaxis SQL que ves aquí funciona igual en PostgreSQL. Como el sandbox no monta un servidor PG, ejecutamos el MISMO SQL sobre una base SQLite embebida (SQL estándar): crea tablas, inserta y consulta.",
          code: `const { DatabaseSync } = require("node:sqlite");
const db = new DatabaseSync(":memory:");

// DDL: crear tablas (igual en PostgreSQL)
db.exec(\`
  CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    rol TEXT DEFAULT 'lector'
  );
  CREATE TABLE cursos (
    id INTEGER PRIMARY KEY,
    titulo TEXT NOT NULL,
    autor_id INTEGER REFERENCES usuarios(id)
  );
\`);

// DML: insertar filas
db.prepare("INSERT INTO usuarios (nombre, rol) VALUES (?, ?)").run("Ada", "admin");
db.prepare("INSERT INTO usuarios (nombre, rol) VALUES (?, ?)").run("Grace", "lector");
db.prepare("INSERT INTO cursos (titulo, autor_id) VALUES (?, ?)").run("Rust", 1);
db.prepare("INSERT INTO cursos (titulo, autor_id) VALUES (?, ?)").run("Docker", 1);

// Consultas
const cursos = db.prepare(\`
  SELECT c.titulo, u.nombre AS autor, u.rol
  FROM cursos c JOIN usuarios u ON u.id = c.autor_id
\`).all();

console.table(cursos);

const admins = db.prepare("SELECT nombre FROM usuarios WHERE rol = ?").all("admin");
console.log("Admins:", admins.map((r) => r.nombre));`,
          run: true,
        },
        {
          t: "diagram",
          mermaid: `erDiagram
    USUARIOS ||--o{ CURSOS : "publica"
    USUARIOS {
        int id PK
        string nombre
        string rol
    }
    CURSOS {
        int id PK
        string titulo
        int autor_id FK
    }`,
          caption: "Modelo relacional típico: usuarios publican cursos (uno-a-muchos).",
        },
        {
          t: "quiz",
          question: "¿Qué hace `JOIN` en SQL?",
          options: [
            "Une dos tablas por una columna común",
            "Borra filas duplicadas",
            "Crea una base de datos nueva",
            "Ordena los resultados",
          ],
          correct: 0,
          explanation:
            "`JOIN` cruza filas de dos tablas según una condición (normalmente usas la foreign key), combinando sus columnas.",
        },
      ],
    },
    {
      id: "next-mongo",
      title: "MongoDB frente a PostgreSQL",
      durationMin: 16,
      summary: "Documentos flexibles vs tablas rígidas: cuándo usar cada uno.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Si PostgreSQL es el Excel estructurado, **MongoDB** es la caja de fichas flexibles. La pregunta no es 'cuál es mejor' sino '**cuál encaja con mi modelo de datos**'.\n\n| Criterio | PostgreSQL | MongoDB |\n|----------|-----------|---------|\n| Estructura | Tablas/columnas fijas | Documentos JSON flexibles |\n| Relaciones | Potentes (JOIN) | Embebidas o referencias |\n| Migraciones | Estrictas | Naturales |\n| Ideal para | Finanzas, transacciones | Catálogos, prototipos |",
        },
        {
          t: "code",
          lang: "node",
          title: "Modelado en documentos",
          code: `// En MongoDB un "curso" puede anidar sus lecciones (embebido)
const cursoMongo = {
  _id: 1,
  titulo: "Docker",
  lecciones: [
    { titulo: "Imágenes", duracion: 15 },
    { titulo: "Contenedores", duracion: 20 },
  ],
  etiquetas: ["devops", "infra"],
};

// En SQL habría que crear tabla lecciones + JOIN
console.log("Documento embebido:");
console.log("  Curso:", cursoMongo.titulo);
console.log("  Nº lecciones:", cursoMongo.lecciones.length);
console.log("  Etiquetas:", cursoMongo.etiquetas.join(", "));

// Leer anidados: acceso directo, sin JOIN
const primera = cursoMongo.lecciones[0];
console.log("  Primera lección:", primera.titulo, "min:", primera.duracion);`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "⚖️ La elección pragmática",
          md: "Datos fuertemente relacionados y dinero → PostgreSQL. Datos de forma cambiante o que se leen juntos (tipo catálogo) → MongoDB. Para proyectos personales, cualquiera de los dos te sirve: la app manda.",
        },
        {
          t: "quiz",
          question: "En Mongo, ¿cómo 'leerías' las lecciones dentro de un curso?",
          options: [
            "Con un JOIN a otra colección",
            "Acceso directo al campo embebido `lecciones[]`",
            "Con una tabla intermedia",
            "No se puede",
          ],
          correct: 1,
          explanation:
            "En el modelo de documentos anidas los datos y accedes directamente: `curso.lecciones[0]`. Sin JOIN ni segunda consulta.",
        },
      ],
    },
    {
      id: "next-proyecto",
      title: "Proyecto: blog con PostgreSQL",
      durationMin: 20,
      summary: "Diseña el esquema y consultas de una app editorial real.",
      xp: 70,
      blocks: [
        {
          t: "theory",
          md: "Cerramos con un caso real: un **blog**. Modelo los datos (autores, posts, comentarios), creo las tablas con SQL y lanzo las consultas que una página de blog haría. Todo ejecutándose aquí con SQL estándar.",
        },
        {
          t: "diagram",
          mermaid: `erDiagram
    AUTORES ||--o{ POSTS : "escribe"
    POSTS ||--o{ COMENTARIOS : "recibe"
    AUTORES {
        int id PK
        string nombre
    }
    POSTS {
        int id PK
        string titulo
        int autor_id FK
        datetime publicado_en
    }
    COMENTARIOS {
        int id PK
        int post_id FK
        string cuerpo
    }`,
          caption: "Blog relacional: 3 tablas, 2 relaciones. Consultas con JOIN lo resuelven.",
        },
        {
          t: "code",
          lang: "node",
          title: "Esquema y consultas de un blog",
          code: `const { DatabaseSync } = require("node:sqlite");
const db = new DatabaseSync(":memory:");

db.exec(\`
  CREATE TABLE autores (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL);
  CREATE TABLE posts (id INTEGER PRIMARY KEY, titulo TEXT NOT NULL, autor_id INTEGER REFERENCES autores(id));
  CREATE TABLE comentarios (id INTEGER PRIMARY KEY, post_id INTEGER REFERENCES posts(id), cuerpo TEXT);
\`);

db.prepare("INSERT INTO autores VALUES (?, ?)").run(1, "Ada Lovelace");
db.prepare("INSERT INTO autores VALUES (?, ?)").run(2, "Linus Torvalds");
db.prepare("INSERT INTO posts VALUES (?, ?, ?)").run(1, "Rust en producción", 1);
db.prepare("INSERT INTO posts VALUES (?, ?, ?)").run(2, "Por qué GPLv2", 2);
db.prepare("INSERT INTO posts VALUES (?, ?, ?)").run(3, "Go para APIs", 1);
db.prepare("INSERT INTO comentarios (id, post_id, cuerpo) VALUES (?, ?, ?)").run(1, 1, "Increíble");
db.prepare("INSERT INTO comentarios (id, post_id, cuerpo) VALUES (?, ?, ?)").run(2, 3, "¡Grande!");

// 1) Últimos post con su autor
db.prepare(
  "SELECT p.titulo, a.nombre FROM posts p JOIN autores a ON a.id = p.autor_id ORDER BY p.id DESC"
).all().forEach((r) => console.log("Post:", r.titulo, "| por", r.nombre));

console.log();

// 2) Post con más comentarios
const top = db.prepare(\`
  SELECT p.titulo, COUNT(c.id) AS total
  FROM posts p JOIN comentarios c ON c.post_id = p.id
  GROUP BY p.id ORDER BY total DESC LIMIT 1
\`).get();
console.log("Más comentado:", top.titulo, "con", top.total);

// 3) Autores y cuántos posts tienen
db.prepare(\`
  SELECT a.nombre, COUNT(p.id) AS posts
  FROM autores a LEFT JOIN posts p ON p.autor_id = a.id
  GROUP BY a.id
\`).all().forEach((r) => console.log("Autor:", r.nombre, "->", r.posts, "post(s)"));`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "🗄️ Conectarlo a Next.js",
          md: "En tu app real, estos `db.prepare(...)` vivirían dentro de un `route.ts` (o server action). Next.js se encarga de ejecutarlas en el servidor y pasar el JSON a tus componentes.",
        },
        {
          t: "quiz",
          question: "¿Qué cláusula SQL me da el autor que más posts tiene?",
          options: [
            "`GROUP BY` autor + `COUNT(post)` + ordenar",
            "`DELETE FROM` con filtro",
            "`INSERT` repetido",
            "`CREATE TABLE` nueva",
          ],
          correct: 0,
          explanation:
            "Agrupar por autor y contar con `COUNT()` sobre el JOIN es el patrón canónico para agregados, como en la consulta nº3.",
        },
      ],
    },
  ],
};