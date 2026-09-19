import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "terraform",
  emoji: "🏗️",
  title: "Terraform",
  subtitle: "IaC · HCL · Infraestructura",
  category: "devops",
  tagline: "Tu infraestructura en la nube como código versionado.",
  description:
    "Terraform inauguró la Infraestructura como Código (IaC): defines servidores, redes y bases de datos en archivos declarativos, y Terraform crea, actualiza y destruye todo de forma determinista. El mismo YAML/plan/diff que usas con Kubernetes, pero para la nube entera.",
  objectives: [
    "Entender qué es IaC y por qué sustituye a clics en consolas",
    "Leer y escribir HCL: providers, resources y variables",
    "Dominar el ciclo plan → apply → destroy",
    "Ver el estado y evitar el drift",
    "Montar una infraestructura mínima end-to-end",
  ],
  prerequisites: ["Nociones de nube (AWS/GCP/Azure) ayudan, no son obligatorias."],
  color: "#7b42bc",
  gradient: ["#7b42bc", "#5c2d91"],
  lessons: [
    {
      id: "tf-que-es",
      title: "Infraestructura como Código",
      durationMin: 14,
      summary: "Adiós a los clics y a la infra al tuntún.",
      xp: 45,
      blocks: [
        {
          t: "theory",
          md: "**IaC** = definir tu infraestructura (servidores, redes, BD) en archivos que se versionan como código.\n\nTerraform (de HashiCorp) lo hace con **HCL**. Sus superpoderes:\n\n- **Reproducible**: el mismo código → el mismo entorno.\n- **Revisable**: cambios con plan/diff antes de tocar nada.\n- **Eliminable**: destruye entornos completos a demanda.\n\n> **Analogía de la partitura:** antes, montar la orquesta (infra) era improvisar en vivo desde la consola. Terraform es la partitura: cualquier director reproduce la misma obra exactamente.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    HF[Archivos .tf<br/>declarativos] -->|terraform plan| PLAN[Plan:<br/>qué crea/cambia]
    PLAN -->|terraform apply| API[Nube API]
    API --> RES[Recursos creados]
    RES -->|terraform state| ST[Estado local/remoto]
    ST -->|terraforma para segura| API`,
          caption: "Ciclo de Terraform: declara → planifica → aplica → guarda el estado para siguientes cambios.",
        },
        {
          t: "callout",
          kind: "info",
          title: "🆚 Terraform vs Ansible",
          md: "Terraform **aprovisiona** infraestructura (crea servidores/redes). Ansible **configura** lo que hay dentro (instala paquetes, servicios). El curso siguiente lo aclara.",
        },
        {
          t: "quiz",
          question: "¿Qué significa exactamente 'Infraestructura como Código'?",
          options: [
            "Programar la infraestructura de una ciudad",
            "Definir la infraestructura en archivos versionables en lugar de clics",
            "Cifrar la nube",
            "Contenedores más grandes",
          ],
          correct: 1,
          explanation:
            "IaC convierte tu infra en texto declarativo: revisable, reproducible y destruible. Terraform es su paladín.",
        },
      ],
    },
    {
      id: "tf-hcl",
      title: "HCL: el idioma de Terraform",
      durationMin: 18,
      summary: "Providers, resources y variables.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Tres piezas de todo fichero `.tf`:\n\n1. **`provider`**: qué nube (aws, google, azure...) y credenciales.\n2. **`resource`**: UN objeto concreto a crear.\n3. **`variable`/`output`**: parametriza entradas y expone salidas.\n\nLos recursos se referencian entre sí: `aws_instance.web` usa el id de la `aws_vpc.main`.",
        },
        {
          t: "code",
          lang: "hcl",
          title: "main.tf legible",
          md: "Nota: `hcl` no es un idioma de resaltado soportado por todos; lo muestro también como ejemplo didáctico. El patrón es idéntico en cualquier nube:",
          code: `provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "web" {
  name = "web-sg"
  ingress {
    from_port = 443
    to_port   = 443
    protocol  = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"

  vpc_security_group_ids = [aws_security_group.web.id]

  tags = { Name = "servidor-web" }
}

output "ip_publica" {
  value = aws_instance.web.public_ip
}`,
          run: false,
        },
        {
          t: "demo",
          title: "Init + plan + apply",
          lines: [
            {
              prompt: "terraform init",
              out: ["Initializing provider plugins...", "Installing hashicorp/aws v5.90.0...", "Terraform has been successfully initialized!"],
            },
            {
              prompt: "terraform plan",
              out: ["Terraform will perform the following actions:", "", "  # aws_instance.web will be created", "  + resource \"aws_instance\" \"web\" {", "      + ami                  = \"ami-0c55b159cbfafe1f0\"", "      + instance_type        = \"t3.micro\"", "      ...", "Plan: 2 to add, 0 to change, 0 to destroy."],
            },
            {
              prompt: "terraform apply -auto-approve",
              out: ["aws_security_group.web: Creating...", "aws_instance.web: Creating...", "Apply complete! Resources: 2 added, 0 changed, 0 destroyed.", "Outputs:", "ip_publica = \"54.209.11.22\""],
            },
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "🎨 HCL se lee como una lista de intenciones",
          md: "`resource \"tipo\" \"nombre\" { atributos }`. Con eso declaras TODO: instancias, buckets, clusters, DNS. Luego Terraform lo materializa.",
        },
        {
          t: "quiz",
          question: "¿Qué hace `terraform plan`?",
          options: [
            "Crea los recursos",
            "Muestra qué haría apply sin cambiar nada",
            "Borra el estado",
            "Instala providers",
          ],
          correct: 1,
          explanation:
            "`plan` calcula un diff entre el estado actual y el deseado: enseñar antes de tocar, como un dry-run.",
        },
      ],
    },
    {
      id: "tf-estado",
      title: "Estado y drift",
      durationMin: 15,
      summary: "Donde viven los recursos y qué pasa si cambian detrás de ti.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Terraform guarda **estado** (`terraform.tfstate`): el mapa real de qué ha creado. Lo usa para calcular diffs.\n\n- En serio → el estado se guarda **remoto** (S3 backend, Terraform Cloud).\n- **Drift**: alguien cambia un recurso a mano → Terraform lo detecta en `plan` y lo corrige.\n- `terraform state list` muestra todos los recursos bajo gestión.",
        },
        {
          t: "diagram",
          mermaid: `flowchart TD
    WANT[Código deseado<br/>.tf] -->|compare| TF[Terraform]
    IS[Estado real<br/>tfstate] -->|compare| TF
    TF -->|iguales| OK[Nada que hacer]
    TF -->|diff| APPLY[apply vuelve al estado:<br/>crea / actualiza / destruye]
    DRIFT[Cambio manual ajeno<br/>a Terraform] -->|drift detectado| TF`,
          caption: "El estado es la verdad guardada; el drift es su discrepancia con el código.",
        },
        {
          t: "callout",
          kind: "danger",
          title: "🔐 El tfstate es sagrado (y delicado)",
          md: "Puede contener secretos y no debe vivirse solo en un `.git`. En equipos: backend remoto con locking para que dos personas no apliquen a la vez.",
        },
        {
          t: "quiz",
          question: "¿Qué es el 'drift' en Terraform?",
          options: [
            "Un tipo de recurso",
            "La diferencia entre infra real y lo declarado en código",
            "Una nube específica",
            "Un comando de limpieza",
          ],
          correct: 1,
          explanation:
            "Si alguien cambia la infra a mano, el estado real difiere del código: eso es drift, y terraform plan lo revela y apply lo corrige.",
        },
      ],
    },
    {
      id: "tf-modulos",
      title: "Módulos y variables",
      durationMin: 16,
      summary: "Reutiliza infraestructura como piezas LEGO.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Un **módulo** es un bloque de recursos reutilizable con sus variables y outputs. Como funciones en código:\n\n- Módulos del **registro público** (registry.terraform.io): vpc, rds, eks...\n- Tus propios módulos: `module \"web\" \"../modules/web\"`.\n- Las **variables** parametrizan y los **outputs** comunican valores entre módulos.",
        },
        {
          t: "code",
          lang: "hcl",
          title: "Usar un módulo del registro",
          code: `# algo así usarías para una VPC modular
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.8.1"

  name = "mi-vpc"
  cidr = "10.0.0.0/16"

  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.10.0/24"]

  enable_nat_gateway = true
}

# y luego lo reutilizas en otro entorno cambiando solo variables
module "vpc_staging" {
  source = "terraform-aws-modules/vpc/aws"
  name   = "staging-vpc"
  cidr   = "10.1.0.0/16"
}`,
          run: false,
        },
        {
          t: "demo",
          title: "Module + output flow",
          lines: [
            {
              prompt: "terraform init && terraform plan",
              out: ["Downloading registry.terraform.io/terraform-aws-modules/vpc 5.8.1...", "Plan: 18 to add, 0 to change, 0 to destroy."],
            },
            {
              prompt: "terraform output",
              out: ["vpc_id = \"vpc-0a1b2c3d\"", "public_subnet_ids = [\"subnet-1a\", \"subnet-2b\"]"],
            },
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "🍱 La regla del renacido",
          md: "Si vas a crear el mismo stack dos veces (dev/staging/prod), conviértelo en módulo. DRY en la nube también existe.",
        },
        {
          t: "quiz",
          question: "¿Qué es un módulo de Terraform?",
          options: [
            "Una licencia",
            "Un paquete de recursos reutilizable con entradas y salidas",
            "Un tipo de provider",
            "Un backup",
          ],
          correct: 1,
          explanation:
            "Un módulo encapsula infra reutilizable (como una función): recibe variables, crea recursos y expone outputs.",
        },
      ],
    },
    {
      id: "tf-flujo",
      title: "Proyecto: infra de un servicio web",
      durationMin: 18,
      summary: "VPC + instancia + BD + deploy con un solo apply.",
      xp: 65,
      blocks: [
        {
          t: "theory",
          md: "Montamos el stack completo de un servicio web: red (VPC + subredes), un servidor (EC2) y una base de datos (RDS). Todo declarado, reproducible y destruible con 2 comandos.",
        },
        {
          t: "diagram",
          mermaid: `flowchart TD
    V["module vpc<br/>red 10.0.0.0/16"] --> SG[Security Group<br/>HTTPS/SSH]
    SG --> EC2[aws_instance.web<br/>t3.micro]
    V --> RDS[(aws_db_instance.app<br/>postgres)]
    EC2 --> RDS
    INT[Internet] -->|443| EC2`,
          caption: "La topología de un servicio web típico en AWS/Terraform.",
        },
        {
          t: "demo",
          title: "El ciclo completo de vida",
          lines: [
            {
              prompt: "terraform plan -out=tf.plan",
              out: ["Plan: 24 to add, 0 to change, 0 to destroy."],
            },
            {
              prompt: "terraform apply tf.plan",
              out: ["Apply complete! Resources: 24 added, 0 changed, 0 destroyed."],
            },
            {
              prompt: "curl https://54.209.11.22",
              out: ["<html>... ¡tu app vive! ...</html>"],
            },
            {
              prompt: "terraform destroy -auto-approve",
              out: ["Destroy complete! Resources: 24 destroyed.", "✓ sin sorpresas: factura cero a la mañana siguiente"],
            },
          ],
        },
        {
          t: "callout",
          kind: "tip",
          title: "🧠 La tríada que domina IaC",
          md: "`plan` (qué hará), `apply` (hazlo), `destroy` (deshaz). Millones de plataformas (incluida esta app de cursos) se operan con esa tríada cuando escalan.",
        },
        {
          t: "quiz",
          question: "¿Por qué es TAN valioso poder 'destruir' una infra completa?",
          options: [
            "Porque ahorra abrazos",
            "Porque los entornos temporales (PR, tests) se levantan y limpian solos",
            "Porque borra backups",
            "Porque ocupa menos RAM",
          ],
          correct: 1,
          explanation:
            "Entornos efímeros por PR, demos o tests aislados: crea, prueba, destruye. IaC hace esto trivial y es el sueño de todo equipo.",
        },
      ],
    },
  ],
};