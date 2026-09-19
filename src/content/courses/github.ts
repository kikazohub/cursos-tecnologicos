import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "github",
  emoji: "🐙",
  title: "GitHub",
  subtitle: "Git · GitHub · PR · Colaboración",
  category: "entorno",
  tagline: "El sistema de control de versiones que impulsa el software del mundo.",
  description:
    "Git es la máquina del tiempo del código: guarda cada cambio, cada rama, cada decisión. GitHub es su casa en la nube, con PRs, issues y automatización. En este curso ejecutas git REAL dentro del sandbox: inicias repos, haces commits, ramas y merges de verdad.",
  objectives: [
    "Entender por qué el control de versiones es no negociable",
    "Crear commits reales y ver el historial con git",
    "Ramificar y fusionar sin miedo, explicado con diagramas",
    "Publicar en GitHub y colaborar con Pull Requests",
    "Automatizar con GitHub Actions",
  ],
  prerequisites: ["Ninguno: empezamos desde el `git init`."],
  color: "#6e40c9",
  gradient: ["#24292e", "#6e40c9"],
  lessons: [
    {
      id: "git-que-es",
      title: "Git: la máquina del tiempo",
      durationMin: 12,
      summary: "Por qué TODO proyecto profesional versiona su código.",
      xp: 40,
      blocks: [
        {
          t: "theory",
          md: "**Git** es un sistema de control de versiones **distribuido**: cada copia del proyecto contiene TODO el historial.\n\n- Guarda **snapshots** (`commits`) con autor, fecha y mensaje.\n- Permite **ramas** (`branches`) para trabajar en paralelo sin pisarse.\n- **GitHub** añade la capa social: remoto, Pull Requests, issues y CI.\n\n> **Analogía de la grabadora negra:** cada commit es una marca en la cinta. Puedes volver a CUALQUIER momento, ver quién hizo cada cambio y por qué, y 'deshacer la jugada' entera con seguridad.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    C1[commit 1<br/>inicial] --> C2[commit 2<br/>feat: login]
    C2 --> C3[commit 3<br/>fix: estilo]
    C2 --> F1[rama feature/exportar]
    F1 --> F2[commit 4<br/>exportar PDF]
    F2 -->|merge| C4[commit 5<br/>merge feature]
    C3 --> C4`,
          caption: "El historial como una red: commits en línea principal y ramas que se reincorporan.",
        },
        {
          t: "callout",
          kind: "warning",
          title: "🖥️ Git ≠ GitHub",
          md: "Git es la herramienta local (gratis, offline). GitHub es un servicio en la nube para alojar repos y colaborar. Se llevan de maravilla, pero son cosas distintas.",
        },
        {
          t: "quiz",
          question: "¿Qué es un commit en Git?",
          options: [
            "Un backup completo de toda la computadora",
            "Una instantánea del proyecto con autor, fecha y mensaje",
            "Una contraseña cifrada del repositorio",
            "Un tipo de rama",
          ],
          correct: 1,
          explanation:
            "El commit es una foto del estado del proyecto, firmada con autor, hora y un mensaje descriptivo. El historial es la sucesión de estos snapshots.",
        },
      ],
    },
    {
      id: "git-basico",
      title: "Tu primer repositorio",
      durationMin: 18,
      summary: "init, add, commit: el ciclo que repetirás para siempre.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: `Tres comandos son el corazón:\n\n- \`git init\` → crear el repositorio (la 'grabadora').\n- \`git add <archivos>\` → poner cambios en el *stage* (la zona de espera).\n- \`git commit -m "mensaje"\` → grabar la instantánea.\n\n> **Analogía del fotógrafo:** \`add\` es pedirle a la modelo que pose; \`commit\` es 'clic' — la foto queda guardada. Puedes pedir que pose muchas personas antes de disparar.`,
        },
        {
          t: "terminal",
          title: "Repositorio completo en vivo",
          md: "Este script se ejecuta REALMENTE. Crearemos un repo en una carpeta temporal, haremos dos commits y veremos el historial:",
          cmd: `cd "$(mktemp -d)"
git init -q
git config user.name "Ada"
git config user.email "ada@example.com"
echo "# Mi proyecto" > README.md
git add README.md
git commit -qm "feat: primer commit"

echo "console.log('hola')" > app.js
git add app.js
git commit -qm "feat: app inicial"

git log --oneline --decorate
echo "---"
git status --short`,
        },
        {
          t: "callout",
          kind: "tip",
          title: "📝 Mensajes que ayudan",
          md: "Adopta *Conventional Commits*: `feat:`, `fix:`, `docs:`… Cada mensaje cuenta UNA idea. Tu yo del futuro (y tus compañeras) te lo agradecerán en `git blame`.",
        },
        {
          t: "quiz",
          question: "¿Qué hace exactamente `git add`?",
          options: [
            "Guarda el commit definitivo",
            "Pasa cambios del directorio de trabajo al área de stage",
            "Sube el código a GitHub",
            "Borra archivos",
          ],
          correct: 1,
          explanation:
            "`git add` prepara (staging) los cambios; `git commit` los fija como instantánea. Solo lo que está 'en stage' entra al commit.",
        },
      ],
    },
    {
      id: "git-ramas",
      title: "Ramas y merges",
      durationMin: 18,
      summary: "Trabaja en paralelo y junta los caminos sin miedo.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Una **rama** es un puntero móvil sobre el historial. La rama `main` es la línea principal; creas `feature/...` para experimentar sin tocar lo estable.\n\n- `git checkout -b feature` → crea y cambia a la rama.\n- `git merge feature` → trae los cambios a la rama actual.\n\n> **Analogía del carril de ensayo:** dos diseñadores (tú) dibujan en carriles separados. Cuando uno está listo, el camión (merge) une los carriles.",
        },
        {
          t: "terminal",
          title: "Rama + merge reales",
          cmd: `cd "$(mktemp -d)"
git init -q
git config user.name "Ada"
git config user.email "ada@example.com"
echo "hola" > app.txt && git add . && git commit -qm "inicial"

git checkout -qb feature/login
echo "login" >> app.txt
git add . && git commit -qm "feat(login): formulario"

git checkout -q main
echo "aviso" >> app.txt
git add . && git commit -qm "fix: aviso legal"

git merge -q --no-edit feature/login

git log --oneline --graph --all
echo "--- contenido final:"
cat app.txt`,
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    A["main"] --> B["fix: aviso legal"]
    A --> C["feature/login<br/>feat: formulario"]
    C --> D["merge"]
    B --> D`,
          caption: "Dos cambios hechos por separado convergen en un merge.",
        },
        {
          t: "callout",
          kind: "warning",
          title: "🤝 Conflictos: no son el fin del mundo",
          md: "Si dos líneas tocan el mismo código, git marca el conflicto y decides tú cuál queda. Es un evento normal y esperado, resuelto en pocos minutos.",
        },
        {
          t: "quiz",
          question: "¿Qué hace `git checkout -b feature`?",
          options: [
            "Borra la rama feature",
            "Crea la rama feature y te cambia a ella",
            "Sube feature a GitHub",
            "Fusiona con main",
          ],
          correct: 1,
          explanation:
            "`-b` crea una rama nueva y `checkout` te sitúa en ella. Es el atajo más usado para arrancar trabajo aislado.",
        },
      ],
    },
    {
      id: "github-remoto",
      title: "GitHub: PRs, issues y Actions",
      durationMin: 20,
      summary: "La capa social y colaborativa que hace grande a GitHub.",
      xp: 60,
      blocks: [
        {
          t: "theory",
          md: "**GitHub** añade a git lo que falta para colaborar:\n\n- **Remote**: el repositorio en la nube (`push`/`pull`).\n- **Pull Request (PR)**: propones cambios dentro del proyecto ajeno/propio y el equipo los revisa.\n- **Issues**: el plan de trabajo y bug tracker.\n- **Actions**: CI/CD corriendo en cada push/PR.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    DEV[Tu repo local<br/>rama feature] -->|git push| GH[GitHub]
    GH -->|Pull Request| REV[Revisión del equipo]
    REV -->|aprobado| MERGE[Merge]
    MERGE -->|trigger| ACT[GitHub Actions<br/>test + lint + build]
    ACT -->|deploy si va verde| PROD[Producción]`,
          caption: "El viaje del código con GitHub: local → PR → merge → CI → deploy.",
        },
        {
          t: "demo",
          title: "Flujo remoto (simulado: no hay servidor aquí)",
          lines: [
            {
              prompt: "git push -u origin feature/exportar",
              out: ["Enumerating objects: 4, done.", "Counting objects: 100% (4/4), done.", "To github.com:tuproyecto/app.git", " * [new branch]      feature/exportar -> feature/exportar"],
            },
            {
              prompt: "git pull origin main",
              out: ["Updating 1a2b3c4..5d6e7f8", "Fast-forward", " src/app/page.tsx | 2 ++", " 1 file changed, 2 insertions(+)"],
            },
            {
              prompt: "gh pr create --title \"Exportar PDF\" --body \"closes #12\"",
              out: ["https://github.com/tuproyecto/app/pull/27"],
            },
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "🎯 PRs pequeñas, jueces felices",
          md: "Un PR que toca muchas cosas se revisa mal. Haz PRs con una idea, mensaje claro y tests verdes: el equipo las fusiona con gusto.",
        },
        {
          t: "quiz",
          question: "¿Para qué sirve una Pull Request?",
          options: [
            "Para borrar el repositorio",
            "Proponer cambios de una rama para que se revisen y fusionen",
            "Para cifrar el código",
            "Para crear issues automáticamente",
          ],
          correct: 1,
          explanation:
            "La PR es la propuesta formal de unir una rama: incluye diff, discusión, revisión y los checks de CI antes del merge.",
        },
      ],
    },
    {
      id: "github-flujo",
      title: "Proyecto: flujo colaborativo completo",
      durationMin: 20,
      summary: "Issues → rama → commit → PR → merge: el ciclo 2026.",
      xp: 70,
      blocks: [
        {
          t: "theory",
          md: "Este es el flujo que verás en CUALQUIER equipo moderno:\n\n1. Se abre un **issue** (tarea o bug).\n2. Creas `feature/<descripción>` desde `main`.\n3. Trabajas con commits pequeños y convencionales.\n4. Empujas y abres **PR** referenciando el issue (`closes #12`).\n5. **CI** corre tests automáticamente.\n6. Revisión → merge → se borra la rama.",
        },
        {
          t: "demo",
          title: "La botonera completa en un PR de verdad",
          lines: [
            {
              prompt: "git checkout -b fix/login-session",
              out: ["Switched to a new branch 'fix/login-session'"],
            },
            {
              prompt: "git add . && git commit -m \"fix(auth): renovar sesión al refrescar\"",
              out: ["[fix/login-session 7f3a9c1] fix(auth): renovar sesión al refrescar", " 1 file changed, 12 insertions(+), 3 deletions(-)"],
            },
            {
              prompt: "git push -u origin fix/login-session",
              out: ["remote: Create a pull request for 'fix/login-session' on GitHub by visiting:", "remote:      https://github.com/app/pull/new/fix/login-session"],
            },
            {
              prompt: "gh pr merge --squash",
              out: ["✓ Merged pull request #34 (fix/auth)", "✓ Branch 'fix/login-session' deleted", "✓ Deleted local branch 'fix/login-session'"],
            },
          ],
        },
        {
          t: "diagram",
          mermaid: `flowchart TD
    ISS[Issue #12<br/>Bug: sesión] --> BRA[crear rama<br/>fix/login-session]
    BRA --> C1[commit 1]
    C1 --> C2[commit 2]
    C2 --> PR["Push + Pull Request<br/>closes #12"]
    PR --> CI[CI: tests]
    CI -->|verde| REV[Revisión]
    REV -->|aprueba| M[Squash merge]
    M --> DEL[borrar rama]
    DEL --> PROD[main actualizada]`,
          caption: "El ciclo completo que guía el trabajo en equipo moderno.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "🧪 El sandbox es tuyo",
          md: "Vuelve a la lección 2 y edita el script: añade `git checkout -b experimento`, haz commits, mira `git log --graph`. Rompe, fusiona, aprende sin miedo: nada sale de la carpeta temporal.",
        },
        {
          t: "quiz",
          question: "¿Qué hace `gh pr merge --squash`?",
          options: [
            "Borra todos los commits",
            "Fusiona la PR condensando sus commits en uno solo",
            "Crea una rama nueva",
            "Reabre el issue",
          ],
          correct: 1,
          explanation:
            "El *squash merge* une todos los commits de la rama en un único commit en main: historial limpio y revisión clara.",
        },
      ],
    },
  ],
};