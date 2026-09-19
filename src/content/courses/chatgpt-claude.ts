import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "chatgpt-claude",
  emoji: "🤖",
  title: "ChatGPT / Claude",
  subtitle: "LLMs · Prompting · Asistencia dev",
  category: "ia",
  tagline: "Los asistentes conversacionales que cambian cómo se programa.",
  description:
    "ChatGPT y Claude son modelos de lenguaje (LLMs) que razonan sobre código, lo refactorizan, explican y documentan. No son buscadores: son *colegas que contestan*. Aprender a dialogar con ellos —y a saber cuándo desconfiar— es hoy una habilidad dev esencial.",
  objectives: [
    "Entender qué hace (y qué no sabe) un LLM",
    "Escribir prompts que aciertan: rol, contexto, formato",
    "Usar IA para depurar y refactorizar con criterio",
    "Generar documentación y tests de calidad",
    "Integrar un flujo dev+IA seguro en tu día a día",
  ],
  prerequisites: ["Cualquier lenguaje que estés aprendiendo; mucha curiosidad."],
  color: "#10a37f",
  gradient: ["#10a37f", "#d97757"],
  lessons: [
    {
      id: "llm-que-es",
      title: "El modelo mental del LLM",
      durationMin: 14,
      summary: "Predictor experto de lenguaje, no sabio infalible.",
      xp: 45,
      blocks: [
        {
          t: "theory",
          md: "Un **LLM** (modelo de lenguaje grande, como GPT o Claude) predice la siguiente palabra más plausible dado el texto anterior — pero a escala y con razonamiento sorprendente. Implicaciones prácticas:\n\n- **Es probabilístico**: dos respuestas a la misma pregunta pueden diferir.\n- **Su conocimiento se congela** en el entrenamiento y puede estar desactualizado.\n- **Alucina**: inventa APIs, versiones y archivos que no existen.\n- Con **contexto** y **rol** mejora muchísimo (es un excelente 'actor').",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    P[Tu prompt] --> LLM[Modelo<br/>predice el texto más plausible]
    LLM --> R1[Respuesta A]
    LLM --> R2[Respuesta B]
    R1 --> OK{¿Fiable?<br/>verificar docs + tests}
    R2 --> OK
    OK -->|no| H[Preguntar mejor<br/>o buscar la doc real]`,
          caption: "La salida del LLM es plausible, no automáticamente cierta: siempre hay que verificar.",
        },
        {
          t: "callout",
          kind: "danger",
          title: "💥 Las alucinaciones más comunes en dev",
          md: "Versiones de paquetes inventadas, métodos que no existen, funciones deprecated como si fueran recientes. La regla de oro: **cada API que sugiera, compruébala en la doc oficial**.",
        },
        {
          t: "quiz",
          question: "¿Qué es una 'alucinación' de un LLM?",
          options: [
            "Un mensaje de error del sistema",
            "Una respuesta inventada y plausible pero falsa",
            "Un modo de ahorro de batería",
            "Un bug del navegador",
          ],
          correct: 1,
          explanation:
            "El modelo puede 'confabular' información que suena correcta pero es inexacta: nombres, versiones, APIs. Verificación obligatoria.",
        },
      ],
    },
    {
      id: "llm-prompting",
      title: "Prompts que aciertan",
      durationMin: 18,
      summary: "Rol, contexto y formato: la fórmula ganadora.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "La **fórmula del prompt profesional**:\n\n1. **Rol** — *\"Actúa como un dev backend senior.\"*\n2. **Contexto** — tu stack, versión, la tarea concreta.\n3. **Tarea + restricciones** — *\"refactoriza con TypeScript, sin dependencias nuevas\"*.\n4. **Formato de salida** — *\"responde en 5 bullets con ejemplos\"*.\n\nAdemás: **una sola tarea por prompt**, y si algo falla, pide **iterar**: *\"más sencillo\", \"con otro enfoque\", \"explica cada línea\"*.",
        },
        {
          t: "code",
          lang: "ts",
          title: "De prompt vago a prompt quirúrgico",
          code: `// Prompt ❌  "explícame mi código"
// Prompt ✅  "Actúa como senior de Node. Explica en 3 bullets
// qué hace esta función, qué edge cases no maneja, y como
// la refactorizarías. Máximo 5 líneas."

type Libro = { id: number; titulo: string; anio: number };
function buscarPorAnio(libros: Libro[], anio: number): Libro[] {
  return libros.filter((l) => l.anio === anio);
}

// Lo que un buen LLM notaría (pista de edge cases):
const casos = [
  [1984, 1],   // años existentes
  [0, 0],      // año vacío/cero
];

for (const [anio, esperados] of casos) {
  const resultado = buscarPorAnio([
    { id: 1, titulo: "1984", anio: 1984 },
    { id: 2, titulo: "Algo", anio: 0 },
  ], anio);
  console.log("año " + anio + " ->", resultado.length + " resultados (esperado " + esperados + ")");
}`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "🎭 El rol cambia la respuesta",
          md: "'Actúa como un code reviewer exigente' produce críticas sinceras; 'explica como a un rookie' produce tutoriales paso a paso. El idioma del prompt determina la calidad.",
        },
        {
          t: "quiz",
          question: "¿Cuál es el primer elemento de un prompt profesional?",
          options: [
            "El formato de salida",
            "El rol que queremos que asuma",
            "Un emoji",
            "La fecha actual",
          ],
          correct: 1,
          explanation:
            "Darle un rol (dev senior, reviewer, tutor) alinea su 'voz' y criterio desde el inicio; luego contexto, tarea y formato.",
        },
      ],
    },
    {
      id: "llm-debug",
      title: "Depurar y refactorizar con IA",
      durationMin: 18,
      summary: "Convierte errores en preguntas y fragmenta el problema.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "El flujo que uso ante un bug:\n\n1. **Pega el error EXACTO** (no 'no funciona').\n2. Da **stack completo** + versión del lenguaje + archivo mínimo.\n3. Pide **hipótesis**, no la solución única: *\"¿qué dos causas probables explican esto?\"*.\n4. Aplica una, testea, repite.\n\nCon Copilot/Claude en el editor, además puedes pedir el diff del refactor y aceptarlo pieza a pieza.",
        },
        {
          t: "code",
          lang: "ts",
          title: "Prompt de debbuging de calidad",
          code: `type Producto = { nombre: string; precio: number; stock: number };
const carrito: Producto[] = [
  { nombre: "Teclado", precio: 45, stock: 5 },
  { nombre: "Mouse", precio: 20, stock: 0 },  // sin stock
];

// BUG reportado: se vende aunque stock sea 0
function agregarAlCarrito(lista: Producto[], p: Producto): Producto[] {
  if (p.stock > 0) lista.push(p);
  return lista;
}

// Prompt estrella:
// "Hay un bug: se está vendiendo con stock 0. stack: [...]
//  Pega el error exacto, da el archivo mínimo y pide:
//  - 2 causas probables
//  - el fix más pequeño que no rompa nada"

const venta = agregarAlCarrito(carrito, { nombre: "Mouse", precio: 20, stock: 0 });
console.log("Venta con stock 0 (debería bloquearse):", carrito.length === venta.length ? "protegido ✅" : "BUG: cuela el Mouse");
if (venta.length === carrito.length) console.log("Fix aplicado: el control de stock funciona.");`,
          run: true,
        },
        {
          t: "callout",
          kind: "info",
          title: "🧪 Reproducción mínima",
          md: "Antes de preguntar a la IA, reduce el bug a su mínimo: 10 líneas que fallan solas. La IA (y tú) resolveréis 3 veces más rápido con un caso mínimo reproducible.",
        },
        {
          t: "quiz",
          question: "¿Cómo pedirías ayuda con un bug para obtener la mejor respuesta?",
          options: [
            "\"No funciona, arreglalo\"",
            "El error exacto, versión, caso mínimo y pedir hipótesis",
            "Un captura borrosa de la pantalla",
            "Sin contexto, imagínatelo",
          ],
          correct: 1,
          explanation:
            "Contexto completo + caso mínimo + petición de hipótesis: eso convierte a un LLM en un depurador eficaz en vez de un adivino.",
        },
      ],
    },
    {
      id: "llm-documentar",
      title: "Documentar, testear y explicar",
      durationMin: 18,
      summary: "Usa IA para convertir código opaco en equipo autodocumentado.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Tres tareas que la IA hace muy bien:\n\n- **Explicar** un archivo ajeno (onboarding de código).\n- **Generar docs**: JSDoc/TSDoc, README o resumen de cambios.\n- **Crear tests**: casos felices, bordes y error.\n\nLa trampa: la explicación puede ser plausible pero incorrecta respecto a TU versión. Pide siempre *cita de línea*, y contrasta.",
        },
        {
          t: "code",
          lang: "ts",
          title: "De código opaco a documentado + test",
          code: `// ANTES: nadie sabe qué hace esto
function f(a: number[]): number {
  return a.reduce((x, y) => x + y, 0) / Math.max(a.length, 1);
}

// DESPUÉS (lo que pedirías: JSDoc + tests de bordes)
/** Calcula el promedio de un array de números.
 *  @param a valores numéricos (puede estar vacío)
 *  @returns promedio, o 0 si el array está vacío
 */
function promedio(a: number[]): number {
  return a.reduce((x, y) => x + y, 0) / Math.max(a.length, 1);
}

const casos: [number[], number][] = [
  [[4, 8], 6],
  [[], 0],
  [[7], 7],
];

let ok = 0;
for (const [input, esperado] of casos) {
  const got = promedio(input);
  const pass = got === esperado;
  console.log((pass ? "✓" : "✗") + " promedio(" + JSON.stringify(input) + ") = " + got);
  if (pass) ok++;
}
console.log("Tests: " + ok + "/" + casos.length + " correctos");`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "📄 Genera el README, pero edítalo",
          md: "Que la IA escriba la primera versión del README es fantástico; publicarlo sin revisarlo es un clásico. Los READMEs mal informados generan más preguntas de las que responden.",
        },
        {
          t: "quiz",
          question: "¿Qué incluye un buen JSDoc generado por IA?",
          options: [
            "Solo el nombre de la función",
            "Qué hace, parámetros, retorno y casos bordes",
            "Una foto de la empresa",
            "El historial de commits",
          ],
          correct: 1,
          explanation:
            "JSDoc útil describe propósito, tipos de parámetros y retorno, y avisa de casos especiales (como el array vacío).",
        },
      ],
    },
    {
      id: "llm-flujo",
      title: "Tu flujo dev + IA en 2026",
      durationMin: 16,
      summary: "El circuito completo: idear, implementar, verificar, documentar.",
      xp: 50,
      blocks: [
        {
          t: "diagram",
          mermaid: `flowchart LR
    I[Ideas y plan<br/>IA como sparring] --> I2[Implementar<br/>Copilot sugiere + diffs]
    I2 --> V[Verificar<br/>tests + revisión humana]
    V --> D[Documentar<br/>IA redacta, tú validas]
    D --> R[Refactor<br/>IA propone, diff revisado]
    R --> I
    V -.->|falla| I2`,
          caption: "El círculo productivo humano+IA: planificar con IA, codificar en pareja, verificar siempre.",
        },
        {
          t: "theory",
          md: "Mi marco el día a día con ChatGPT/Claude:\n\n- **Idea**: preguntar *'¿cómo enfocarías esto?'* antes de escribir la primera línea.\n- **Implementar**: Copilot autocompleta; yo reviso cada diff.\n- **Verificar**: tests DE VERDAD (no los inventados por la IA).\n- **Documentar**: pedir draft, corregir.\n- **Repetir**: con cada iteración, más contexto y mejor respuesta.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "🏁 La habilidad del futuro es el criterio",
          md: "Saber qué preguntar, cuándo desconfiar y cómo verificar: eso es lo que ninguna IA sustituye. Tu reputación fue, es y será 'revisar bien', no 'producir rápido sin mirar'.",
        },
        {
          t: "quiz",
          question: "En el flujo dev+IA, ¿qué parte SIEMPRE debe ser humana?",
          options: [
            "La redacción del README",
            "La revisión y verificación final del código",
            "La generación de ids",
            "Los nombres de variables",
          ],
          correct: 1,
          explanation:
            "La IA acelera idear, escribir, documentar y refactorizar; la verificación (tests + criterio) es responsabilidad humana intransferible.",
        },
      ],
    },
  ],
};