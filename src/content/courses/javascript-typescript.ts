import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "javascript-typescript",
  emoji: "🟨",
  title: "JavaScript / TypeScript",
  subtitle: "JS · TS · Node",
  category: "lenguajes",
  tagline: "Los lenguajes que dominan el desarrollo web moderno, de principio a fin.",
  description:
    "JavaScript es el único lenguaje que corre nativamente en todos los navegadores y, gracias a Node.js, también en el servidor. TypeScript añade tipos para escribir código a prueba de errores. Aquí aprenderás desde las bases hasta escribir código con tipos sólidos, todo con terminales reales.",
  objectives: [
    "Escribir programas reales en JavaScript y ejecutarlos al instante",
    "Dominar variables, funciones, arrays, objetos y asincronía",
    "Entender el event loop y cómo JavaScript evita bloquearse",
    "Añadir tipos con TypeScript y aprovechar el autocompletado",
    "Construir un mini proyecto de línea de comandos completo",
  ],
  prerequisites: ["Ninguno. Este curso es tu puerta de entrada al desarrollo."],
  color: "#f7df1e",
  gradient: ["#f7df1e", "#e8983a"],
  lessons: [
    {
      id: "js-fundamentos",
      title: "Fundamentos de JavaScript",
      durationMin: 15,
      summary: "Variables, tipos y funciones: los ladrillos de todo programa.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "JavaScript (JS) es el lenguaje de la web. Cada página moderna que ves está hecha, en gran parte, con él. Una idea que debes grabar desde ya:\n\n> **Analogía del café:** Tu navegador es la cafetera, JavaScript es la receta. La misma receta corre en *cualquier* cafetera (Chrome, Firefox, Safari) sin cambiarla. **Un lenguaje, todos los navegadores.**",
        },
        {
          t: "code",
          lang: "node",
          title: "Variables y tipos",
          md: "Declaramos variables con `let` (valor que cambiará) y `const` (valor fijo). El tipo se deduce solo del valor.",
          code: `// let: valor que puede cambiar
let contador = 0;
contador = contador + 1;

// const: valor fijo, no se puede reasignar
const nombre = "Ada";
const edad = 38;
const activo = true;

// Tipos básicos: string, number, boolean, null, undefined
let resultado = null;         // "vacío a propósito"
let sinDefinir;               // undefined: aún no asignado

console.log("Nombre:", nombre, "| Edad:", edad, "| Activo:", activo);
console.log("Operación:", contador * 10 + 5);

// typeof: averigua el tipo dinámicamente
console.log("typeof 42 =", typeof 42);
console.log("typeof 'hola' =", typeof "hola");`,
          run: true,
        },
        {
          t: "code",
          lang: "node",
          title: "Funciones",
          md: "Una función es una receta reutilizable: recibe ingredientes (parámetros) y devuelve un plato (resultado).",
          code: `function calcularPrecio(precioBase, descuento = 0) {
  const precioFinal = precioBase - precioBase * descuento;
  return precioFinal;
}

// Arrow function: la forma moderna y más usada en producción
const doble = (n) => n * 2;

console.log("Precio sin descuento:", calcularPrecio(100));
console.log("Precio con 20%:", calcularPrecio(100, 0.2));
console.log("El doble de 21:", doble(21));`,
          run: true,
        },
        {
          t: "code",
          lang: "node",
          title: "Arrays y objetos",
          md: "Los `arrays` son listas ordenadas; los `objetos` son cajas con etiquetas. Juntos estructuran casi toda la información del mundo real.",
          code: `// Array: lista ordenada
const lenguajes = ["Python", "Rust", "Go"];
lenguajes.push("JS");
console.log("Lista:", lenguajes);
console.log("Primero:", lenguajes[0], "| Total:", lenguajes.length);

// Objeto: caja con etiquetas (clave -> valor)
const usuario = {
  nombre: "Ada",
  rol: "developer",
  tecnologias: lenguajes,
  activo: true,
};

console.log("Usuario:", usuario.nombre, "-", usuario.rol);
console.log("Su tech nº1:", usuario.tecnologias[0]);

// Métodos útiles de arrays
const numeros = [3, 1, 4, 1, 5];
console.log("Ordenados:", [...numeros].sort((a, b) => a - b));
console.log("Suma:", numeros.reduce((acc, n) => acc + n, 0));
console.log("Dobles:", numeros.map((n) => n * 2));`,
          run: true,
        },
        {
          t: "diagram",
          mermaid: `flowchart TD
    A[Tu código JS] --> B{Navegador o Node?}
    B -->|Navegador| C[Chrome / Firefox / Safari]
    B -->|Servidor| D[Node.js]
    C --> E[Manipula la página - DOM]
    D --> E2[API, bases de datos, archivos]
    E --> F[La web interactiva]
    E2 --> F`,
          caption: "JavaScript corre en dos mundos: navegador (interfaz) y Node.js (servidor).",
        },
        {
          t: "callout",
          kind: "tip",
          title: "✨ Regla de oro",
          md: "Piensa en *qué* representa cada dato. Si es una lista → array. Si es una cosa con propiedades → objeto. Si es una acción reutilizable → función. Con esas 3 decisiones resuelves el 90% de los problemas.",
        },
        {
          t: "quiz",
          question: "¿Cuál es la diferencia clave entre `let` y `const`?",
          options: [
            "`let` es más rápido que `const`",
            "`const` no puede reasignarse; `let` sí",
            "`let` solo funciona en navegadores",
            "`const` se usa solo para objetos",
          ],
          correct: 1,
          explanation:
            "`const` declara un valor que no puede ser reasignado (aunque sus propiedades internas sí pueden cambiar). `let` permite reasignar el valor.",
        },
      ],
    },
    {
      id: "js-asincronia",
      title: "Asincronía y el Event Loop",
      durationMin: 20,
      summary: "El superpoder de JavaScript: hacer varias cosas sin bloquearse.",
      xp: 60,
      blocks: [
        {
          t: "theory",
          md: "Cuando pides comida a domicilio, **no te quedas paralizado mirando la puerta**: sigues haciendo vida hasta que llega. Ese es el modelo mental de la asincronía.\n\n> **Analogía del restaurante:** Un cocinero (JavaScript) tiene una sola estufa. Si pide un plato que tarda 10 minutos (una petición a internet), no deja de cocinar: anota el pedido y sigue con lo demás. Cuando el plato está listo, lo sirve y ejecuta la *callback*.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    A[Call Stack<br/>tu código principal] --> B{¿Operación lenta?<br/>fetch, setTimeout}
    B -->|Sí| C[Web APIs / Node APIs]  
    B -->|No| A
    C --> D[Callback Queue<br/>esperando turno]
    D --> E[Event Loop<br/>¿stack vacío?]
    E -->|Sí| A`,
          caption: "El Event Loop solo deja correr la cola de callbacks cuando el stack principal está vacío.",
        },
        {
          t: "code",
          lang: "node",
          title: "Promesas y async/await",
          code: `// Una promesa representa un valor que llegará "en el futuro".
function pedirDatos(segundos) {
  return new Promise((resolve) => {
    setTimeout(() => resolve("datos listos"), segundos * 1000);
  });
}

console.log("1. Inicia pedido...");

async function principal() {
  console.log("2. Pidiendo datos a la red (simulado)...");
  const datos = await pedirDatos(1); // espera sin congelar la app
  console.log("3. Recibido:", datos);
  return "fin";
}

principal().then((r) => console.log("4.", r));
console.log("5. Mientras tanto, seguimos trabajando ✌️");

// Nota: el orden 1, 2, 5, 3, 4 demuestra la asincronía en acción.`,
          run: true,
        },
        {
          t: "code",
          lang: "node",
          title: "Síncrono vs asíncrono",
          md: "Observa la diferencia: un bucle `for` bloquea todo; las promesas no.",
          code: `// TAREA SÍNCRONA: bloquea hasta terminar
console.time("sincrono");
for (let i = 0; i < 10; i++) {
  // cálculo inmediato
}
console.timeEnd("sincrono");

// TAREA ASÍNCRONA: no bloquea
setTimeout(() => console.log("⏱️ Pasaron 1s y esto corre al final"), 1000);
console.log("Esto no espera al setTimeout 👀");`,
          run: true,
        },
        {
          t: "callout",
          kind: "warning",
          title: "🔥 Muerte por bloquear el event loop",
          md: "Si haces un bucle infinito o una tarea síncrona gigante, tu app se congela: ni clics, ni animaciones, ni respuestas. Las tareas lentas **siempre** deben ser asíncronas (promesas, timers, fetch).",
        },
        {
          t: "quiz",
          question: "¿Qué hace el Event Loop?",
          options: [
            "Compila JavaScript más rápido",
            "Mueve callbacks a la pila solo cuando esta está vacía",
            "Ejecuta el código en paralelo con varios hilos",
            "Reserva memoria para variables",
          ],
          correct: 1,
          explanation:
            "JavaScript es de un solo hilo. El Event Loop toma las funciones pendientes de la cola y las ejecuta solo cuando el stack principal está libre.",
        },
      ],
    },
    {
      id: "js-modernos",
      title: "JS moderno en acción",
      durationMin: 18,
      summary: "Destructuring, spread, template strings y filtros reales.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "El JavaScript moderno (ES6+) incluye atajos que verás en *todos* los codebases profesionales. Son la diferencia entre un código viejo y uno elegante.",
        },
        {
          t: "code",
          lang: "node",
          title: "Atajos modernos",
          code: `// Template strings: insertar valores con comillas invertidas
const ciudad = "Lima";
console.log("Hola desde " + ciudad);   // estilo viejo
console.log("Hola desde \$\{ciudad}");  // estilo moderno

// Destructuring: extraer propiedades en variables
const dev = { nombre: "Grace", edad: 37, stack: ["TS", "React"] };
const { nombre, stack } = dev;
console.log("Nombre:", nombre, "| Stack:", stack);

// Spread: copiar y expandir colecciones
const base = [1, 2, 3];
const copia = [...base, 4, 5];
console.log("Spread:", copia);

// Spreading objetos
const usuario2 = { ...dev, activo: true };
console.log("Usuario combinado:", usuario2);`,
          run: true,
        },
        {
          t: "code",
          lang: "node",
          title: "Ejemplo real: filtrar y transformar datos",
          code: `const cursos = [
  { titulo: "Docker", horas: 4, devops: true },
  { titulo: "React", horas: 10, devops: false },
  { titulo: "Kubernetes", horas: 8, devops: true },
  { titulo: "TypeScript", horas: 6, devops: false },
];

// Filtrar solo DevOps
const devops = cursos.filter((c) => c.devops);
console.log("DevOps:", devops.map((c) => c.titulo));

// Ordenar por horas (menor a mayor)
const porHoras = [...cursos].sort((a, b) => a.horas - b.horas);
console.log("Orden por horas:", porHoras.map((c) => c.titulo));

// Reducir a un total
const totalHoras = cursos.reduce((acc, c) => acc + c.horas, 0);
console.log("Horas totales:", totalHoras);

// Buscar el curso más corto
const corto = cursos.reduce((a, b) => (a.horas < b.horas ? a : b));
console.log("Curso más corto:", corto.titulo);`,
          run: true,
        },
        {
          t: "quiz",
          question: "¿Qué hace `const [a, b] = [1, 2]`?",
          options: [
            "Copia el array en a y b",
            "Extrae el primer elemento en a y el segundo en b",
            "Da error porque no se puede reasignar",
            "Crea un objeto con claves a y b",
          ],
          correct: 1,
          explanation:
            "Es *destructuring*: desempaqueta el array, poniendo el índice 0 en la variable a y el 1 en la variable b.",
        },
      ],
    },
    {
      id: "typescript-basico",
      title: "TypeScript: tipos que salvan vidas",
      durationMin: 22,
      summary: "Añade tipos a JavaScript y deja que las herramientas trabajen para ti.",
      xp: 65,
      blocks: [
        {
          t: "theory",
          md: "TypeScript (TS) es **JavaScript con tipos**. El navegador no entiende TS: se *compila* a JS. ¿Para qué sirve? Los tipos convierten errores invisibles en errores detectados **antes de ejecutar**, y tu editor te ofrece autocompletado mágico.\n\n> **Analogía del plano de arquitectura:** JS es construir directamente la casa. TS es dibujar primero el plano: si pones una puerta donde va un muro, el plano te avisa *antes* de empezar a clavar clavos.",
        },
        {
          t: "code",
          lang: "ts",
          title: "Tipos básicos e interfaces",
          md: "Este bloque se transpila de TypeScript a JavaScript y se ejecuta. Prueba a romper un tipo y observa el error.",
          code: `// Tipado explícito
const puntaje: number = 100;
let nombre: string = "Ada";
const terminado: boolean = true;

// Interfaces: contratos de forma
interface Usuario {
  id: number;
  nombre: string;
  rol: "admin" | "lector";   // union type
  activo?: boolean;          // opcional
}

function saludar(u: Usuario): string {
  return "Hola, " + u.nombre + " (rol: " + u.rol + ")";
}

const dev: Usuario = { id: 1, nombre: "Grace", rol: "admin" };
console.log(saludar(dev));

// TypeScript deduce tipos solo
const tecnologias = ["React", "Node", "Go"]; // string[]
console.log(tecnologias.map((t) => t.toUpperCase()));`,
          run: true,
        },
        {
          t: "code",
          lang: "ts",
          title: "Tipos y autocompletado",
          md: "Los tipos no son solo seguridad: son **documentación viva**. Mira cómo `dispositivo.modelo` se autocompleta y valida al instante.",
          code: `// Union types: un valor admite varios tipos
type Id = number | string;
let miId: Id = 123;
miId = "abc-123"; // válido
console.log("ID:", miId);

// Tipos para funciones: describe qué recibe y qué devuelve
function area(radio: number): number {
  return Math.PI * radio ** 2;
}
console.log("Área de círculo r=3:", area(3).toFixed(2));

// generics: tipos "genéricos" que se adaptan
function primero<T>(lista: T[]): T | undefined {
  return lista[0];
}
console.log("Primero:", primero(["a", "b", "c"]));
console.log("Primero num:", primero([10, 20, 30]));`,
          run: true,
        },
        {
          t: "callout",
          kind: "info",
          title: "🧠 TypeScript ES JavaScript",
          md: "Todo lo que aprendiste de JS sigue siendo válido. TS es una capa de anotaciones que se elimina al compilar. El DOM, Node y las bibliotecas tienen tipos que tu editor lee para ayudarte.",
        },
        {
          t: "quiz",
          question: "¿Qué pasa si compilas código TypeScript?",
          options: [
            "Se convierte a Python",
            "Se convierte a JavaScript puro que el navegador entiende",
            "Se ejecuta de forma nativa en el navegador",
            "Se eliminan todos los errores de lógica",
          ],
          correct: 1,
          explanation:
            "TypeScript compila (transpila) a JavaScript. Los tipos desaparecen en el build; se usan para validar en desarrollo y potenciar el editor.",
        },
      ],
    },
    {
      id: "js-proyecto",
      title: "Proyecto: TODO en la terminal",
      durationMin: 25,
      summary: "Construye un mini gestor de tareas con TypeScript, usando todo lo aprendido.",
      xp: 80,
      blocks: [
        {
          t: "theory",
          md: "Cerramos el curso aplicando todo: tipos, arrays, objetos, funciones y flujo real. Vamos a construir un **gestor de tareas (TODO list)** en la terminal. Podrás cambiarlo, mejorarlo y ejecutarlo cuantas veces quieras.",
        },
        {
          t: "code",
          lang: "ts",
          title: "Paso 1: el modelo de datos",
          code: `// El contrato de una tarea: tipos primero
interface Tarea {
  id: number;
  titulo: string;
  completada: boolean;
  prioridad: 1 | 2 | 3; // 1 = urgente, 3 = baja
}

// Estado inicial de la aplicación
const tareas: Tarea[] = [
  { id: 1, titulo: "Aprender TypeScript", completada: true, prioridad: 1 },
  { id: 2, titulo: "Ver el código del Proyecto TODO", completada: false, prioridad: 2 },
];

console.log("Modelo listo:", tareas.length, "tareas iniciales");`,
          run: true,
        },
        {
          t: "code",
          lang: "ts",
          title: "Paso 2: las operaciones",
          code: `interface Tarea { id: number; titulo: string; completada: boolean; prioridad: 1 | 2 | 3 }

let tareas: Tarea[] = [
  { id: 1, titulo: "Aprender TypeScript", completada: true, prioridad: 1 },
  { id: 2, titulo: "Ver el código del proyecto", completada: false, prioridad: 2 },
];

// Agregar una tarea
function agregar(titulo: string, prioridad: 1 | 2 | 3): void {
  const id = tareas.length + 1;
  tareas.push({ id, titulo, completada: false, prioridad });
}

// Marcar como completada
function completar(id: number): void {
  const tarea = tareas.find((t) => t.id === id);
  if (tarea) tarea.completada = true;
  else console.log("No existe la tarea", id);
}

// Listar pendientes
function pendientes(): Tarea[] {
  return tareas.filter((t) => !t.completada);
}

// Resumen: contar y mostrar
agregar("Crear este ejemplo", 1);
completar(2);

console.log("Todas las tareas:");
for (const t of tareas) {
  console.log("  [" + (t.completada ? "x" : " ") + "] #" + t.id + " " + t.titulo + " (p" + t.prioridad + ")");
}

console.log("Pendientes:", pendientes().map((t) => t.titulo));
console.log("Progreso:", tareas.filter((t) => t.completada).length + "/" + tareas.length);`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "💡 Pruébalo tú",
          md: "Edita el código: añade una tarea con `prioridad: 3`, o una función `eliminar(id)`. Ejecútalo de nuevo y mira el resultado. Así se aprende de verdad.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    U[Usuaria] -->|agrega / completa| API[Funciones<br/>agregar, completar]
    API --> EST[Array de Tarea]
    EST --> FILTROS[filter, find]
    FILTROS --> OUT[Resumen en pantalla]
    OUT --> U`,
          caption: "Arquitectura del mini proyecto: funciones puras que manipulan un array tipado.",
        },
        {
          t: "quiz",
          question: "En el proyecto, ¿qué hace `tareas.filter((t) => !t.completada)`?",
          options: [
            "Elimina las tareas completadas del array",
            "Devuelve un nuevo array solo con las tareas no completadas",
            "Cuenta las tareas totales",
            "Ordena las tareas por prioridad",
          ],
          correct: 1,
          explanation:
            "`filter` devuelve un **nuevo array** (sin modificar el original) con los elementos que cumplen la condición: aquí, las que aún no están completadas.",
        },
      ],
    },
  ],
};