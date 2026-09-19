import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "vscode",
  emoji: "🧰",
  title: "Visual Studio Code",
  subtitle: "VS Code · Editor · Extensiones",
  category: "entorno",
  tagline: "El editor más usado del mundo por una razón: extensible hasta el infinito.",
  description:
    "Visual Studio Code no es solo un editor: es el ecosistema donde ocurre el desarrollo moderno. Ligero, rápido y capaz de transformarse en tu IDE a medida con una extensión. Dominar VS Code multiplica tu velocidad cada día.",
  objectives: [
    "Navegar VS Code con la paleta de comandos y atajos",
    "Editar a velocidad real: multi-cursor, snippets, split",
    "Elegir extensiones que no 'engordan' tu flujo",
    "Configurar tu editor con settings.json",
    "Usar el terminal integrado, linter y debugger",
  ],
  prerequisites: ["Tener VS Code instalado (o abrirlo al ritmo de las lecciones)."],
  color: "#22a7f0",
  gradient: ["#22a7f0", "#6d5ed3"],
  lessons: [
    {
      id: "vscode-fundamentos",
      title: "Fundamentos e interfaz",
      durationMin: 12,
      summary: "Las 5 zonas del editor y por qué VS Code gana.",
      xp: 40,
      blocks: [
        {
          t: "theory",
          md: "VS Code separa tu pantalla en **cinco zonas**:\n\n1. **Barra de actividad** (izquierda): archivos, búsqueda, control de versiones, extensiones.\n2. **Barra lateral**: la vista activa (Explorador, git, etc.).\n3. **Editor central**: tu código, con pestañas y *splits*.\n4. **Panel inferior**: terminal integrado, problemas, salida.\n5. **Barra de estado**: rama git, errores, lenguaje.\n\n> **Analogía del avión de combate:** la cabina está organizada: instrumentos a la izquierda, controles abajo, ventana al frente. VS Code organiza todo para que nunca busques — solo llegues.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    ACT[Barra <br/>de actividad] --> SIDE[Barra lateral]
    SIDE --> EDIT[Editor central<br/>pestañas y splits]
    PANEL[Panel inferior<br/>terminal, problemas] --> EDIT
    EST[Barra de estado<br/>rama git, errores] --> EDIT`,
          caption: "Las cinco zonas de VS Code y qué vive en cada una.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "⌨️ La regla del editor",
          md: "No memorices 50 atajos: empieza por 5 (abre paleta, cambia archivo, explora, split, terminal) y añade uno nuevo cada día.",
        },
        {
          t: "quiz",
          question: "¿Dónde está el terminal integrado de VS Code?",
          options: [
            "En la barra de actividad superior",
            "En el panel inferior",
            "En una pestaña del navegador",
            "No existe",
          ],
          correct: 1,
          explanation:
            "El panel inferior alberga el terminal integrado, además de problemas y salida. Su atajo por defecto es `` Ctrl+Ñ `` (o `` ^ `` en macOS).",
        },
      ],
    },
    {
      id: "vscode-produccion",
      title: "Atajos que disparan tu velocidad",
      durationMin: 16,
      summary: "Paleta de comandos, multi-cursor y exploración sin mouse.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Tu primera superpotencia es la **Paleta de Comandos** (`Ctrl+Shift+P`): busca CUALQUIER acción de VS Code por nombre. La segunda, el **multi-cursor**: edita muchas líneas a la vez.\n\n| Atajo | Acción |\n|-------|--------|\n| `Ctrl+Shift+P` | Paleta de comandos |\n| `Ctrl+P` | Ir a archivo (escribe parte del nombre) |\n| `Ctrl+Shift+E` | Explorador de archivos |\n| `Ctrl+ñ` | Terminal integrado |\n| `Alt+Click` | Crear cursor extra |\n| `Ctrl+D` | Selecciona siguiente ocurrencia igual |\n| `Ctrl+Shift+Alt+↑/↓` | Multi-cursor vertical |",
        },
        {
          t: "theory",
          md: "**Ejercicio mental de multi-cursor:** tienes 20 líneas de un log y quieres añadir un prefijo a todas. Con `Alt+Click` (o `Ctrl+D` por palabra) editas las 20 a la vez. Lo que harías en 2 minutos, lo haces en 8 segundos.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "🚀 Prométeme un experimento",
          md: "Hoy deja el mouse durante 30 minutos: navega archivos con `Ctrl+P`, conmutas sorces con `Ctrl+Tab` y abre/cierra pestañas con atajos. La incomodidad inicial se paga en horas ahorradas toda la carrera.",
        },
        {
          t: "quiz",
          question: "¿Qué te muestra `Ctrl+Shift+P` en VS Code?",
          options: [
            "Una ventana emergente de errores",
            "La paleta de comandos con TODAS las acciones",
            "La lista de extensiones",
            "El terminal de comandos",
          ],
          correct: 1,
          explanation:
            "La paleta de comandos centraliza todas las acciones del editor y sus extensiones: búscalas por nombre sin memorizarlas.",
        },
      ],
    },
    {
      id: "vscode-extensiones",
      title: "Extensiones que sí importan",
      durationMin: 16,
      summary: "El superpoder real de VS Code: su ecosistema.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Con extensiones, VS Code se vuelve **tu IDE a medida**. Las de oro (los pilares):\n\n| Extensión | Qué aporta |\n|-----------|-----------|\n| **ESLint** | Errores de lint al escribir (rojo en el editor) |\n| **Prettier** | Formateo automático (con import configurado) |\n| **GitLens** | Quién y cuándo tocó cada línea de código |\n| **Error Lens** | Los errores visibles en la línea misma |\n| **Thunder Client** | Probar APIs sin salir del editor |\n| **Mermaid Preview** | Diagramas .mmd en vivo |",
        },
        {
          t: "code",
          lang: "ts",
          title: "settings.json: el control de tu editor",
          md: "Tus preferencias son un JSON (`Ctrl+,` → abrir settings.json). Estos son los que recomiendo como base:",
          code: `// settings.json (fragmento recomendado)
const settings = {
  "editor.formatOnSave": true,          // Prettier al guardar
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"   // autofix ESLint
  },
  "editor.minimap.enabled": true,
  "editor.renderWhitespace": "selection",
  "files.autoSave": "afterDelay",
  "editor.bracketPairColorization": true,
  "workbench.colorTheme": "GitHub Dark",
  "terminal.integrated.fontFamily": "monospace",
  "explorer.compactFolders": false,
  "git.autofetch": true,
};

// Exportalo a tu editor real usando Ctrl+, > "Abrir JSON de ajustes"
console.log("Claves configuradas:", Object.keys(settings).length);`,
          run: true,
        },
        {
          t: "callout",
          kind: "warning",
          title: "🚫 La trampa de instalar todo",
          md: "Cada extensión añade peso y atajos conflictivos. Instala solo cuando tengas una necesidad concreta. Dos años depurando extensiones que no usas son dos años perdidos.",
        },
        {
          t: "quiz",
          question: "¿Qué hace `editor.formatOnSave`?",
          options: [
            "Guarda el archivo cada segundo",
            "Formatea el código automáticamente al guardar",
            "Reordena las extensiones",
            "Cambia el tema",
          ],
          correct: 1,
          explanation:
            "Al guardar, VS Code aplica el formateador configurado (típicamente Prettier): código consistente sin pensarlo.",
        },
      ],
    },
    {
      id: "vscode-terminal",
      title: "Terminal integrado y debugger",
      durationMin: 14,
      summary: "Todo en una ventana: script, terminal y breakpoints.",
      xp: 45,
      blocks: [
        {
          t: "theory",
          md: "El **terminal integrado** (`` Ctrl+ñ ``) hace de VS Code tu centro de comando. La joya: abre la carpeta completa (`` code . ``) y arranca git, npm, docker y tu app en el mismo panel del editor.\n\nEl **debugger** (F5) es la lupa más potente: pausar en un *breakpoint*, inspeccionar variables y avanzar paso a paso por el código.",
        },
        {
          t: "demo",
          title: "Comandos diarios del editor",
          md: "Flujo típico de arranque de cualquier proyecto (pruébalo en tu terminal):",
          lines: [
            {
              prompt: "code . && git status && npm run dev",
              out: ["git pull:", "", "  Already up to date.", "", "> app@0.1.0 dev", "> next dev", "▲ Next.js 16.3.5", "- Local: http://localhost:3000"],
            },
            {
              prompt: "git status",
              out: ["On branch main", "Changes not staged for commit:", "  (use \"git add <file>...\" to update what will be committed)", "", "      modified:   src/app/page.tsx"],
            },
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "🐞 'console.log' está bien… hasta que no",
          md: "Cuando un bug no aparece con logs, el debugger gana: coloca un punto rojo, pausa, y mira todas las variables a la vez. El curso de JS/TS tiene ejercicios perfectos para practicarlo.",
        },
        {
          t: "quiz",
          question: "¿Para qué sirve un breakpoint en el depurador?",
          options: [
            "Para romper el código",
            "Pausar la ejecución e inspeccionar variables en ese punto",
            "Para formatear",
            "Para desplegar",
          ],
          correct: 1,
          explanation:
            "El breakpoint detiene la ejecución justo en esa línea y te deja observar variables, la pila y avanzar paso a paso.",
        },
      ],
    },
    {
      id: "vscode-flujo",
      title: "Tu flujo profesional completo",
      durationMin: 16,
      summary: "ESLint + Prettier + git + terminal: el día a día 2026.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Este es un flujo real de mañana de trabajo:\n\n1. `Ctrl+ñ` → `git pull` y `npm i`.\n2. Abres el archivo con `Ctrl+P`.\n3. Escribes con autocompletado y TypeScript vigilando.\n4. Guardas → *Prettier* formatea, *ESLint* corrige lo automático.\n5. Conflicto de merge → GitLens te muestra quién tocó qué.\n6. Terminas → `git add . && git commit` desde el mismo terminal.",
        },
        {
          t: "diagram",
          mermaid: `flowchart TD
    A[Abrir proyecto<br/>Ctrl+P] --> B[Escribir código<br/>TS vigila]
    B --> C[Guardar<br/>Prettier + ESLint]
    C --> D["git (panel/terminal)"]
    D --> E["commit + push"]
    E --> F[CI corre tests]
    F -->|verde| G[PR lista]
    G --> A`,
          caption: "El bucle del día a día: editar → autoformatear → commitear → CI.",
        },
        {
          t: "code",
          lang: "shell",
          title: "Instalar y verificar tu tooling",
          md: "Este comando se ejecuta de verdad aquí. Si te sale rojo falta algo en tu máquina: es la señal para instalarlo.",
          code: `node -v && npm -v && git --version`,
          run: true,
        },
        {
          t: "callout",
          kind: "danger",
          title: "⚠️ Cuida tus secretos",
          md: "VS Code y git trabajan con tus credenciales: usa el almacén seguro (Keychain/credential manager) y nunca hagas commit de `.env` ni tokens. El curso de GitHub profundiza en esto.",
        },
        {
          t: "quiz",
          question: "¿Qué orden tiene sentido en una mañana típica?",
          options: [
            "Commit → editar → pull",
            "Pull → editar → guardar/autoformatear → commit/push",
            "Push → formatear → pull",
            "Editar → push directo → pull",
          ],
          correct: 1,
          explanation:
            "Primero traes los cambios remotos (pull), trabajas con formatos automáticos y cierras con commit/push una vez verificado.",
        },
      ],
    },
  ],
};