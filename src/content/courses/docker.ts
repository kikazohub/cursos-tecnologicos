import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "docker",
  emoji: "🐳",
  title: "Docker",
  subtitle: "Docker · Contenedores · Imágenes",
  category: "devops",
  tagline: "Que tu código funcione igual en tu máquina y en producción.",
  description:
    "'En mi máquina funciona' es el chiste que Docker eliminó. Un contenedor Docker empaca tu aplicación y sus dependencias en una caja idéntica en cualquier lugar. Es la herramienta esencial del dev moderno y la base de casi todo el ecosistema cloud actual.",
  objectives: [
    "Entender qué es un contenedor frente a una máquina virtual",
    "Leer y escribir Dockerfiles capa a capa",
    "Orquestar varios servicios con docker compose",
    "Publicar y descargar imágenes de registros",
    "Ejecutar los comandos del día a día con fluidez",
  ],
  prerequisites: ["Ninguno. VS Code te ayudará a editar los Dockerfiles."],
  color: "#2496ed",
  gradient: ["#2496ed", "#1d63ed"],
  lessons: [
    {
      id: "docker-que-es",
      title: "Contenedores: tu código en una caja",
      durationMin: 14,
      summary: "La analogía del contenedor de carga cambia tu forma de verlo.",
      xp: 45,
      blocks: [
        {
          t: "theory",
          md: "**Docker** empaqueta tu app con su entorno (sistema, runtime, dependencias) en una **imagen**; al ejecutarla obtienes un **contenedor** aislado.\n\n- **Imagen**: el plano/receta (inmutable, se comparte).\n- **Contenedor**: la instancia corriendo (se crea, pausa, borra).\n\n> **Analogía del transporte marítimo:** antes, cada carga viajaba como podía (VM pesadas, configs a mano). Docker estandarizó la caja de carga: misma contenedor en cualquier barco (máquina), misma imagen en cualquier equipo. Mundial, repetible, imparable.",
        },
        {
          t: "diagram",
          mermaid: `flowchart TD
    I[Imagen<br/>receta inmutable] -->|docker run| C1[Contenedor A]
    I -->|docker run| C2[Contenedor B]
    I -->|push| REG[Registro<br/>Docker Hub]
    REG -->|pull| C3[Contenedor en producción]
    C1 --> APP["app + runtime + libs<br/>todo dentro"]`,
          caption: "Una imagen produce N contenedores idénticos y viaja por registros.",
        },
        {
          t: "callout",
          kind: "info",
          title: "🧱 Contenedor ≠ VM",
          md: "Una VM carga todo un sistema operativo (pesada). Un contenedor comparte el kernel del host: arranca en segundos y pesa MB, no GB. Misma app, una fracción de recursos.",
        },
        {
          t: "quiz",
          question: "¿Cuál es la diferencia entre imagen y contenedor?",
          options: [
            "Son lo mismo",
            "Imagen = receta inmutable; contenedor = proceso que corre desde ella",
            "Imagen = archivo; contenedor = solo memoria",
            "Contenedor es de Docker; imagen de Kubernetes",
          ],
          correct: 1,
          explanation:
            "La imagen es el artefacto compartido (la receta); el contenedor es una instancia en ejecución. Puedes tener muchos contenedores de la misma imagen.",
        },
      ],
    },
    {
      id: "docker-dockerfile",
      title: "El Dockerfile: la receta",
      durationMin: 18,
      summary: "Construye imágenes capa a capa.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "El **Dockerfile** describe cómo construir la imagen. Cada instrucción crea una **capa** reutilizable; la caché acelera builds posteriores.\n\n| Instrucción | Qué hace |\n|-------------|----------|\n| `FROM` | Base de partida (p. ej. `node:22-alpine`) |\n| `WORKDIR` | Carpeta de trabajo |\n| `COPY` | Copia archivos locales |\n| `RUN` | Ejecuta comandos (instalar deps) |\n| `EXPOSE` | Documenta el puerto |\n| `CMD` | El comando principal al arrancar |",
        },
        {
          t: "code",
          lang: "shell",
          title: "Dockerfile de una app Node",
          md: "No se ejecuta aquí (docker desk no está dentro del sandbox), pero es el Dockerfile canónico que verás en todos los proyectos Node:",
          code: `# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

# ---- producción (imagen mínima) ----
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app .
EXPOSE 3000
CMD ["node", "server.js"]`,
          run: false,
        },
        {
          t: "demo",
          title: "Construyendo y corriendo la imagen",
          lines: [
            {
              prompt: "docker build -t mi-app:v1 .",
              out: ["[+] Building 12.5s", " => [build 2/4] WORKDIR /app         6.2s", " => [build 3/4] COPY package.json    0.4s", " => [build 4/4] RUN npm install     4.9s", " => exporting to image               0.1s", " => => naming to docker.io/library/mi-app:v1"],
            },
            {
              prompt: "docker run -d -p 3000:3000 --name app1 mi-app:v1",
              out: ["5f7e2a9b1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f", "✓ contenedor 'app1' arrancado en el puerto 3000"],
            },
            {
              prompt: "curl localhost:3000",
              out: ["¡Hola desde mi app en Docker!"],
            },
          ],
        },
        {
          t: "callout",
          kind: "warning",
          title: "🚨 Orden de capas = velocidad",
          md: "Copia `package.json` y corre `npm install` ANTES de copiar el resto. Así la capa de dependencias se reutiliza en cada build y solo recompilas lo que cambia.",
        },
        {
          t: "quiz",
          question: "¿Qué hace la instrucción `CMD` en un Dockerfile?",
          options: [
            "Copia archivos",
            "Define el comando al arrancar el contenedor",
            "Abre puertos",
            "Instala dependencias",
          ],
          correct: 1,
          explanation:
            "`CMD` especifica el proceso principal (p. ej. `node server.js`) que corre cuando el contenedor arranca.",
        },
      ],
    },
    {
      id: "docker-compose",
      title: "Docker Compose: varios servicios",
      durationMin: 18,
      summary: "Backend, BD y cache en un solo comando.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Una app rara vez es un solo contenedor: necesitas API, base de datos, colas... **Docker Compose** define todos los servicios en `compose.yaml` y los levanta con un solo comando.\n\n```yaml\nservices:\n  api:\n    build: .\n    ports: [\"3000:3000\"]\n  postgres:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: secreto\n```",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    API[Servicio: api<br/>puerto 3000] -->|red interna compose| PG[(Servicio: postgres)]
    API -->|red interna| RD[(Servicio: redis cache)]
    EXT[Browser] -->|localhost:3000| API
    subgraph docker-compose
    API
    PG
    RD
    end`,
          caption: "Compose crea una red interna: los servicios se ven entre sí y solo exponen al exterior lo que tú decides.",
        },
        {
          t: "demo",
          title: "Levantando el stack con compose",
          lines: [
            {
              prompt: "docker compose up -d",
              out: ["[+] Running 4/4", "✔ Network stack_default       Created", "✔ Container stack-redis-1     Started", "✔ Container stack-db-1        Started", "✔ Container stack-api-1       Started"],
            },
            {
              prompt: "docker compose ps",
              out: ["NAME                IMAGE           STATUS          PORTS", "stack-api-1         mi-app          Up 2 minutes    0.0.0.0:3000->3000/tcp", "stack-db-1          postgres:16     Up 2 minutes    5432/tcp", "stack-redis-1       redis:7         Up 2 minutes    6379/tcp"],
            },
            {
              prompt: "docker compose logs api --tail 20",
              out: ["api-1  | listening on :3000", "api-1  | GET /health 200 2ms"],
            },
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "🧪 El stack de dev de hoy",
          md: "Levantar Mongo + backend + React en local con Compose es el patrón 2026. Un solo `docker compose up` y todo el mundo reproduce tu entorno.",
        },
        {
          t: "quiz",
          question: "¿Para qué sirve `docker compose up -d`?",
          options: [
            "Actualizar Docker",
            "Levantar todos los servicios del compose en segundo plano",
            "Borrar imágenes",
            "Crear una red manual",
          ],
          correct: 1,
          explanation:
            "`up` crea y arranca todos los servicios descritos; `-d` los deja corriendo en background (detached).",
        },
      ],
    },
    {
      id: "docker-registro",
      title: "Registros y etiquetas",
      durationMin: 14,
      summary: "El 'Docker Hub' donde nacen y viajan las imágenes.",
      xp: 45,
      blocks: [
        {
          t: "theory",
          md: "Los **registros** almacenan y distribuyen imágenes. **Docker Hub** es el público oficial; GitHub Container Registry (`ghcr.io`) y ECR son privados.\n\nLa convención de `tag`:\n\n```\nusuario/imagen:etiqueta\nnode/18-alpine   → imagen node, variante alpine\nghcr.io/team/app:v1.4.3   → registro custom, versión\n```",
        },
        {
          t: "demo",
          title: "Subir y bajar imágenes",
          lines: [
            {
              prompt: "docker login ghcr.io",
              out: ["Authenticating with existing credentials...", "Login Succeeded"],
            },
            {
              prompt: "docker tag mi-app:v1 ghcr.io/tu-usuario/mi-app:1.4.3",
              out: [],
            },
            {
              prompt: "docker push ghcr.io/tu-usuario/mi-app:1.4.3",
              out: ["The push refers to repository [ghcr.io/tu-usuario/mi-app]", "1.4.3: digest: sha256:4f6...  size: 642", "Pushed 4 layers"],
            },
            {
              prompt: "docker pull node:22-alpine",
              out: ["22-alpine: Pulling from library/node", "Digest: sha256:9a2...  Status: Downloaded newer image for node:22-alpine"],
            },
          ],
        },
        {
          t: "callout",
          kind: "warning",
          title: "🏷️ Versiona desde el día 1",
          md: "Etiquetar `latest` a secas causa desastres. Adopta `v1.4.3` (semver) o el hash del commit. Los rollbacks agradecen versiones inmutables.",
        },
        {
          t: "quiz",
          question: "En `ghcr.io/team/app:v1.4.3`, ¿qué es `v1.4.3`?",
          options: ["El usuario", "El registro", "La etiqueta (tag) de la imagen", "El puerto"],
          correct: 2,
          explanation:
            "Las etiquetas versionan cada imagen: `registro/usuario/imagen:tag`. El tag inmutable te permite desplegar versiones exactas.",
        },
      ],
    },
    {
      id: "docker-practico",
      title: "Proyecto: el día a día Docker",
      durationMin: 18,
      summary: "Comandos esenciales y un mini-proyecto contenerizado.",
      xp: 65,
      blocks: [
        {
          t: "theory",
          md: "El **command-cheat** que usarás diario:\n\n- `docker ps` / `docker ps -a` → contenedores activos/todos.\n- `docker logs -f <id>` → logs en vivo.\n- `docker exec -it <id> sh` → terminal dentro.\n- `docker stop/rm/rmi` → parar, borrar contenedor/imagen.\n- `docker image prune` → limpiar imágenes huérfanas.",
        },
        {
          t: "terminal",
          title: "Todo real: tu docker te responde",
          md: "Este comando se ejecuta DE VERDAD en tu máquina: verifica que Docker está instalado y activo.",
          cmd: `docker --version && docker info --format '{{.ServerVersion}}' || echo "Docker no está activo en este sandbox"`,
        },
        {
          t: "demo",
          title: "Un flujo completo con docker",
          lines: [
            {
              prompt: "docker build -t notas:v1 .",
              out: ["[+] Building 9.8s", " => [1/4] FROM node:22-alpine", " => [2/4] WORKDIR /app", " => [3/4] COPY . .", " => [4/4] RUN npm ci --omit=dev", " ✓ exporting to image"],
            },
            {
              prompt: "docker run -d -p 3000:3000 --name notas notas:v1",
              out: ["3a1f9e...  |> contenedor notas corriendo"],
            },
            {
              prompt: "docker logs -f notas",
              out: ["[Notes API] escuchando en :3000", "GET /api/cursos 200 3ms", "POST /api/notas 201 2ms"],
            },
            {
              prompt: "docker exec -it notas sh",
              out: ["/app # ls", "node_modules  package.json  server.js"],
            },
            {
              prompt: "docker stop notas && docker container prune -f",
              out: ["notas", "Total reclaimed space: 2.3MB"],
            },
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "🧹 Higiene Docker",
          md: "Contenedores muertos e imágenes intermedias llenan el disco. Una vez a la semana: `docker system df` para ver el consumo y `docker system prune -af` para limpiar (con cuidado).",
        },
        {
          t: "quiz",
          question: "¿Qué comando te mete dentro de un contenedor en ejecución?",
          options: [
            "docker run",
            "docker exec -it <id> sh",
            "docker pull",
            "docker logs",
          ],
          correct: 1,
          explanation:
            "`docker exec` ejecuta un proceso dentro del contenedor vivo; con `-it sh` obtienes una shell interactiva para inspeccionar.",
        },
      ],
    },
  ],
};