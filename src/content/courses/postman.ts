import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "postman",
  emoji: "📮",
  title: "Postman",
  subtitle: "Postman · APIs · Testing",
  category: "entorno",
  tagline: "Diseña, prueba y documenta APIs sin escribir una sola línea.",
  description:
    "Postman es el patito de goma de las APIs: te deja probar endpoints, guardar colecciones, simular entornos y automatizar tests sin tocar código. Cada día, miles de developers lo usan como herramienta principal de desarrollo backend.",
  objectives: [
    "Enviar peticiones HTTP de todo tipo sin escribir código",
    "Leer y construir headers, params y cuerpos JSON",
    "Organizar tu trabajo con colecciones y variables",
    "Automatizar verificación de respuestas con tests",
    "Conectar el flujo completo API → tests → CI",
  ],
  prerequisites: ["Saber qué es una API (ver el curso MERN o Next.js+BD)."],
  color: "#ff6c37",
  gradient: ["#ff6c37", "#ef5b25"],
  lessons: [
    {
      id: "postman-que-es",
      title: "¿Qué es Postman y por qué un dev lo ama?",
      durationMin: 12,
      summary: "Un cliente HTTP visual para acelerar TODO el ciclo de API.",
      xp: 40,
      blocks: [
        {
          t: "theory",
          md: "**Postman** es un cliente HTTP gráfico. En vez de escribir `curl` cada vez, **apuntas y clicas**: eliges método, URL, headers y body, y ves la respuesta formateada (con introspección de JSON).\n\nLo que permite:\n- Probar tu API mientras la desarrollas.\n- Guardar peticiones en **colecciones** reutilizables.\n- Simular **entornos** (dev/staging/prod) con variables.\n- Escribir **tests** que se ejecutan en cada respuesta.\n- Exportar la colección como **documentación**.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    PM[Postman<br/>cliente visual] -->|"GET /cursos"| API[Tu API]
    API -->|"200 + JSON"| PM
    PM -->|"guardar"| COL[Colecciones]
    PM -->|"tests"| T[Verificación automática]
    COL --> DOC[Documentación]
    T --> CI[CI/CD]`,
          caption: "Postman en el centro del ciclo: pruebo, guardo, documento y automatizo.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "🍔 El método importa",
          md: "Postman trae los 8 métodos HTTP con colores: `GET` (leer), `POST` (crear), `PUT/PATCH` (actualizar), `DELETE` (borrar). Elegir bien el verbo es diseño de API.",
        },
        {
          t: "quiz",
          question: "¿Cuál es el caso de uso principal de Postman?",
          options: [
            "Compilar JavaScript",
            "Probar y explorar APIs de forma visual",
            "Editar archivos de texto",
            "Diseñar logos",
          ],
          correct: 1,
          explanation:
            "Postman es un cliente HTTP: construyes peticiones gráficamente, inspeccionas respuestas y automatizas pruebas.",
        },
      ],
    },
    {
      id: "postman-peticiones",
      title: "Peticiones: métodos, params y bodies",
      durationMin: 16,
      summary: "Domina las piezas de toda llamada HTTP.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Toda petición tiene 4 secciones en Postman:\n\n1. **Método** y **URL**.\n2. **Params**: lo que va en la URL (`?q=rust&page=1`).\n3. **Headers**: metadatos (`Authorization`, `Content-Type`).\n4. **Body**: el contenido (JSON para POST/PUT).\n\n> **Analogía del pedido al restaurante:** la URL es la dirección del restaurante, el método es *'quiero ver el menú'* (GET) o *'quiero pedir'* (POST), los headers son alergias/idioma, y el body es la comanda.",
        },
        {
          t: "code",
          lang: "node",
          title: "Lo que Postman envía por ti",
          md: "Cada clic en Postman se traduce en esto. Lo ejecutamos aquí mismo con un mini-servidor local que responde:",
          code: `const http = require("node:http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  const url = new URL(req.url, "http://localhost");

  // lee el query param
  const q = url.searchParams.get("q") ?? "";

  if (req.method === "GET") {
    return res.end(JSON.stringify({ metodo: "GET", busqueda: q, resultados: ["Rust", "Docker"] }));
  }
  if (req.method === "POST") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const parsed = JSON.parse(body);
      return res.end(JSON.stringify({ metodo: "POST", recibido: parsed }));
    });
    return;
  }
  res.statusCode = 405;
  res.end(JSON.stringify({ error: "método no soportado" }));
});

