import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "copilot",
  emoji: "🪁",
  title: "GitHub Copilot",
  subtitle: "Copilot · Autocompletado · IA en el editor",
  category: "ia",
  tagline: "El copiloto que escribe contigo, no por ti.",
  description:
    "GitHub Copilot es un asistente de IA integrado en tu editor: autocompleta funciones, explica código, genera tests y hasta refactoriza archivos enteros. Aprende a usarlo como un dev senior: como un par que revisa y acelera, no como alguien a quien copiar sin mirar.",
  objectives: [
    "Entender cómo funciona Copilot (y sus límites)",
    "Autocompletar y generar código con buenos comentarios-intenciones",
    "Usar Chat Copilot para explicar, corregir y testear",
    "Escribir prompts eficaces con contexto",
    "Revisar, validar y no confiar a ciegas lo generado",
  ],
  prerequisites: ["VS Code instalado y un lenguaje que estés aprendiendo (lección hecha)."],
  color: "#1f6feb",
  gradient: ["#1f6feb", "#8250df"],
  lessons: [
    {
      id: "copilot-que-es",
      title: "¿Qué es y cómo funciona?",
      durationMin: 12,
      summary: "Un teammate que lee tu editor y te sugiere el siguiente paso.",
      xp: 40,
      blocks: [
        {
          t: "theory",
          md: "**Copilot** es un modelo de lenguaje (LLM) entrenado con código público y conectado a tu editor. Observa **tres señales**: el archivo abierto, los archivos recientes y tu historial. Con eso **predice** qué escribirás y te lo sugiere (*ghost text*).\n\n- `TAB` aceptas la sugerencia; `Esc` la descartas.\n- `Chat` te responde preguntas sobre el código abierto.\n- `Inline Chat` (`Ctrl+I`) genera cambios exactos donde estás.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    EDIT[Editor] --> CTX[Contexto<br/>archivo actual + recientes]
    CTX --> LLM[Modelo copilot]
    LLM --> SUG[Sugerencia en gris<br/>acéptala con TAB]
    CMD[Buen comentario<br/>// ordena y filtra] --> LLM`,
          caption: "Copilot es un predictor con contexto: mejor contexto → mejores sugerencias.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "🎯 La sugerencia NO es la respuesta",
          md: "Piensa en Copilot como un `senior` que sugiere rápido: tú decides. Cuanto mejor escribas *intenciones* (comentarios claros), mejor sugiere. Escribir idioma → escribir código.",
        },
        {
          t: "quiz",
          question: "¿Qué observarías para mejorar las sugerencias de Copilot?",
          options: [
            "El clima",
            "El contexto que le das: comentarios, archivos abiertos, intención",
            "El tamaño de la pantalla",
            "Nada, es aleatorio",
          ],
          correct: 1,
          explanation:
            "Copilot predice desde tu contexto: comentarios descriptivos y archivos bien nombrados producen sugerencias mucho más útiles.",
        },
      ],
    },
    {
      id: "copilot-uso",
      title: "Autocompletar, chat e inline",
      durationMin: 18,
      summary: "Las tres formas de pedir ayuda a Copilot.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Tres superpoderes en VS Code:\n\n1. **Ghost text** — mientras escribes, sugiere lo siguiente: `TAB` para aceptar.\n2. **Chat** (`Ctrl+Alt+I`) — preguntas en contexto: *\"esta función no maneja vacíos\"*. Copilot lee tu archivo y responde.\n3. **Inline Chat** (`Ctrl+I`) — ordena un cambio en la línea: *\"refactoriza a función pura\"* y aplica el patch.\n\nEmpezar explicando **la intención en un comentario** es el truco más rentable.",
        },
        {
          t: "code",
          lang: "ts",
          title: "De comentario a código",
          md: "Así se ve la colaboración: primero la intención, luego (en tu editor) Copilot escribe el cuerpo. Aquí tienes el resultado que Copilot tendería a generar:",
          code: `// Intención que escribirías y Copilot completaría:
// función que agrupa usuarios por rol, y devuelve un mapa rol -> nombre[]

type Usuario = { nombre: string; rol: "admin" | "editor" | "lector" };

function agruparPorRol(usuarios: Usuario[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const u of usuarios) {
    (map[u.rol] ??= []).push(u.nombre);
  }
  return map;
}

const equipo: Usuario[] = [
  { nombre: "Ada", rol: "admin" },
  { nombre: "Grace", rol: "editor" },
  { nombre: "Linus", rol: "admin" },
];

console.log(agruparPorRol(equipo));
// resultado esperado: { admin: ["Ada","Linus"], editor: ["Grace"] }`,
          run: true,
        },
        {
          t: "code",
          lang: "ts",
          title: "Generando tests con Copilot",
          md: "Pregúntale: *\"escribe tests para agruparPorRol\"*. Un buen set que Copilot produce tiene pinta de esto:",
          code: `function agruparPorRol(usuarios: { nombre: string; rol: string }[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const u of usuarios) (map[u.rol] ??= []).push(u.nombre);
  return map;
}

// Simulación mínima de un runner de tests
const pruebas: { nombre: string; fn: () => boolean }[] = [];

pruebas.push({
  nombre: "agrupa por rol",
  fn: () => {
    const r = agruparPorRol([
      { nombre: "A", rol: "admin" },
      { nombre: "B", rol: "lector" },
    ]);
    return JSON.stringify(r) === JSON.stringify({ admin: ["A"], lector: ["B"] });
  },
});

pruebas.push({
  nombre: "vacío devuelve {}",
  fn: () => Object.keys(agruparPorRol([])).length === 0,
});

let ok = 0;
for (const t of pruebas) {
  const pass = t.fn();
  console.log((pass ? "✓ " : "✗ ") + t.nombre);
  if (pass) ok++;
}
console.log(ok + "/" + pruebas.length + " tests pasan");`,
          run: true,
        },
        {
          t: "callout",
          kind: "warning",
          title: "🐛 Los tests también se equivocan",
          md: "Lo generado puede estar mal o ser demasiado superficial. La regla: *el humano firma el commit, no la IA*. Ejecuta tus tests de verdad antes de confiar en los nuevos.",
        },
        {
          t: "quiz",
          question: "¿Qué hace `Ctrl+I` (Inline Chat) en VS Code con Copilot?",
          options: [
            "Abre el navegador",
            "Te permite ordenar un cambio justo donde está el cursor",
            "Borra el archivo",
            "Cierra pestañas",
          ],
          correct: 1,
          explanation:
            "Inline/Ediciones dirige el cambio exactamente al código seleccionado y aplica un diff que aceptas o descartas.",
        },
      ],
    },
    {
      id: "copilot-prompting",
      title: "Darle buen contexto: el arte del prompt",
      durationMin: 18,
      summary: "Las 4 claves para que Copilot acierte a la primera.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Copilot funciona mejor con **instrucciones densas**. Las 4 claves:\n\n1. **Intención explícita**: *\"función que valida emails\"* mejor que *\"email\"*.\n2. **Formato de salida**: *\"devuelve boolean\"* o *\"lanza error si\"*.\n3. **Ejemplos en el contexto**: un par de casos de uso en comentarios.\n4. **Archivos/imagen abiertos**: invoca el chat con tu archivo seleccionado para que lo lea.",
        },
        {
          t: "code",
          lang: "ts",
          title: "Malo vs bueno vs excelente",
          code: `// ❌ Débil: poco contexto
// validar email

// ✅ Mejor: intención + formato
// Devuelve true si el email es válido (regex simple)

function esEmailValido(e: string): boolean {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(e);
}

// 🚀 Excelente: ejemplos + casos borde
// esEmailValido("a@b.co") -> true
// esEmailValido("sin-arroba") -> false
// esEmailValido("") -> false

const casos = [
  ["a@b.co", true],
  ["sin-arroba", false],
  ["", false],
  ["hola@dominio", true],
] as const;

for (const [entrada, esperado] of casos) {
  const got = esEmailValido(entrada);
  console.log((got === esperado ? "✓" : "✗") + " " + JSON.stringify(entrada) + " -> " + got);
}`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "📐 Un comentario = una responsabilidad",
          md: "Describe UNA pieza concreta por comentario. Si pides 'validar y guardar y enviar email', Copilot mezcla responsabilidades. Divide y unirá mejor.",
        },
        {
          t: "quiz",
          question: "¿Cuál es el prompt más efectivo para que Copilot genere una función?",
          options: [
            "Un solo sustantivo sin contexto",
            "Intención + formato de salida + ejemplos de casos borde",
            "Un chiste",
            "Repetir el archivo entero",
          ],
          correct: 1,
          explanation:
            "Contexto denso: qué hace (intención), cómo responde (formato) y qué esperar (ejemplos). Eso desbloquea suggestions de calidad.",
        },
      ],
    },
    {
      id: "copilot-flujo",
      title: "Refactorizar y documentar con IA",
      durationMin: 18,
      summary: "Pide refactors seguros y documentación sin cruzar líneas rojas.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Dos tareas donde Copilot brilla: **refactorizar** (renombrar, extraer funciones, simplificar) y **documentar** (explicar, añadir tests y comentarios tipo JSDoc). El flujo seguro:\n\n1. Selecciona el bloque.\n2. Ordena el cambio (p. ej. *\"extrae la lógica de validación a una función\"*).\n3. **Lee el diff** que propone antes de aceptar.\n4. Ejecuta tests tras cada aceptación.",
        },
        {
          t: "code",
          lang: "ts",
          title: "Refactor guiado: antes y después",
          code: `// ANTES: lógica amontonada que la IA puede extraer
type Pedido = { precio: number; envio: number; tarjeta: boolean };
function total(bd: Pedido[]): number {
  return bd.reduce(
    (acc, p) =>
      acc + (p.tarjeta ? p.precio + p.envio + p.precio * 0.03 : p.precio + p.envio),
    0
  );
}

// DESPUÉS: funciones nombradas y reutilizables (lo que propondría Copilot)
const comision = (p: Pedido) => (p.tarjeta ? p.precio * 0.03 : 0);
const totalPedido = (p: Pedido) => p.precio + p.envio + comision(p);
const totalCaja = (bd: Pedido[]) => bd.reduce((acc, p) => acc + totalPedido(p), 0);

const caja: Pedido[] = [
  { precio: 100, envio: 10, tarjeta: true },
  { precio: 50, envio: 5, tarjeta: false },
];
console.log("Antes igual que después:", total(caja) === totalCaja(caja));`,
          run: true,
        },
        {
          t: "callout",
          kind: "warning",
          title: "🔴 Líneas rojas de la IA",
          md: "Nunca aceptes a ciegas: código con datos sensibles, auth o dinero requiere revisión humana doble. La IA acelera, no certifica.",
        },
        {
          t: "quiz",
          question: "¿Cuál es el paso más importante tras aceptar un refactor de Copilot?",
          options: [
            "Borrar los tests",
            "Ejecutar los tests y revisar el diff",
            "Commitear sin mirar",
            "Desinstalar VS Code",
          ],
          correct: 1,
          explanation:
            "El flujo seguro es: lee el diff propuesto → acepta → corre tests. La confianza se construye con verificación, no con fe.",
        },
      ],
    },
    {
      id: "copilot-etica",
      title: "IA con criterio: código y licencias",
      durationMin: 14,
      summary: "Usa la IA como acelerador, no como oráculo.",
      xp: 45,
      blocks: [
        {
          t: "theory",
          md: "Copilot aprende de repositorios públicos. Tres consideraciones prácticas:\n\n1. **Código que aún no entiendes** = deuda. Usa la IA para *aprender* de su respuesta, no para copiarla.\n2. **Empresas** suelen exigir configurar filtros de *sugerencias duplicadas* (licencia copyleft).\n3. **El keyboard-heavy trabaja en equipo**: comenta la intención, acepta limpio, revisa con tests, commit con mensaje.",
        },
        {
          t: "diagram",
          mermaid: `flowchart TD
    PROMPT[Intención clara] --> SUG[Sugerencia]
    SUG --> REV{¿La entiendo?}
    REV -->|no| EXT[Buscar en docs / preguntar]
    REV -->|sí| TEST[Tests + diff]
    TEST -->|pasa| COMMIT[Commit con mensaje claro]
    TEST -->|falla| AJUS[Ajustar prompt / arreglar]`,
          caption: "El circuito responsable: intención → revisión activa → verificar → commit.",
        },
        {
          t: "callout",
          kind: "danger",
          title: "🧠 Tu cerebro sigue siendo la parte cara",
          md: "La IA da respuestas *plausibles*, no *correctas*. Si no sabes si está bien, ese conocimiento es tuyo antes de ponerlo en producción. Pregunta '¿por qué?' hasta entender.",
        },
        {
          t: "quiz",
          question: "¿Cuál es una buena práctica al integrar código generado?",
          options: [
            "Commitearlo sin revisarlo",
            "Entenderlo, verificarlo con tests y revisar el diff",
            "Rechazarlo siempre",
            "Evitar comentarios",
          ],
          correct: 1,
          explanation:
            "El criterio final es tuyo: compréndelo, pruébalo y revísalo. La IA es una copiloto; el capitán eres tú.",
        },
      ],
    },
  ],
};