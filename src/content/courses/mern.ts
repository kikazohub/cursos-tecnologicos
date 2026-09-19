import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "mern",
  emoji: "⚛️",
  title: "MERN Stack",
  subtitle: "Mongo · Express · React · Node",
  category: "stacks",
  tagline: "Un ecosistema 100% JavaScript para construir apps web completas.",
  description:
    "MERN es la abreviatura de **M**ongoDB, **E**xpress, **R**eact y **N**ode.js: cuatro tecnologías, un solo idioma (JavaScript) de punta a punta. Es el stack favorito de bootcamps y startups porque el frontend y el backend hablan el mismo idioma y los datos viajan como JSON.",
  objectives: [
    "Entender qué aporta cada letra de MERN",
    "Arquitecturar una app en cliente, API y base de datos",
    "Crear una API REST real ejecutada aquí mismo",
    "Pensar en documentos (MongoDB) en lugar de tablas",
    "Montar mentalmente una app completa con este stack",
  ],
  prerequisites: ["Base de JavaScript o haber hecho el curso JS/TS."],
  color: "#00d8ff",
  gradient: ["#00d8ff", "#13c27c"],
  lessons: [
    {
      id: "mern-que-es",
      title: "El ecosistema MERN",
      durationMin: 12,
      summary: "Cuatro piezas, un solo idioma: la arquitectura que lo une todo.",
      xp: 40,
      blocks: [
        {
          t: "theory",
          md: "**MERN** es un *stack*: una receta combinada de tecnologías que se llevan bien entre sí.\n\n- **M — MongoDB**: base de datos de documentos (almacena JSON).\n- **E — Express**: framework backend para Node (monta la API).\n- **R — React**: librería de frontend (pinta la interfaz).\n- **N — Node.js**: runtime de JavaScript en el servidor (todo esto corre en él).\n\nLa magia: **el mismo lenguaje** en todos los pisos. Un JSON sale de MongoDB, viaja por Express y React lo pinta sin conversiones.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    subgraph CLIENTE
        R[React<br/>interfaz] 
    end
    subgraph SERVIDOR
        N[Node.js] --> E[Express<br/>rutas + lógica]
    end
    subgraph DATOS
        M[(MongoDB<br/>documentos JSON)]
    end
    R -->|"fetch /api/..."| E
    E -->|"JSON"| R
    E -->|"CRUD"| M
    M -->|"JSON"| E`,
          caption: "Frontend (React) → API (Express/Node) → Datos (MongoDB). Todo en JavaScript y JSON.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "🗺️ Barrios del stack",
          md: "Divide el mundo en tres barrios: **cliente** (React, lo que ve la usuaria), **servidor** (Express/Node, la lógica) y **datos** (MongoDB, la persistencia). Cada curso que veas encaja en uno de estos barrios.",
        },
        {
          t: "quiz",
          question: "¿Qué aporta Express dentro de MERN?",
          options: [
            "Pintar componentes en el navegador",
            "Montar las rutas HTTP del backend",
            "Guardar documentos en la nube",
            "Compilar TypeScript",
          ],
          correct: 1,
          explanation:
            "Express es el framework HTTP de Node: define rutas como `GET /usuarios` y conecta la API con la base de datos.",
        },
      ],
    },
    {
      id: "mern-api",
      title: "Construye una API REST",
      durationMin: 18,
      summary: "El corazón del stack: rutas, métodos y JSON.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Una **API REST** expone recursos con verbos HTTP:\n\n| Verbo | Acción | Ejemplo |\n|-------|--------|---------|\n| `GET` | Leer | `GET /cursos` |\n| `POST` | Crear | `POST /cursos` |\n| `PUT` / `PATCH` | Actualizar | `PUT /cursos/:id` |\n| `DELETE` | Borrar | `DELETE /cursos/:id` |\n\nAquí mismo levantamos un servidor Node real (sin Express instalado, para que corra en este sandbox: un mini-enrutador con el mismo espíritu) y lo consultamos con `fetch`.",
        },
        {
          t: "code",
          lang: "node",
          title: "API REST en vivo",
          code: `const http = require("node:http");

const cursos = [
  { id: 1, titulo: "Rust", horas: 12 },
  { id: 2, titulo: "Docker", horas: 8 },
];

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  // Mini-router estilo Express
  if (req.method === "GET" && req.url === "/cursos") {
    res.end(JSON.stringify(cursos));
    return;
  }
  if (req.method === "GET" && req.url?.startsWith("/cursos/")) {
    const id = Number(req.url.split("/")[2]);
    const curso = cursos.find((c) => c.id === id);
    if (curso) res.end(JSON.stringify(curso));
    else { res.statusCode = 404; res.end(JSON.stringify({ error: "No existe" })); }
    return;
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Ruta no encontrada" }));
});

server.listen(0, "127.0.0.1", async () => {
  const puerto = server.address().port;
  const base = "http://127.0.0.1:" + puerto;

  const lista = await fetch(base + "/cursos").then((r) => r.json());
  console.log("GET /cursos ->", lista);

  const uno = await fetch(base + "/cursos/1").then((r) => r.json());
  console.log("GET /cursos/1 ->", uno.titulo);

  const noExiste = await fetch(base + "/cursos/99").then((r) => r.json());
  console.log("GET /cursos/99 ->", noExiste);

  server.close();
});`,
          run: true,
        },
        {
          t: "callout",
          kind: "info",
          title: "📦 Express hace esto en 3 líneas",
          md: "El ejemplo usa solo Node para que corra aquí. Con Express el mismo endpoint sería: `app.get('/cursos/:id', (req, res) => res.json(curso))`. El concepto —rutas + JSON— es idéntico al real.",
        },
        {
          t: "quiz",
          question: "¿Qué verbo HTTP y ruta leerías SOLO un curso concreto?",
          options: [
            "`POST /cursos/:id`",
            "`GET /cursos/:id`",
            "`DELETE /cursos/:id`",
            "`PUT /cursos/:id`",
          ],
          correct: 1,
          explanation:
            "`GET` es lectura; el parámetro `:id` identifica el recurso concreto. Es el patrón REST por excelencia.",
        },
      ],
    },
    {
      id: "mern-react",
      title: "React: componentes que se reutilizan",
      durationMin: 18,
      summary: "Piensa en piezas (componentes), no en páginas enteras.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "React construye interfaces como **piezas de Lego**: cada *componente* es una función que recibe *props* (entradas) y devuelve lo que se pinta. El estado (`useState`) guarda datos que cambian y re-renderizan la pieza sola.\n\n> **Analogía del tablero de instrumentos:** cada medidor es un componente. Cuando la temperatura cambia, solo ese medidor se actualiza; el resto del coche no se repinta entero.",
        },
        {
          t: "code",
          lang: "ts",
          title: "El patrón React en JS puro",
          code: `// El patrón de React: componentes = funciones con props
type Props = { nombre: string; nivel: number };

function TarjetaExperimentado({ nombre, nivel }: Props) {
  return {
    clase: "tarjeta",
    texto: \`\${nombre} — nivel \${nivel}\`,
  };
}

// Composicionalidad: piezas dentro de piezas
const catalogo = [
  { nombre: "Rust", nivel: 3 },
  { nombre: "Docker", nivel: 2 },
].map((c) => TarjetaExperimentado(c));

console.log("Catálogo renderizado:", catalogo);
console.log("Nota: en React esto devolvería JSX (<div>...</div>).");`,
          run: true,
        },
        {
          t: "diagram",
          mermaid: `flowchart TD
    APP[App] --> NAV[Navbar]
    APP --> LISTA[CursoList]
    LISTA --> C1[CursoCard nº1]
    LISTA --> C2[CursoCard nº2]
    C1 --> P1[props: titulo, nivel]
    C2 --> P2[props: titulo, nivel]
    style LISTA fill:#102,color:#8fc,stroke:#00d8ff`,
          caption: "El árbol de componentes: datos fluyen de padres a hijos vía props.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "⚛️ Solo 'client' en el navegador",
          md: "React necesita un navegador para pintar. En los cursos de este stack, los fragmentos React se muestran como código, y en el proyecto final montamos una app completa con Next.js (la versión 'React para producción').",
        },
        {
          t: "quiz",
          question: "¿Qué son las 'props' en React?",
          options: [
            "Variables globales secretas",
            "Entradas inmutables que un componente recibe de su padre",
            "Estado temporal interno",
            "Hoja de estilos",
          ],
          correct: 1,
          explanation:
            "Las props son datos que el padre pasa al hijo: inmutables y dirigidas en una sola dirección, lo que hace el flujo predecible.",
        },
      ],
    },
    {
      id: "mern-mongo",
      title: "MongoDB: documentos en lugar de tablas",
      durationMin: 16,
      summary: "Modela datos flexibles como JSON: colecciones y documentos.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "A diferencia de SQL (tablas fijas), **MongoDB** guarda *documentos* JSON en *colecciones*.\n\n- Un **documento** = un objeto con cualquier estructura (`{ _id, titulo, autor, etiquetas: [...] }`).\n- Una **colección** = un cajón de documentos parecidos.\n- **Flexible**: dos documentos pueden tener campos distintos sin romper nada.\n\n> **Analogía de fichas heterogéneas:** SQL es una planilla de Excel con columnas fijas; MongoDB es una caja de fichas donde cada una puede tener los atributos que necesite.",
        },
        {
          t: "code",
          lang: "node",
          title: "El patrón CRUD de Mongo en vivo",
          code: `// Simulamos una colección MongoDB: un array de documentos
let coleccion = [];

function insertOne(doc) {
  const mongo = { _id: coleccion.length + 1, ...doc };
  coleccion.push(mongo);
  return mongo;
}

function find(query = {}) {
  return coleccion.filter((d) =>
    Object.entries(query).every(([k, v]) => d[k] === v)
  );
}

function findOne(query) {
  return find(query)[0] ?? null;
}

insertOne({ titulo: "MERN", autor: "texto", etiquetas: ["web", "frontend"] });
insertOne({ titulo: "Docker", autor: "texto", etiquetas: ["devops"] });
insertOne({ titulo: "Rust", autor: "texto", etiquetas: ["systems"] });

console.log("Todos:", find().map((d) => d.titulo));
console.log("Con etiqueta web:", find({ autor: "texto" }).map((d) => d.titulo));
console.log("findOne:", findOne({ _id: 1 })?.titulo);`,
          run: true,
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    A["{ _id: 1, titulo: 'MERN' }"] --> COL[Colección: cursos]
    B["{ _id: 2, titulo: 'Docker', horas: 8 }"] --> COL
    C["{ _id: 3, titulo: 'Rust' }"] --> COL
    COL --> DB[(MongoDB)]`,
          caption: "Documentos con formas distintas conviven en la misma colección: flexibilidad total.",
        },
        {
          t: "quiz",
          question: "¿Qué guarda MongoDB: filas y tablas, o documentos y colecciones?",
          options: [
            "Filas y tablas como SQL",
            "Documentos en colecciones, tipo JSON",
            "Archivos planos de texto",
            "Solo imágenes",
          ],
          correct: 1,
          explanation:
            "MongoDB es NoSQL orientado a documentos: guarda objetos JSON (documentos) agrupados en colecciones, sin esquema rígido.",
        },
      ],
    },
    {
      id: "mern-proyecto",
      title: "Proyecto: notas full-stack",
      durationMin: 20,
      summary: "Cliente, API y 'base de datos' comunicándose en vivo.",
      xp: 70,
      blocks: [
        {
          t: "theory",
          md: "Unimos las piezas: una API que maneja notas (el backend Express/Node) con su colección en memoria (el papel de MongoDB). Hacemos un CRUD completo: **crear, leer, actualizar y borrar** — el pan de cada día de MERN.",
        },
        {
          t: "code",
          lang: "node",
          title: "CRUD completo de notas",
          code: `const http = require("node:http");

// La "colección MongoDB" en memoria
let notas = [{ id: 1, texto: "Comprar arroz" }];
let siguienteId = 2;

function leerCuerpo(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => resolve(data ? JSON.parse(data) : {}));
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const url = req.url ?? "";

  // GET /notas -> listar
  if (req.method === "GET" && url === "/notas") return res.end(JSON.stringify(notas));

  // POST /notas -> crear
  if (req.method === "POST" && url === "/notas") {
    const body = await leerCuerpo(req);
    const nota = { id: siguienteId++, texto: body.texto ?? "" };
    notas.push(nota);
    res.statusCode = 201;
    return res.end(JSON.stringify(nota));
  }

  // PUT /notas/:id -> actualizar
  const match = url.match(/^\\/notas\\/(\\d+)$/);
  if (req.method === "PUT" && match) {
    const id = Number(match[1]);
    const body = await leerCuerpo(req);
    const nota = notas.find((n) => n.id === id);
    if (nota) { nota.texto = body.texto ?? nota.texto; return res.end(JSON.stringify(nota)); }
    res.statusCode = 404; return res.end("{\\"error\\":\\"no encontrada\\"}");
  }

  // DELETE /notas/:id -> borrar
  if (req.method === "DELETE" && match) {
    const id = Number(match[1]);
    notas = notas.filter((n) => n.id !== id);
    return res.end(JSON.stringify({ ok: true }));
  }

  res.statusCode = 404;
  res.end("{\\"error\\":\\"ruta no encontrada\\"}");
});

server.listen(0, "127.0.0.1", async () => {
  const base = "http://127.0.0.1:" + server.address().port;

  const creada = await fetch(base + "/notas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto: "Aprender React" }) }).then((r) => r.json());
  console.log("Creada:", creada);

  const actualizada = await fetch(base + "/notas/1", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ texto: "Comprar arroz y frijoles" }) }).then((r) => r.json());
  console.log("Actualizada:", actualizada);

  const lista = await fetch(base + "/notas").then((r) => r.json());
  console.log("Lista:", lista);

  await fetch(base + "/notas/2", { method: "DELETE" });
  console.log("Tras borrar id=2:", (await fetch(base + "/notas").then((r) => r.json())).length, "nota(s)");

  server.close();
});`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "🔁 El ciclo que repetirás mil veces",
          md: "Crear → listar → actualizar → borrar. Ese ciclo CRUD es el 80% de cualquier app de todos los tiempos. Si controlas el patrón, controlas MERN.",
        },
        {
          t: "diagram",
          mermaid: `sequenceDiagram
    participant F as Frontend (React)
    participant A as API (Express/Node)
    participant M as "MongoDB"
    F->>A: GET /notas
    A->>M: find()
    M-->>A: documentos
    A-->>F: JSON
    F->>A: POST /notas {texto}
    A->>M: insertOne(doc)
    M-->>A: doc creado
    A-->>F: 201 JSON`,
          caption: "El ciclo de vida de cualquier dato en MERN: React pide, Express media, MongoDB guarda.",
        },
        {
          t: "quiz",
          question: "¿Cuál es el flujo típico de una petición en MERN?",
          options: [
            "React → MongoDB → Express → navegador",
            "React pide → Express gestiona → MongoDB guarda → respuesta JSON a React",
            "MongoDB genera HTML directamente",
            "Node compila React",
          ],
          correct: 1,
          explanation:
            "React (cliente) pide a Express (API) → Express consulta MongoDB → MongoDB devuelve → Express envía JSON → React lo pinta.",
        },
      ],
    },
  ],
};