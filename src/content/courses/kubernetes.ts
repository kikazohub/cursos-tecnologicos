import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "kubernetes",
  emoji: "☸️",
  title: "Kubernetes",
  subtitle: "K8s · Orquestación · Pods",
  category: "devops",
  tagline: "El orquestador de contenedores que domina la nube.",
  description:
    "Docker conteneriza, Kubernetes (K8s) orquesta: decide dónde corre cada contenedor, los escala cuando hay carga, los repara si mueren y hace los despliegues sin downtime. Es el sistema nervioso de la nube moderna.",
  objectives: [
    "Entender qué problema resuelve la orquestación",
    "Conocer los objetos clave: Pod, Deployment, Service, Ingress",
    "Leer manifiestos YAML como código",
    "Escalar y actualizar aplicaciones con rollout",
    "Configurar apps con ConfigMaps, Secrets y Namespaces",
  ],
  prerequisites: ["Haber hecho el curso de Docker."],
  color: "#326ce5",
  gradient: ["#326ce5", "#000000"],
  lessons: [
    {
      id: "k8s-que-es",
      title: "Orquestar es dirigir la orquesta",
      durationMin: 14,
      summary: "Del contenedor suelto al sistema que se repara solo.",
      xp: 45,
      blocks: [
        {
          t: "theory",
          md: "Con Docker tienes contenedores, pero **tú** decides dónde van, qué pasa si mueren o cómo escalar. **Kubernetes** automatiza todo eso:\n\n- **Auto-reparación**: si un contenedor muere, lanza otro.\n- **Escalado**: de 3 a 30 réplicas con un comando.\n- **Rollouts**: actualiza versiones sin cortar el servicio.\n- **Descubrimiento**: balancea el tráfico entre pods.\n\n> **Analogía del director de orquesta:** Docker fabrica los instrumentos (contenedores); Kubernetes es la batuta que los coordina, cubre al violín que se marcha y sube el volumen cuando el público lo pide.",
        },
        {
          t: "diagram",
          mermaid: `flowchart TD
    USR[Usuarios] --> SVC[Service<br/>balancea]
    SVC --> P1[Pod app v1]
    SVC --> P2[Pod app v1]
    SVC --> P3[Pod app v1]
    NOD[Node: nodo físico/virtual] --> P1
    NOD --> P2
    NOD --> P3
    NOD --> PAPI[Kubelet + kube-proxy]
    PAPI --> MASTER[Plano de control<br/>decide y repara]`,
          caption: "El plano de control observa los nodos; los Services enrutan; los Pods ejecutan.",
        },
        {
          t: "callout",
          kind: "info",
          title: "🧩 Kubernetes ≠ Docker",
          md: "No compiten: Docker empaca, Kubernetes orquesta. K8s gestiona contenedores (de Docker o de cualquier runtime OCI) a escala de granja.",
        },
        {
          t: "quiz",
          question: "¿Cuál es EL problema que resuelve Kubernetes?",
          options: [
            "Contenerizar aplicaciones",
            "Orquestar, escalar y reparar contenedores automáticamente",
            "Escribir código más rápido",
            "Guardar imágenes",
          ],
          correct: 1,
          explanation:
            "K8s orquesta el ciclo de vida de los contenedores: despliegue, escalado, autosanación y servicios de red.",
        },
      ],
    },
    {
      id: "k8s-objetos",
      title: "Los objetos del cluster",
      durationMin: 18,
      summary: "Pod, Deployment, Service e Ingress: la escalera del tráfico.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Los objetos se declaran en **manifiestos YAML** y el cluster los aplica:\n\n| Objeto | Qué es |\n|--------|--------|\n| **Pod** | La unidad mínima: 1+ contenedores juntos |\n| **Deployment** | Declara 'quiero 3 réplicas sanas' y las mantiene |\n| **Service** | IP/balanceo estable hacia los pods |\n| **Ingress** | Entrada HTTP pública (ej. `/api` → servicio api) |",
        },
        {
          t: "code",
          lang: "yaml",
          title: "Manifiesto de un Deployment + Service",
          md: "El YAML más importante que verás. Declarativo: le dices EL ESTADO, no los pasos.",
          code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: notas-api
spec:
  replicas: 3                # quiero 3 réplicas
  selector:
    matchLabels:
      app: notas
  template:
    metadata:
      labels: { app: notas }
    spec:
      containers:
        - name: api
          image: ghcr.io/tu-usuario/notas:v1.4.3
          ports: [{ containerPort: 3000 }]
---
apiVersion: v1
kind: Service
metadata:
  name: notas-svc
spec:
  selector: { app: notas }  # enruta a los pods con esa etiqueta
  ports:
    - port: 80
      targetPort: 3000`,
        },
        {
          t: "demo",
          title: "Aplicando la declaración",
          lines: [
            {
              prompt: "kubectl apply -f deployment.yaml",
              out: ["deployment.apps/notas-api created", "service/notas-svc created"],
            },
            {
              prompt: "kubectl get pods",
              out: ["NAME                        READY   STATUS    RESTARTS", "notas-api-7b8c9d-1a2b3   1/1     Running   0", "notas-api-7b8c9d-4d5e6   1/1     Running   0", "notas-api-7b8c9d-7f8g9   1/1     Running   0"],
            },
            {
              prompt: "kubectl get svc notas-svc",
              out: ["NAME        TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)", "notas-svc   ClusterIP   10.96.0.8     <none>        80/TCP"],
            },
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "🎯 Declarativo vs imperativo",
          md: "En lugar de 'ejecúta esto y luego esto' (imperativo), escribes 'este es el final deseado' (declarativo). Kubernetes se encarga de converger: esa es la belleza del YAML.",
        },
        {
          t: "quiz",
          question: "¿Qué objeto define cuántas réplicas de un pod quieres y se encarga de mantenerlas?",
          options: ["Service", "Deployment", "Ingress", "ConfigMap"],
          correct: 1,
          explanation:
            "El Deployment declara el número deseado de réplicas; el controlador crea y repara pods hasta cumplirlo.",
        },
      ],
    },
    {
      id: "k8s-rollout",
      title: "Escalar y actualizar sin miedo",
      durationMin: 16,
      summary: "Rollouts, rollbacks y réplicas a golpe de flag.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "La operativa del día a día:\n\n- `kubectl scale deploy notas-api --replicas=10` → de 3 a 10.\n- `kubectl set image deploy notas-api api=...:v1.4.4` → nuevo rollout.\n- `kubectl rollout status deploy/notas-api` → seguimiento.\n- `kubectl rollout undo deploy/notas-api` → rollback instantáneo.\n\nLos rollouts son **progresivos** (Recreate vs RollingUpdate) para no cortar el servicio.",
        },
        {
          t: "demo",
          title: "Un rollout y su rollback",
          lines: [
            {
              prompt: "kubectl scale deployment notas-api --replicas=5",
              out: ["deployment.apps/notas-api scaled"],
            },
            {
              prompt: "kubectl rollout status deployment/notas-api",
              out: ["Waiting for deployment \"notas-api\" rollout to finish: 2 of 5 updated replicas...", "deployment \"notas-api\" successfully rolled out"],
            },
            {
              prompt: "kubectl set image deployment/notas-api api=ghcr.io/tu-usuario/notas:v1.4.4",
              out: ["deployment.apps/notas-api image updated"],
            },
            {
              prompt: "✗ falla una probe... → kubectl rollout undo deployment/notas-api",
              out: ["deployment.apps/notas-api rolled back"],
            },
          ],
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    OLD[Pods v1.4.3<br/>3 réplicas] -->|set image v1.4.4| NEW[Pods nuevo+viejos<br/>rolling update]
    NEW -->|ok| FIN[Pods v1.4.4<br/>5 réplicas]
    NEW -.->|probe falla| UNDO[kubectl rollout undo]
    UNDO --> OLD
    style UNDO fill:#101,color:#fcc,stroke:#f87171`,
          caption: "Rolling update reemplaza pods poco a poco; un fallo dispara el rollback a la versión anterior.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "✅ Probes = salud automática",
          md: "Con `readinessProbe` y `livenessProbe` K8s decide cuándo mandar tráfico y cuándo reiniciar. Sin probes, un pod roto recibe peticiones y aparente estar 'sano'.",
        },
        {
          t: "quiz",
          question: "¿Qué hace `kubectl rollout undo`?",
          options: [
            "Borra el deployment",
            "Vuelve a la versión anterior de forma instantánea",
            "Escala a cero réplicas",
            "Crea un servicio nuevo",
          ],
          correct: 1,
          explanation:
            "`undo` revierte el último rollout, restaurando el estado previo de las imágenes en el Deployment.",
        },
      ],
    },
    {
      id: "k8s-config",
      title: "Config y secretos",
      durationMin: 16,
      summary: "ConfigMaps, Secrets y Namespaces: datos fuera del código.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Nunca metas configuración en la imagen. Kubernetes la inyecta:\n\n- **ConfigMap**: variables y archivos de configuración (no secretos).\n- **Secret**: datos sensibles (tokens, password), base64.\n- **Namespace**: separación lógica por equipo/entorno (prod, staging).\n\nAmbos se montan como variables de entorno o volúmenes.",
        },
        {
          t: "code",
          lang: "yaml",
          title: "ConfigMap + Secret + referencia",
          code: `apiVersion: v1
kind: ConfigMap
metadata: { name: notas-config }
data:
  LOG_LEVEL: "info"
  MAX_RETRIES: "3"
---
apiVersion: v1
kind: Secret
metadata: { name: notas-secret }
type: Opaque
stringData:
  DB_PASSWORD: "s3cr3t0!-no-lo-commitees"
---
# dentro del Deployment:
#   envFrom:
#     - configMapRef: { name: notas-config }
#     - secretRef:    { name: notas-secret }`,
        },
        {
          t: "callout",
          kind: "danger",
          title: "🔐 Secrets = base64 ≠ cifrado",
          md: "Un Secret solo codifica en base64 (legible). Para producción real usa un gestor externo (SOPS, Vault, o el secret manager de tu nube). La regla: el YAML con secretos reales no se sube a git.",
        },
        {
          t: "quiz",
          question: "¿Para qué sirve un Namespace en K8s?",
          options: [
            "Para ocupar más disco",
            "Separar lógicamente recursos por entorno/equipo",
            "Para bloquear red",
            "Para compilar imágenes",
          ],
          correct: 1,
          explanation:
            "Los namespaces aíslan y organizan: `default`, `kube-system`, `staging`, `prod`... cada uno con sus propios objetos y límites.",
        },
      ],
    },
    {
      id: "k8s-ecosistema",
      title: "El ecosistema K8s real",
      durationMin: 16,
      summary: "Minikube, k3s, Helm y k9s: tu día a día fuera del curso.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "En producción apenas tocarás Kubernetes a pelo: usarás su ecosistema.\n\n- **Minikube / kind / k3s**: clusters locales para desarrollo.\n- **Helm**: 'el apt de Kubernetes' — empaqueta charts reutilizables.\n- **k9s**: TUI para navegar el cluster con teclado.\n- **Ingress-NGINX / cert-manager**: tráfico y certificados TLS.",
        },
        {
          t: "demo",
          title: "Levantar y usar Helm",
          lines: [
            {
              prompt: "minikube start",
              out: ["* minikube v1.34+ on Ubuntu", "* Starting control plane node", "* Done! kubectl is now configured to use \"minikube\""],
            },
            {
              prompt: "helm install redis bitnami/redis",
              out: ["NAME: redis", "LAST DEPLOYED: ...", "CHART: redis-19.6.0"],
            },
            {
              prompt: "k9s",
              out: ["(pantalla TUI: pods, deploy, logs, exec... todo con teclas)"],
            },
          ],
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    DEV["Codificas<br/>image"] -->|"build/push"| MANIF["Manifiestos + Helm"]
    MANIF -->|"kubectl apply / helm upgrade"| CLUS["Cluster"]
    CLUS --> MINI["Minikube dev"]
    CLUS --> PROD["Cloud managed: EKS/GKE/AKS"]
    K9["Terminal k9s"] --> CLUS`,
          caption: "Del código al cluster: imágenes, Helm y tus ojos (k9s) sobre todo.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "🧭 Hoja de ruta 2026",
          md: "Sigue con el curso de CI/CD (Actions despliega tu chart con Helm) y Prometheus/Grafana para vigilar que todo siga verde. Juntos forman el cinturón completo.",
        },
        {
          t: "quiz",
          question: "¿Qué resuelve Helm en el mundo Kubernetes?",
          options: [
            "Compilar imágenes",
            "Empaquetar y gestionar despliegues reutilizables (charts)",
            "Editar YAML",
            "Conectar bases de datos",
          ],
          correct: 1,
          explanation:
            "Helm agrupa manifiestos YAML en 'charts' con plantillas y versiones: instalas una app completa con `helm install`. Es el packaging del ecosistema.",
        },
      ],
    },
  ],
};