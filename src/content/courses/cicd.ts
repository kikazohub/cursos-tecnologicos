import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "cicd",
  emoji: "🔄",
  title: "GitHub Actions / GitLab CI",
  subtitle: "CI/CD · Pipelines · Deploys",
  category: "devops",
  tagline: "Automatiza test y despliegue en cada push.",
  description:
    "Integración Continua (CI) y Despliegue Continuo (CD) convierten 'pushear' en 'todo verificado y en producción'. Cada push corre tests, lint y build en la nube; cada PR se valida antes de mergear. Es el cinturón de seguridad del equipo moderno.",
  objectives: [
    "Entender el ciclo CI/CD y sus 3 etapas",
    "Escribir un workflow de GitHub Actions",
    "Crear jobs, matrices y cachés",
    "Desplegar solo cuando todo va verde",
    "Comparar con GitLab CI y usar buenas prácticas de seguridad",
  ],
  prerequisites: ["El curso de GitHub te da el contexto perfecto."],
  color: "#2088ff",
  gradient: ["#2088ff", "#6cc644"],
  lessons: [
    {
      id: "cicd-que-es",
      title: "CI/CD: la cinta transportadora",
      durationMin: 14,
      summary: "De 'pushear' a 'en producción', sin drama.",
      xp: 45,
      blocks: [
        {
          t: "theory",
          md: "**CI (Integración Continua)**: en cada push, el servidor descarga el código, instala, corre tests y lint. Detecta problemas al instante.\n\n**CD (Despliegue Continuo)**: si todo está verde, publica: build de Docker, subir imagen, actualizar cluster/VM.\n\n> **Analogía de la cadena de montaje del coche:** cada pieza pasa por controles al llegar (CI); solo cuando el coche pasa todas las pruebas sale a la carretera (CD). El fabricante (GitHub Actions/GitLab CI) siempre está al mando.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    PUSH[git push] --> CI[CI<br/>install → lint → test → build]
    CI -->|todos verdes| PKG[Empaquetar<br/>imagen/artefacto]
    PKG --> CD[CD<br/>deploy a stage]
    CD -->|smoke tests| PROD[Producción]
    CI -->|rojo| FAIL[❌ notificación + no hay deploy]
    FAIL --> DEV[dev corrige]`,
          caption: "CI prueba, CD despliega. Solo lo verde llega a producción.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "🧯 'El build está roto' deja de ser drama",
          md: "Con CI, el fallo se detecta en segundos, en el commit exacto que lo causó. Sin CI, descubres el error días después con peor contexto.",
        },
        {
          t: "quiz",
          question: "¿Qué hace la CI en cada push?",
          options: [
            "Despliega a producción directamente",
            "Instala deps y corre lint/tests/build automáticamente",
            "Borra el historial",
            "Hace commit por ti",
          ],
          correct: 1,
          explanation:
            "Integración Continuamente valida cada cambio (probando y compilando) antes de que llegue a producción.",
        },
      ],
    },
    {
      id: "cicd-actions",
      title: "GitHub Actions al desnudo",
      durationMin: 18,
      summary: "Workflows, jobs y steps.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Un **workflow** en `.github/workflows/*.yml` se dispara con eventos (`push`, `pull_request`, cron).\n\n- **Job**: un runner (máquina virtual con Ubuntu/macOS/Windows).\n- **Steps**: comandos en orden, uno tras otro.\n- **Actions**: pasos reutilizables (`actions/checkout`...).\n- **Matrix**: repite el trabajo en varias versiones (node 20/22).",
        },
        {
          t: "code",
          lang: "yaml",
          title: "workflow.yml: CI completa",
          code: `name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [20, 22]        # prueba en 2 versiones
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \$\{{ matrix.node }}
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build`,
          run: false,
        },
        {
          t: "demo",
          title: "El pipeline corriendo",
          lines: [
            {
              prompt: "push a main → Actions lo recoge",
              out: ["CI/tests (node 20)", "CI/tests (node 22)"],
            },
            {
              prompt: "(logs de un job)",
              out: ["Install dependencies", "  ✓ npm ci (8s)", "Run lint", "  ✓ eslint .", "Run build", "  ✓ Created a production build in 14s"],
            },
            {
              prompt: "si un job falla...",
              out: ["  ✗ npm test: 1 failing test", "  npm run test exited with code 1", "  (se te notifica; el deploy se bloquea)"],
            },
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "🗂️ Secrets sin manchas",
          md: "Nunca pongas credenciales en el YAML: usa `\$\{{ secrets.TOKEN }}` (ajustes del repo). El runner las inyecta y nunca aparecen en los logs.",
        },
        {
          t: "quiz",
          question: "¿Qué es un 'job' en GitHub Actions?",
          options: [
            "Un paso dentro de un workflow",
            "Una unidad de trabajo que corre en un runner",
            "Un tipo de trigger",
            "Un artefacto",
          ],
          correct: 1,
          explanation:
            "Un job agrupa pasos y corre en un runner independiente; los jobs pueden depender entre sí con `needs`.",
        },
      ],
    },
    {
      id: "cicd-cicd",
      title: "Disparadores, matrices y caché",
      durationMin: 16,
      summary: "Afinando cuándo y cómo corre cada cosa.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Tres trucos que separan un buen pipeline de uno básico:\n\n- **Triggers finos**: `on.push.paths: ['src/**']` para no correr tests con cambios de docs.\n- **Matrix** para probar en múltiples versiones/SO sin duplicar YAML.\n- **Caché** (`cache: npm`) para no reinstalar deps en cada run.",
        },
        {
          t: "code",
          lang: "yaml",
          title: "Triggers y optimizaciones",
          code: `on:
  push:
    branches: [main]
    paths: [src/**, package*.json]  # solo si toca código
  schedule:
    - cron: "0 3 * * *"             # nightly: test de rendimiento

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          cache: npm                # cachea node_modules
      - run: npm ci --prefer-offline`,
          run: false,
        },
        {
          t: "callout",
          kind: "warning",
          title: "⚠️ CI lenta = developers quejándose",
          md: "Si tu pipeline tarda 40 min, la gente empezará a evitar el CI. Caché, matriz paralela y segmentar trabajos: la velocidad del CI es productividad del equipo.",
        },
        {
          t: "quiz",
          question: "¿Para qué sirve el parámetro `paths` en un trigger?",
          options: [
            "Para cambiar el origen del repo",
            "Para correr el CI solo cuando cambian ciertos archivos",
            "Para establecer la ruta del runner",
            "Para borrar artefactos",
          ],
          correct: 1,
          explanation:
            "Filtra por archivos: un cambio en `docs/*.md` no repite la suite completa de tests. Ahorra minutos y dinero.",
        },
      ],
    },
    {
      id: "cicd-deploy",
      title: "CD: el deploy gobernado",
      durationMin: 18,
      summary: "De un push verde a producción, con gente de por medio si quieres.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "El **CD** empaqueta y despliega. Diseño típico:\n\n1. Job `test` (al mergear).\n2. Job `build-push` → `docker build` + push a registro (con `needs: test`).\n3. Job `deploy-prod` → actualiza Kubernetes (Helm) o la VM.\n4. **Gating**: si quieres revisión humana, un `job` con `environment: production` (requiere aprobación) y `if: github.ref == 'refs/heads/main'`.",
        },
        {
          t: "code",
          lang: "yaml",
          title: "Pipeline de build + deploy",
          code: `jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test

  deploy:
    needs: test                  # solo si test pasó
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production      # gating con aprobación
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \$\{{ github.actor }}
          password: \$\{{ secrets.GITHUB_TOKEN }}
      - run: docker build -t ghcr.io/team/app:\$\{{ github.sha }} .
      - run: docker push ghcr.io/team/app:\$\{{ github.sha }}
      - run: ./scripts/helm-deploy.sh \$\{{ github.sha }}`,
          run: false,
        },
        {
          t: "demo",
          title: "El flujo real de un deploy",
          lines: [
            {
              prompt: "merge a main",
              out: ["✔ test: lint + unit (2m 10s)", "✔ build+publish: imagen ghcr.io/team/app:9f2a1c", "⏸ deploy: esperando aprobación de producción 🕐"],
            },
            {
              prompt: "aprueban el deploy",
              out: ["  ✔ helm upgrade --install app .", "  ✔ rollout status: 10 pods listos", "  ✔ smoke: GET /health 200"],
            },
            {
              prompt: "algo va mal",
              out: ["  ✗ smoke 503 → rollback automático", "  ✓ volvemos a versión anterior (ghcr.io/team/app:7c1b2e)"],
            },
          ],
        },
        {
          t: "callout",
          kind: "info",
          title: "🏷️ Versiona por SHA",
          md: "Etiquetar la imagen con el hash del commit (`\$\{{ github.sha }}`) = trazabilidad perfecta: sabes qué código está en cada entorno y puedes hacer rollback al segundo exacto.",
        },
        {
          t: "quiz",
          question: "¿Qué aporta `needs: test` y `environment: production`?",
          options: [
            "Nada, son decorativos",
            "Orden: deploy solo si CI pasa, y gate humano en producción",
            "Mala práctica recomendada",
            "Forzar deploy sin test",
          ],
          correct: 1,
          explanation:
            "`needs` encadena jobs (deploy espera a test). `environment` con aprobación añade el control humano: CD con freno de mano.",
        },
      ],
    },
    {
      id: "cicd-gitlab",
      title: "GitLab CI y comparativa",
      durationMin: 16,
      summary: "El rival de diario: pipelines, stages y runners.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "**GitLab CI** viene integrado en GitLab (`.gitlab-ci.yml` en la raíz). Divide el trabajo en **stages** ordenados: `build → test → deploy`.\n\n| Concepto | GitHub Actions | GitLab CI |\n|----------|---------------|-----------|\n| Archivo | `.github/workflows/*.yml` | `.gitlab-ci.yml` |\n| Unidad | Jobs en runners | Jobs en stages |\n| Dependencias | `needs:` | `stage:` + `dependencies` |\n| Runners | Hosted/Microsoft | Shared/self-hosted |",
        },
        {
          t: "code",
          lang: "yaml",
          title: ".gitlab-ci.yml equivalente",
          code: `stages:
  - build
  - test
  - deploy

variables:
  IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA

install-build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths: [dist/]

test:
  stage: test
  script:
    - npm test
    - npm run lint

deploy-prod:
  stage: deploy
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
  script:
    - docker build -t "$IMAGE" .
    - docker push "$IMAGE"
    - ./scripts/deploy.sh`,
          run: false,
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    ST1[stage: build] --> ST2[stage: test]
    ST2 --> ST3[stage: deploy]
    ST1 -->|en paralelo| ST1b[jobs build A/B]
    ST2 -->|en paralelo| ST2b[jobs test por versión]
    ST3 -->|gate main| ST3b[deploy prod]`,
          caption: "Los stages avanzan en orden; dentro de cada stage los jobs corren en paralelo.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "🧭 Elige por ecosistema",
          md: "¿Tu equipo vive en GitHub? Actions. ¿En GitLab? CI. ¿Ninguno? GitHub Actions sigue siendo el más extensible. Los conceptos se transfieren al 100%.",
        },
        {
          t: "quiz",
          question: "¿Qué diferencia a GitLab CI de GitHub Actions?",
          options: [
            "No puede automatizar nada",
            "GitLab usa stages con jobs; GitHub usa jobs con needs",
            "Solo funciona en Windows",
            "No existe tal cosa",
          ],
          correct: 1,
          explanation:
            "Conceptos equivalentes, sintaxis distinta: stages (GitLab) vs jobs con `needs` (GitHub). Domina uno y el otro llega solo.",
        },
      ],
    },
  ],
};