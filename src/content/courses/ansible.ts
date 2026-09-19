import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "ansible",
  emoji: "🍒",
  title: "Ansible",
  subtitle: "Configuración · Agentes · Playbooks",
  category: "devops",
  tagline: "Configura cientos de servidores sin instalar nada en ellos.",
  description:
    "Ansible automatiza la configuración y el despliegue de servidores de forma **agentless** (sin instalar nada en destino, solo SSH). Sus playbooks son legibles como un instructivo y usan YAML. Es la herramienta de facto para 'hacer las cosas bien en muchas máquinas'.",
  objectives: [
    "Entender el modelo sin agentes y por SSH",
    "Leer y escribir playbooks YAML",
    "Dominar módulos, tareas y handlers",
    "Automatizar configuración con roles",
    "Distinguir Ansible (configurar) de Terraform (aprovisionar)",
  ],
  prerequisites: ["Saber SSH y el curso de Terraform te dan contexto perfecto."],
  color: "#e12728",
  gradient: ["#e12728", "#ffffff"],
  lessons: [
    {
      id: "ansible-que-es",
      title: "Configura (no aprovisiona)",
      durationMin: 14,
      summary: "Ansible vs Terraform: la pareja que se complementa.",
      xp: 45,
      blocks: [
        {
          t: "theory",
          md: "**Terraform** crea máquinas (**aprovisiona**). **Ansible** les aplica software y configuración (**configura**): instala nginx, crea usuarios, copia archivos, reinicia servicios.\n\nAnsible funciona **sin agente**: conecta por SSH desde tu máquina (o CI) y ejecuta tareas. Simplicidad que enamora.\n\n> **Analogía del fontanero con maleta:** no tienes que reformar cada casa con plomeros fijos; el fontanero (Ansible) llega con su maleta de herramientas (módulos), hace la faena y se va. Cero instalaciones permanentes en destino.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    CTRL[Control node<br/>tu máquina con Ansible] -->|"SSH + playbook"| INV[Inventario<br/>hosts y grupos]
    INV --> S1[server-1]
    INV --> S2[server-2]
    INV --> S3[server-3]
    S1 -->|estado deseado| R1[nginx 1.24 instalado y activo]
    S2 --> R2
    S3 --> R3`,
          caption: "Un solo playbook aplica el MISMO estado a todas las máquinas del inventario, por SSH.",
        },
        {
          t: "callout",
          kind: "info",
          title: "🔑 La llave es SSH",
          md: "Ansible necesita acceso SSH al destino y Python en el servidor remoto. Nada más. Por eso se integra tan bien con Terraform: Terraform crea los hosts, Ansible los configura.",
        },
        {
          t: "quiz",
          question: "¿Cuál es la diferencia clave con Terraform?",
          options: [
            "Ansible crea máquinas; Terraform las configura",
            "Terraform aprovisiona infra; Ansible configura el software de las máquinas",
            "Son exactamente el mismo programa",
            "Ansible no usa SSH",
          ],
          correct: 1,
          explanation:
            "Terraform define la infraestructura (crear servidores/redes); Ansible define el estado del software dentro de esos servidores. Se usan juntos a diario.",
        },
      ],
    },
    {
      id: "ansible-playbook",
      title: "Playbooks: el instructivo YAML",
      durationMin: 18,
      summary: "Tareas declarativas con módulos y estado 'idempotente'.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Un **playbook** es una lista de *plays*: cada play apunta a ciertos hosts y define **tareas**. Cada tarea usa un **módulo** (built-in) y declara el estado deseado.\n\nLa clave: **idempotencia** — ejecutar el playbook 1 o 100 veces da el mismo resultado. Si nginx ya está instalado, no lo reinstala.",
        },
        {
          t: "code",
          lang: "yaml",
          title: "playbook.yml de un servidor web",
          code: `---
- name: Configurar servidores web
  hosts: webservers          # grupo del inventario
  become: true               # sudo
  tasks:
    - name: Instalar nginx
      apt:                    # módulo para Debian/Ubuntu
        name: nginx
        state: present        # idempotente: "I want it installed"
    - name: Copiar configuración
      copy:
        src: ./nginx.conf
        dest: /etc/nginx/nginx.conf
      notify: reiniciar nginx # handler: solo si cambió
  handlers:
    - name: reiniciar nginx
      service:
        name: nginx
        state: restarted`,
          run: false,
        },
        {
          t: "demo",
          title: "ansible-playbook en acción",
          lines: [
            {
              prompt: "ansible-playbook -i hosts playbook.yml",
              out: ["PLAY [Configurar servidores web] ***************************", "TASK [Instalar nginx] ***********************************", "ok: [server-1]   # ya estaba -> no reinstala (idempotente)", "changed: [server-2]", "TASK [Copiar configuración] ******************************", "changed: [server-1]", "NO MORE TASKS TO RUN ✔"],
            },
            {
              prompt: "ansible-playbook -i hosts playbook.yml   (segunda vez)",
              out: ["TASK [Instalar nginx]  ok: [server-1]  ok: [server-2]", "TASK [Copiar configuración]  ok: (...)   # todo 'ok', nada 'changed'", "PLAY RECAP ************************************************", "server-1 : ok=3 changed=0 unreachable=0 failed=0", "server-2 : ok=3 changed=0 unreachable=0 failed=0"],
            },
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "⚖️ La regla del estado",
          md: "Di el ESTADO (instalado, activo, presente), no el PROCEDIMIENTO ('ejecuta apt-get install'). Así Ansible converge, corrige el drift y es seguro repetirlo.",
        },
        {
          t: "quiz",
          question: "¿Qué significa que un playbook sea idempotente?",
          options: [
            "Que falla si falla la red",
            "Que repetirlo da el mismo resultado sin cambios innecesarios",
            "Que solo corre una vez",
            "Que borra y recrea todo",
          ],
          correct: 1,
          explanation:
            "Idempotencia: si el estado ya se cumple, la tarea es un 'ok' y no hace nada. Ejecutar 100 veces = mismo resultado, sin efectos secundarios.",
        },
      ],
    },
    {
      id: "ansible-inventario",
      title: "Inventario y módulos estrella",
      durationMin: 15,
      summary: "Organiza tus máquinas y los módulos que usas 90% del tiempo.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "El **inventario** lista tus máquinas en grupos:",
        },
        {
          t: "code",
          lang: "ini",
          title: "hosts (inventario)",
          md: "El inventario agrupa: ejecutas playbooks contra grupos enteros. Se actualiza desde Terraform (dinámico).",
          code: `[webservers]
server-1 ansible_host=10.0.1.10
server-2 ansible_host=10.0.1.11

[dbs]
db-1 ansible_host=10.0.2.5

[prod:children]
webservers
dbs`,
          run: false,
        },
        {
          t: "quiz",
          question: "¿Qué módulo usarías para copiar un archivo al servidor?",
          options: ["copy", "fetch", "ping", "shell"],
          correct: 0,
          explanation:
            "`copy` transfiere archivos locales a destino y declara su contenido/permisos; es de los módulos más usados.",
        },
      ],
    },
    {
      id: "ansible-roles",
      title: "Roles: playbooks reutilizables",
      durationMin: 16,
      summary: "Organiza lo repetible como componentes.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Un **role** empaqueta una 'profesión' reutilizable: `nginx`, `postgres`, `app-deploy`. Tiene estructura estándar:\n\n```\nroles/app/\n  tasks/main.yml    → qué hace\n  handlers/main.yml → acciones a reacciones\n  templates/        → archivos con variables (Jinja2)\n  vars/  defaults/  → variables\n```\n\nEl playbook se vuelve una lista de roles: `roles: [nginx, postgres, app-deploy]`.",
        },
        {
          t: "code",
          lang: "yaml",
          title: "Un playbook que orquesta roles",
          code: `---
- name: Desplegar stack completo
  hosts: prod
  become: true
  roles:
    - common        # usuarios, firewall, updates
    - nginx         # reverse proxy
    - app           # despliega la última imagen
    - postgres      # base de datos`,
          run: false,
        },
        {
          t: "demo",
          title: "Aplicando roles en paralelo",
          lines: [
            {
              prompt: "ansible-playbook stack.yml",
              out: ["PLAY [Desplegar stack completo]", "TASK [common : crear usuario admin] **** ok: [server-1]", "TASK [common : actualizar paquetes] * ok: [server-1]", "TASK [nginx : instalar y configurar] **** changed: [server-1]", "TASK [app : desplegar v1.4.3] ************ changed: [server-1]"],
            },
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "🧩 Roles = 'funciones' de Ansible",
          md: "Como los módulos de Terraform: encapsulas la receta una vez y la reutilizas en todos tus entornos y proyectos. El refactor de tu infra.",
        },
        {
          t: "quiz",
          question: "¿Qué estructura empaqueta un role de Ansible?",
          options: [
            "tasks + handlers + templates + vars",
            "solo YAML vertical",
            "un solo archivo enorme",
            "una imagen Docker",
          ],
          correct: 0,
          explanation:
            "Cada role tiene su carpeta estándar: tareas, handlers, plantillas Jinja2 y variables por niveles (defaults/vars).",
        },
      ],
    },
    {
      id: "ansible-flujo",
      title: "Proyecto: día a día con Ansible",
      durationMin: 18,
      summary: "Terraform crea, Ansible configura, CI despliega.",
      xp: 65,
      blocks: [
        {
          t: "diagram",
          mermaid: `flowchart LR
    TF[Terraform<br/>crea VMs + red] --> INV[Inventario dinámico]
    INV --> AN[Ansible<br/>configura servidores]
    AN --> AP[App + nginx + postgres]
    CI[GitHub Actions<br/>despliega] --> AP
    AP --> MON[Prometheus vigila]`,
          caption: "La sinfonía del mundo real: Terraform/IaC → Ansible/config → CI/CD → monitoring.",
        },
        {
          t: "demo",
          title: "La mañana de un SRE",
          lines: [
            {
              prompt: "terraform apply   # crea 2 servidores nuevos",
              out: ["Apply complete! Resources: 2 added."],
            },
            {
              prompt: "ansible-playbook -i hosts.yml web.yml",
              out: ["PLAY RECAP:", "new-server-1 : ok=7 changed=6 unreachable=0 failed=0", "new-server-2 : ok=7 changed=6 unreachable=0 failed=0", "✓ servidores configurados en ~40s"],
            },
            {
              prompt: "ansible -i hosts.yml all -m ping",
              out: ["new-server-1 | SUCCESS => { \"ping\": \"pong\" }", "new-server-2 | SUCCESS => { \"ping\": \"pong\" }"],
            },
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "🧰 Tu toolbox de infra queda completo",
          md: "Docker (empaqueta) · Kubernetes (orquesta) · Terraform (aprovisiona) · Ansible (configura) · CI/CD (despliega) · Prometheus (vigila). Ese es el stack completo del especialista 2026.",
        },
        {
          t: "quiz",
          question: "¿Cómo automatizarías 'instalar nginx y copiar config en 50 servidores'?",
          options: [
            "SSH a cada uno a mano",
            "Un playbook de Ansible contra el grupo webservers",
            "Un Dockerfile",
            "terraform console",
          ],
          correct: 1,
          explanation:
            "Un playbook + inventario aplica el mismo estado a las 50 máquinas en minutos, de forma idempotente y revisable.",
        },
      ],
    },
  ],
};