server.listen(0, "127.0.0.1", async () => {
  const base = "http://127.0.0.1:" + server.address().port;

  // = esto es lo que hace GET en Postman con ?q=devops
  const get = await fetch(base + "/cursos?q=devops").then((r) => r.json());
  console.log("GET con ?q= :", get);

  // = esto es un POST con body JSON
  const post = await fetch(base + "/cursos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: "Terraform", horas: 6 }),
  }).then((r) => r.json());
  console.log("POST con body:", post);

  server.close();
});`,
          run: true,
        },
        {
          t: "quiz",
          question: "¿Dónde iría `?q=devops` en una petición?",
          options: [
            "En el body",
            "En la URL como query params",
            "Solo en POST",
            "En el método",
          ],
          correct: 1,
          explanation:
            "Los query params van en la URL después de `?` y sirven para filtros/paginación. Postman tiene una pestaña 'Params' para gestionarlos.",
        },
      ],
    },
    {
      id: "postman-variables",
      title: "Colecciones, variables y entornos",
      durationMin: 16,
      summary: "Deja de repetirte: parametriza todo.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Dos superpoderes de organización:\n\n- **Colecciones**: carpetas de peticiones que se comparten y documentan.\n- **Variables + entornos**: valores que cambian por contexto. Una variable `{{baseUrl}}` vale `http://localhost:3000` en dev y `https://api.prod.com` en prod.\n\nEscritas `{{nombre}}`, se reemplazan al enviar. Cambias de entorno con un clic.",
        },
        {
          t: "code",
          lang: "ts",
          title: "El concepto de variables",
          code: `// Postman: define {{baseUrl}} una vez, úsala en todas partes
type Entorno = { nombre: string; baseUrl: string; apiKey: string };

const DEV: Entorno = { nombre: "dev", baseUrl: "http://localhost:3000", apiKey: "clave-de-dev" };
const PROD: Entorno = { nombre: "prod", baseUrl: "https://api.tuapp.com", apiKey: "clave-de-prod" };

// una colección usa la variable sin saber con qué entorno corre
const coleccion = {
  nombre: "Cursos API",
  peticiones: [
    "GET {{baseUrl}}/cursos",
    "GET {{baseUrl}}/cursos/{{cursoId}}",
    "POST {{baseUrl}}/cursos  (Authorization: Bearer {{apiKey}})",
  ],
};

for (const env of [DEV, PROD]) {
  console.log("— Entorno:", env.nombre);
  for (const p of coleccion.peticiones) {
    // sustitución de variables
    const resuelto = p
      .replace("{{baseUrl}}", env.baseUrl)
      .replace("{{apiKey}}", env.apiKey)
      .replace("{{cursoId}}", "1");
    console.log("  ", resuelto);
  }
}`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "🔐 Nunca claves reales",
          md: "Usa variables para claves y guarda los entornos de prod con valores dummy. Las claves reales van en tu gestor de secretos, nunca pegadas en una colección compartida.",
        },
        {
          t: "quiz",
          question: "¿Para qué sirve una variable tipo `{{baseUrl}}`?",
          options: [
            "Reemplazar valores según el entorno (dev/prod) sin editar la petición",
            "Cifrar la petición",
            "Crear una base de datos",
            "Acelerar la red",
          ],
          correct: 0,
          explanation:
            "Las variables se resuelven en el envío: cambias de entorno y la misma petición apunta a otra URL sin tocarla.",
        },
      ],
    },
    {
      id: "postman-tests",
      title: "Tests automáticos con Postman",
      durationMin: 16,
      summary: "Verifica respuestas al vuelo y llévalo a tu CI.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Postman corre **tests por petición** con la API de `pm.test`:\n\n```js\npm.test(\"status 200\", () => pm.response.to.have.status(200));\npm.test(\"tiene titulo\", () => pm.response.json().titulo);\n```\n\n- El **Test Runner** ejecuta toda una colección y da el reporte.\n- Con **Newman** (CLI) esos mismos tests corren en tu CI. Misma colección → misma confianza.",
        },
        {
          t: "code",
          lang: "node",
          title: "El patrón de un test Postman en vivo",
          code: `// Mini framework que imita pm.test
const tests = [];
function pmtest(nombre, assert) {
  try {
    assert();
    tests.push({ nombre, ok: true });
  } catch (e) {
    tests.push({ nombre, ok: false, why: e.message });
  }
}

async function probar() {
  // un servidor simulado responde como tu API
  const fakeApi = async () => ({ ok: true, data: [1, 2, 3] });

  const res = await fakeApi();
  const status = 200;

  // Estos serían los tests de Postman:
  pmtest("status es 200", () => { if (status !== 200) throw new Error("esperaba 200"); });
  pmtest("respuesta tiene data", () => { if (!("data" in res)) throw new Error("sin data"); });
  pmtest("data es array de 3", () => { if (res.data.length !== 3) throw new Error("largo != 3"); });
  pmtest("data[0] es 1", () => { if (res.data[0] !== 1) throw new Error("primer != 1"); });

  for (const t of tests) console.log((t.ok ? "✓" : "✗") + " " + t.nombre + (t.why ? "  (" + t.why + ")" : ""));
  console.log("Resultado:", tests.filter((t) => t.ok).length + "/" + tests.length, "tests OK");
}

probar();`,
          run: true,
        },
        {
          t: "callout",
          kind: "info",
          title: "🧪 Test Runner + Newman",
          md: "En Postman: *Run collection* ejecuta todo y genera histograma. En CI: `newman run coleccion.json` reproduce exactamente lo mismo. Tests → CI → deploy verde solo si pasan.",
        },
        {
          t: "quiz",
          question: "¿Qué hace `pm.response.to.have.status(200)`?",
          options: [
            "Cambia el código de la API",
            "Comprueba que la respuesta tenga status 200",
            "Imprime la respuesta",
            "Envía otra petición",
          ],
          correct: 1,
          explanation:
            "Es una aserción de Postman: si la respuesta no es 200, el test falla y el informe lo marca en rojo.",
        },
      ],
    },
    {
      id: "postman-flujo",
      title: "Proyecto: API book + CI listo",
      durationMin: 18,
      summary: "Colección, variables, tests y Newman: el set completo.",
      xp: 65,
      blocks: [
        {
          t: "theory",
          md: "Montamos el kit que usarás en producción:\n\n1. **Colección** `Library API` con 5 peticiones (CRUD de libros).\n2. **Variables** `{{baseUrl}}` y `{{apiKey}}`.\n3. **Tests** por petición (status + esquema).\n4. **Export** a JSON + **Newman** en CI.",
        },
        {
          t: "code",
          lang: "node",
          title: "CRUD en vivo con tests integrados",
          code: `const http = require("node:http");

let libros = [{ id: 1, titulo: "El lenguaje de programación Rust" }];
let seq = 2;

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const m = req.url?.match(/^\\/libros(?:\\/(\\d+))?$/);
  if (!m) { res.statusCode = 404; return res.end("{}"); }

  if (req.method === "GET" && !m[1]) return res.end(JSON.stringify(libros));
  if (req.method === "GET" && m[1]) {
    const libro = libros.find((l) => l.id === Number(m[1]));
    res.statusCode = libro ? 200 : 404;
    return res.end(JSON.stringify(libro ?? {}));
  }
  if (req.method === "POST") {
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => {
      const nuevo = { id: seq++, titulo: JSON.parse(d).titulo };
      libros.push(nuevo);
      res.statusCode = 201;
      return res.end(JSON.stringify(nuevo));
    });
    return;
  }
  res.statusCode = 405;
  res.end("{}");
});

server.listen(0, "127.0.0.1", async () => {
  const base = "http://127.0.0.1:" + server.address().port;
  const checks = [];

  // GET /libros
  const lista = await fetch(base + "/libros");
  checks.push(["GET /libros -> 200", lista.status === 200]);
  const listaJson = await lista.json();
  checks.push(["tiene 1+ libros", Array.isArray(listaJson) && listaJson.length >= 1]);

  // POST /libros
  const creado = await fetch(base + "/libros", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: "Aprendiendo Docker" }),
  });
  checks.push(["POST -> 201", creado.status === 201]);

  // GET /libros/1
  const uno = await fetch(base + "/libros/1");
  checks.push(["GET /libros/1 -> 200 y titulo", (await uno.json()).titulo !== undefined]);

  for (const [n, ok] of checks) console.log((ok ? "✓ " : "✗ ") + n);
  console.log("Summary:", checks.filter(([, ok]) => ok).length + "/" + checks.length + " tests");

  server.close();
});`,
          run: true,
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    COL[Colección Library API] -->|tests| RUN[Test Runner]
    COL -->|"export .json"| NEW[Newman CLI]
    RUN --> REP[Reporte visual]
    NEW --> CI[CI correrá los mismos tests]
    CI -->|verde| DEP[Deploy]`,
          caption: "De la colección al CI: los mismos tests corren en tu pipeline.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "📦 La regla de oro de Postman",
          md: "*Si no está en una colección con variables y tests, no es reproducible.* Guarda, documenta y automatiza: esa colección es la documentación viva de tu API.",
        },
        {
          t: "quiz",
          question: "¿Qué es Newman?",
          options: [
            "Un framework de frontend",
            "El CLI de Postman que ejecuta colecciones en CI",
            "Un tipo de base de datos",
            "Una extensión de VS Code",
          ],
          correct: 1,
          explanation:
            "Newman ejecuta colecciones de Postman desde terminal: perfecto para correr los tests de tu API en el pipeline CI/CD.",
        },
      ],
    },
  ],
};