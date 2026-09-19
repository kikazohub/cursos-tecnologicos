import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "prometheus-grafana",
  emoji: "📈",
  title: "Prometheus + Grafana",
  subtitle: "Métricas · Alertas · Dashboards",
  category: "devops",
  tagline: "Vigila la salud de tus sistemas en tiempo real.",
  description:
    "Cuando tu sistema crece, '¿está todo bien?' deja de responderse a ojo. Prometheus recolecta métricas de todo, y Grafana las pinta en dashboards preciosos con alertas. Es el stack observability de facto del mundo cloud.",
  objectives: [
    "Entender los 3 pilares: métricas, logs y trazas",
    "Saber qué métricas recolecta Prometheus y cómo",
    "Escribir consultas PromQL básicas a medianas",
    "Construir dashboards de Grafana con paneles",
    "Montar alertas que avisan antes de que llore el cliente",
  ],
  prerequisites: ["El curso de Docker (montarás el stack con Compose)."],
  color: "#e6522c",
  gradient: ["#e6522c", "#f4683c"],
  lessons: [
    {
      id: "obs-pilares",
      title: "Los 3 pilares de la observabilidad",
      durationMin: 14,
      summary: "Métricas, logs y trazas: cada uno responde una pregunta.",
      xp: 45,
      blocks: [
        {
          t: "theory",
          md: `Para saber cómo está tu sistema miras tres cosas complementarias:\n\n- **Métricas**: números a lo largo del tiempo (\`cpu\`, \`peticiones/s\`, \`latencia\`). Responden *¿qué está pasando?*.\n- **Logs**: eventos discretos (\`"error: timeout en checkout"\`). Responden *¿por qué?*.\n- **Trazas**: el recorrido de UNA petición por todos los servicios. Responden *¿dónde?*.\n\n**Prometheus** es el rey de las métricas; **Grafana** su rostro visual. Ojo: los logs y trazas van por otro lado (Loki/tempo — también de Grafana).`,
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    P[¿Qué está pasando?<br/>MÉTRICAS] --> SYS[Métricas del sistema + app<br/>recogidas cada 15s]
    C[¿Dónde ha ido esa petición?<br/>TRAZAS] --> SYS2[Recorrido por servicios]
    L[¿Por qué exactamente?<br/>LOGS] --> SYS3[Eventos con detalle]
    SYS --> PRO[Prometheus]
    PRO --> GRA[Grafana: dashboards + alertas]`,
          caption: "Los tres registros se complementan; Prometheus+Grafana cubren el pilar de métricas.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "🧭 Empezando simple",
          md: "No montes observabilidad de golpe. Arranca con 4 métricas (CPU, memoria, peticiones/s, latencia p95), una alerta y un dashboard. Después crece.",
        },
        {
          t: "quiz",
          question: "¿Qué pillar responde a '¿por qué falló?'",
          options: ["Métricas", "Logs", "Trazas", "Ninguno"],
          correct: 1,
          explanation:
            "Los logs capturan eventos detallados con contexto; las métricas dan el panorama y las trazas el recorrido.",
        },
      ],
    },
    {
      id: "prom-scrape",
      title: "Prometheus: scrape y métricas",
      durationMin: 16,
      summary: "El recolector que junta números de todo.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: `Prometheus **descubre y scrapea** (extrae) métricas de los servicios por HTTP cada cierto intervalo (default 15s).\n\nCada servicio expone un endpoint \`/metrics\` con texto plano:\n\n\`\`\`\n# HELP http_request_total Peticiones HTTP\nhttp_request_total{method=\"GET\",path=\"/api\"} 15802\n\`\`\`\n\nLos **exporters** traducen métricas de terceros: \`node_exporter\` (máquina), \`cadvisor\` (docker), \`kube-state-metrics\` (k8s).`,
        },
        {
          t: "code",
          lang: "yaml",
          title: "prometheus.yml básico",
          code: `global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "app"
    static_configs:
      - targets: ["api:3000"]      # nuestro servicio

  - job_name: "node"
    static_configs:
      - targets: ["node-exporter:9100"]

  - job_name: "kubernetes"
    kubernetes_sd_configs:
      - role: pod`,
          run: false,
        },
        {
          t: "demo",
          title: "Consultando Prometheus",
          lines: [
            {
              prompt: "curl http://localhost:9090/metrics | head",
              out: ["# HELP go_goroutines Number of goroutines", "go_goroutines 42", "# HELP promhttp_metric_handler_requests_total Total nr", "promhttp_metric_handler_requests_total{code=\"200\"} 1288"],
            },
            {
              prompt: "(en la UI) http_request_total{method=\"GET\"}",
              out: ["http_request_total{method=\"GET\",path=\"/api\\/health\"} 820", "http_request_total{method=\"GET\",path=\"/api\\/cursos\"} 1200"],
            },
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "🏷️ Etiquetas = dimensiones",
          md: "Las labels (`method`, `path`) son lo que permite agrupar y filtrar en PromQL. Diseña labels con cabeza: pocas, estables y de alto valor.",
        },
        {
          t: "quiz",
          question: "¿Cómo obtiene Prometheus las métricas de una app?",
          options: [
            "Se las envía por email",
            "Las scrapea por HTTP cada intervalo desde /metrics",
            "Las lee de la base de datos",
            "Docker se las copia",
          ],
          correct: 1,
          explanation:
            "Modelo pull: Prometheus consulta periódicamente el endpoint `/metrics` de cada objetivo. Simple y robusto.",
        },
      ],
    },
    {
      id: "prom-promql",
      title: "PromQL: el idioma de las consultas",
      durationMin: 18,
      summary: "Filtra, tasa y compara métricas.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "**PromQL** es SQL para métricas. Lo esencial:\n\n- `http_requests_total` → valor bruto.\n- `rate(m[5m])` → peticiones por segundo (media móvil 5 min).\n- `histogram_quantile(0.95, rate(latency_bucket[5m]))` → latencia p95.\n- `avg by (path) (http_requests_total)` → agrupar por etiqueta.\n- `>` `<` comparan y devuelven solo lo que cumple.",
        },
        {
          t: "code",
          lang: "shell",
          title: "Los 4 patrones que usarás todos los días",
          code: `# 1) Contador a tasa por segundo
rate(http_requests_total[5m])

# 2) Latencia percentil 95
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))

# 3) ¿Qué endpoints superan 2 rps? (base para alertas)
rate(http_requests_total[1m]) > 2

# 4) Uso de CPU por máquina
100 - avg(irate(node_cpu_seconds_total{mode="idle"}[5m])) by (instance) * 100`,
          run: false,
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    A["Contador crudo<br/>http_requests_total"] -->|"rate[5m]"| B["peticiones/segundo"]
    B --> C{"¿> 2 rps?"}
    C -->|"sí"| D["Aparece en dashboard / alerta"]`,
          caption: "El flujo PromQL: contadores crudos → tasas → umbrales para alertar.",
        },
        {
          t: "callout",
          kind: "warning",
          title: "⚠️ Contadores vs gauges",
          md: "Un **counter** solo aumenta (peticiones totales): le aplicas `rate()`. Un **gauge** sube y baja (cpu, memoria): lo pintas tal cual. Confundirlos es el error número 1 de novatos en PromQL.",
        },
        {
          t: "quiz",
          question: "¿Qué calcula `rate(counter[5m])`?",
          options: [
            "El valor actual del contador",
            "La tasa de cambio por segundo en los últimos 5 minutos",
            "El promedio de 5 métricas",
            "Nada, es un error",
          ],
          correct: 1,
          explanation:
            "`rate` convierte un contador que crece en peticiones/segundo (media sobre la ventana). Es LA consulta base de PromQL.",
        },
      ],
    },
    {
      id: "grafana-dash",
      title: "Grafana: la cara bonita",
      durationMin: 16,
      summary: "Dashboards, paneles y variables.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "**Grafana** conecta con Prometheus y pinta **dashboards**: cuadrículas de **paneles** (gráficas de tiempo, gauges, tablas, stat).\n\nTrucos pro:\n- **Variables de dashboard** (`$instance`, `$job`) para filtrar todo con un dropdown.\n- **Alerting unificado**: reglas + notificaciones (Slack, email, webhook) desde la misma UI.\n- Importar dashboards públicos con un ID (p. ej. el 'Node Exporter Full' es bombardero).",
        },
        {
          t: "demo",
          title: "Creando un dashboard",
          lines: [
            {
              prompt: "① Add → New panel → query PromQL",
              out: ["Query: rate(http_requests_total[5m])", "Legend: {{path}}", "Guardar → 'Peticiones por endpoint'"],
            },
            {
              prompt: "② Añade variable para filtrar por instancia",
              out: ["Settings → Variables → New: instance", "Query: label_values(node_uname_info, instance)"],
            },
            {
              prompt: "③ Alerta: latencia p95 > 500ms",
              out: ["Panel → Alert: expr: histogram_quantile(...) > 0.5", "For: 5m (espera 5 min antes de avisar)", "Notify: canal Slack #incidents"],
            },
          ],
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    PRO[Prometheus] -->|datasource| GRA[Grafana]
    GRA --> D1[Dashboard: Request rate]
    GRA --> D2[Dashboard: Infra]
    GRA --> AL[Alertas + notificaciones]
    AL --> SL[Slack/email/webhook]`,
          caption: "Grafana agrega Prometheus como datasource y genera dashboards y alertas.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "🎨 El SLO manda",
          md: "Pon en tu dashboard principal los 4 números que importan: disponibilidad, latencia p95, tasa de error y capacidad. Todo lo demás es debug.",
        },
        {
          t: "quiz",
          question: "¿Cómo usa Grafana un dashboard?",
          options: [
            "Como un script de deploys",
            "Organizando paneles con consultas PromQL + variables × alertas",
            "Como editor de código",
            "Como base de datos",
          ],
          correct: 1,
          explanation:
            "Grafana compone paneles (cada uno con su query PromQL), variables para filtrar y reglas de alerta centralizadas.",
        },
      ],
    },
    {
      id: "obs-proyecto",
      title: "Proyecto: stack observability completo",
      durationMin: 20,
      summary: "Compose para levantar todo y vigilar una app real.",
      xp: 65,
      blocks: [
        {
          t: "code",
          lang: "yaml",
          title: "docker-compose del stack",
          code: `services:
  app:
    build: .
    ports: ["3000:3000"]
    command: ["node", "server.js"]   # expone /metrics

  prometheus:
    image: prom/prometheus
    ports: ["9090:9090"]
    volumes: [./prometheus.yml:/etc/prometheus/prometheus.yml]

  node-exporter:
    image: prom/node-exporter
    ports: ["9100:9100"]

  grafana:
    image: grafana/grafana
    ports: ["3001:3000"]
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin`,
          run: false,
        },
        {
          t: "demo",
          title: "El stack en marcha",
          lines: [
            {
              prompt: "docker compose up -d",
              out: ["✔ Container obs-app-1           Started", "✔ Container obs-prometheus-1   Started", "✔ Container obs-node-exporter-1 Started", "✔ Container obs-grafana-1      Started"],
            },
            {
              prompt: "curl localhost:9090/api/v1/targets | jq '.data.activeTargets | length'",
              out: ["4  ✔ (app, prometheus, node-exporter)"],
            },
            {
              prompt: "http://localhost:3001  → dashboards",
              out: ["1. Request rate por endpoint  [status OK]", "2. CPU/mem del host            [status OK]", "3. Alerta: p95 > 500ms         [notification test enviada]"],
            },
          ],
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    APP[App :3000<br/>/metrics] --> PRO[Prometheus :9090]
    NX[node-exporter :9100] --> PRO
    PRO --> GRA[Grafana :3001]
    GRA -->|alerta p95| SL[Slack #incidents]
    USR[SRE] --> GRA`,
          caption: "El stack de observabilidad completo: scrape, pintar, alertar.",
        },
        {
          t: "callout",
          kind: "tip",
          title: "🥇 Y con esto... cierras el cinturón DevOps",
          md: "Docker empaqueta, K8s orquesta, Terraform/Ansible provisionan+configuran, CI/CD despliega y Prometheus+Grafana vigilan. Estás viendo el stack completo. En el perfil de la plataforma tienes racha y XP: ¡sigue imparable!",
        },
        {
          t: "quiz",
          question: "¿Qué papel juega node-exporter en este stack?",
          options: [
            "Publica métricas del sistema del host a Prometheus",
            "Despliega aplicaciones",
            "Sustituye a Grafana",
            "Almacena logs",
          ],
          correct: 0,
          explanation:
            "node-exporter expone métricas del sistema (CPU, memoria, disco) en /metrics para que Prometheus las scrapee.",
        },
      ],
    },
  ],
};