import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "go",
  emoji: "🐹",
  title: "Go (Golang)",
  subtitle: "Go · Backend · Nube",
  category: "lenguajes",
  tagline: "El lenguaje de Google para backend de alto rendimiento y nube.",
  description:
    "Go nació en Google por una frustración: compilar y desplegar era demasiado lento. Go compila a un solo binario rapidísimo, con concurrencia de serie y una sintaxis mínima. Es el idioma de Docker, Kubernetes y Terraform — tres de tus próximos cursos.",
  objectives: [
    "Entender por qué Go domina el backend moderno",
    "Escribir programas con sintaxis minimalista y compilación instantánea",
    "Dominar goroutines y canales: la concurrencia hecha fácil",
    "Servir JSON en una API real ejecutada aquí mismo",
    "Construir un programa concurrente funcional",
  ],
  prerequisites: ["Nociones de cualquier lenguaje ayuda a comparar."],
  color: "#00add8",
  gradient: ["#00add8", "#5dc9e2"],
  lessons: [
    {
      id: "go-fundamentos",
      title: "Fundamentos de Go",
      durationMin: 15,
      summary: "Hola mundo, variables y la filosofía del 'menos es más'.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Go odia la complejidad innecesaria. Su creador, Rob Pike, resume la filosofía en una frase: *\"La simplicidad es la sofisticación final\"*. Menos palabras clave, menos magia, un solo estilo obligatorio (`gofmt`).\n\n> **Analogía del bisturí:** Donde otros lenguajes dan un cuchillo multiusos, Go da un bisturí: hace una cosa increíblemente bien, con la menor superficie posible para esconder bugs.",
        },
        {
          t: "code",
          lang: "go",
          title: "Hola mundo e inferencia de tipos",
          code: `package main

import "fmt"

func main() {
    fmt.Println("¡Hola desde Go! 🚀")

    // := infiere el tipo automáticamente
    nombre := "Ada"
    edad := 38
    activo := true

    fmt.Printf("%s tiene %d años (activo=%v)\\n", nombre, edad, activo)

    // var permite declarar con tipo explícito
    var precio float64 = 99.99
    fmt.Printf("Precio: %.2f\\n", precio)
}`,
          run: true,
        },
        {
          t: "code",
          lang: "go",
          title: "Tipos y no-usados",
          code: `package main

import "fmt"

func main() {
    // Go exige usar cada variable importada y declarada
    var entero int = 42
    var texto string = "backend"
    var lista [3]int = [3]int{10, 20, 30}
    var booleano bool = true

    fmt.Println("Entero:", entero)
    fmt.Println("Texto:", texto)
    fmt.Println("Array:", lista, "| len:", len(lista))
    fmt.Println("Booleano:", booleano)

    // Convertir tipos explícitamente
    var pi float64 = 3.14159
    fmt.Println("Pi como int:", int(pi))
}`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "💼 Perspectiva laboral",
          md: "Go es el lenguaje de Docker, Kubernetes, Terraform y una enorme porción de la infraestructura cloud. Aprender Go abre las puertas del backend y la nube de par en par.",
        },
        {
          t: "quiz",
          question: "¿Qué hace `:=` en Go?",
          options: [
            "Compara dos valores",
            "Declara y asigna una variable infiriendo el tipo",
            "Importa un paquete",
            "Inicializa un slice vacío",
          ],
          correct: 1,
          explanation:
            "`:=` es azúcar sintáctico: declara la variable *y* le asigna valor, deduciendo el tipo automáticamente. `=` solo asigna a una variable ya declarada.",
        },
      ],
    },
    {
      id: "go-control",
      title: "Funciones, errores y estructura",
      durationMin: 18,
      summary: "Código limpio y errores tratados como ciudadanos de primera clase.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "En Go no existen excepciones. Un error es **solo otro valor** que la función devuelve (normalmente el último). El patrón idiomático es: `resultado, err := funcion(); if err != nil { ... }`. Simple, explícito, imposible de ignorar por accidente.",
        },
        {
          t: "code",
          lang: "go",
          title: "Funciones y errores",
          code: `package main

import (
    "errors"
    "fmt"
)

// División segura: devuelve (resultado, error)
func dividir(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("división por cero")
    }
    return a / b, nil // nil = sin error
}

func main() {
    resultado, err := dividir(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("10 / 2 =", resultado)
    }

    // Segundo caso con error real
    res2, err2 := dividir(5, 0)
    if err2 != nil {
        fmt.Println("Segunda llamada -> Error:", err2)
    } else {
        fmt.Println("Resultado:", res2)
    }
}`,
          run: true,
        },
        {
          t: "code",
          lang: "go",
          title: "Estructuras (struct) como contratos",
          code: `package main

import "fmt"

// Un struct agrupa campos, como una clase sin herencia
type Usuario struct {
    Nombre string
    Rol    string
    Puntos int
}

type Server struct {
    Nombre string
    Puerto int
}

func main() {
    dev := Usuario{Nombre: "Grace", Rol: "admin", Puntos: 40}
    dev.Puntos += 10 // mutar campos
    fmt.Printf("%+v\\n", dev)

    srv := Server{Nombre: "api-prod", Puerto: 8080}
    fmt.Printf("Servidor %s escuchando en :%d\\n", srv.Nombre, srv.Puerto)

    // Métodos: funciones ancladas a un tipo
    fmt.Println(dev.describir())
}

func (u Usuario) describir() string {
    return u.Nombre + " con rol " + u.Rol + " (" + itoa(u.Puntos) + " pts)"
}

// Mini helper: no dependemos de strconv para no complicar el ejemplo
func itoa(n int) string {
    if n == 0 {
        return "0"
    }
    b := []byte{}
    for n > 0 {
        b = append([]byte{byte('0' + n%10)}, b...)
        n /= 10
    }
    return string(b)
}`,
          run: true,
        },
        {
          t: "quiz",
          question: "¿Qué patrón devuelven las funciones que pueden fallar en Go?",
          options: [
            "`(resultado, error)` y compruebas `err != nil`",
            "Lanzan excepciones con `throw`",
            "Devuelven `false` únicamente",
            "Imprimen el error y siguen",
          ],
          correct: 0,
          explanation:
            "Go usa el patrón explícito `(valor, error)`. Comprobar `err != nil` es obligatorio por convención y hace los fallos visibles en el flujo.",
        },
      ],
    },
    {
      id: "go-concurrencia",
      title: "Goroutines y canales",
      durationMin: 20,
      summary: "El superpoder de Go: miles de tareas concurrentes sin dolor.",
      xp: 65,
      blocks: [
        {
          t: "theory",
          md: "Concurrencia es *lidiar con muchas cosas a la vez* — como un cocinero alternando varias recetas. Go la hace increíblemente fácil con dos herramientas:\n\n- **Goroutine** → `go funcion()`: lanza una tarea ligera que corre en paralelo.\n- **Canal** → `ch := make(chan int)`: un tubo por donde fluyen datos entre goroutines, en una sola dirección a la vez, sin carreras.\n\n> **Analogía del restaurante:** cada goroutine es un cocinero con libreta. Los canales son la barra de pedidos: quien escribe y quien lee se sincronizan solos, sin candados.",
        },
        {
          t: "diagram",
          mermaid: `flowchart TD
    MAIN["main()"] -->|"go tarea(1)"| G1["gorutina 1"]
    MAIN -->|"go tarea(2)"| G2["gorutina 2"]
    MAIN -->|"go tarea(3)"| G3["gorutina 3"]
    G1 -->|"envía al canal →"| CH["Canal ch"]
    G2 -->|"envía al canal →"| CH
    G3 -->|"envía al canal →"| CH
    CH -->|"recibe ←"| REC["main() recoge 3 resultados"]
    style CH fill:#102,color:#8fc,stroke:#00add8`,
          caption: "Goroutines independientes entregan su resultado a través de un canal que las sincroniza.",
        },
        {
          t: "code",
          lang: "go",
          title: "Correr en paralelo y recoger resultados",
          code: `package main

import (
    "fmt"
    "time"
)

func trabajar(id int, ch chan<- string) {
    time.Sleep(time.Duration(id) * 100 * time.Millisecond)
    ch <- fmt.Sprintf("tarea #%d terminada", id)
}

func main() {
    ch := make(chan string, 3)

    // Lanzar 3 goroutines a la vez
    for i := 1; i <= 3; i++ {
        go trabajar(i, ch)
    }

    // Recoger los 3 resultados (se bloquea hasta que lleguen)
    for i := 1; i <= 3; i++ {
        fmt.Println("Recibido:", <-ch)
    }
    fmt.Println("(ejecutadas en ~300 ms en total, no en 900)")
}`,
          run: true,
        },
        {
          t: "callout",
          kind: "info",
          title: "⌛ Mide el cambio",
          md: "Ejecuta el mismo programa sintiendo el timing: 3 tareas de 100/200/300 ms. En serie serían 600 ms; en paralelo, ~300 ms. Ese ahorro es la concurrencia.",
        },
        {
          t: "quiz",
          question: "¿Qué crea `go funcion()`?",
          options: [
            "Un hilo del sistema operativo pesado",
            "Una goroutine: una tarea ligera que corre concurrentemente",
            "Un canal de datos",
            "Un error de compilación",
          ],
          correct: 1,
          explanation:
            "`go` antepuesto a una llamada lanza una goroutine, una tarea ultrarrápida de crear que el planificador de Go reparte entre los núcleos reales.",
        },
      ],
    },
    {
      id: "go-web",
      title: "API web con JSON",
      durationMin: 20,
      summary: "Levanta un servidor HTTP real dentro de este sandbox y consulta su API.",
      xp: 65,
      blocks: [
        {
          t: "theory",
          md: "Uno de los usos estrella de Go es servir APIs. `net/http` trae el servidor en la biblioteca estándar (¡sin frameworks obligatorios!). Aquí levantamos un servidor en memoria con `httptest`, lo llamamos como haría un cliente y leemos el JSON — **todo ejecutándose de verdad** en este sandbox.",
        },
        {
          t: "code",
          lang: "go",
          title: "Servidor + petición real",
          code: `package main

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "net/http/httptest"
    "strings"
)

type Respuesta struct {
    Mensaje string  "json:\\"mensaje\\""
    Estado  string  "json:\\"estado\\""
    Puertos []int   "json:\\"puertos\\""
}

func handler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(Respuesta{
        Mensaje: "¡API en Go corriendo!",
        Estado:  "ok",
        Puertos: []int{8080, 8081, 9090},
    })
}

func main() {
    // Servidor HTTP real en memoria (sin red externa)
    srv := httptest.NewServer(http.HandlerFunc(handler))
    defer srv.Close()

    resp, err := http.Get(srv.URL + "/ping")
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println("Status:", resp.StatusCode)
    fmt.Println("Body:", strings.TrimSpace(string(body)))
}`,
          run: true,
        },
        {
          t: "callout",
          kind: "warning",
          title: "⚠️ El JSON usa etiquetas",
          md: "`struct` con etiquetas tipo `json:\"mensaje\"` decide el nombre de las claves en el JSON de salida (por defecto saldrían como `Mensaje`). Esa anotación es el estándar en todas las APIs Go.",
        },
        {
          t: "diagram",
          mermaid: `sequenceDiagram
    participant C as Cliente (http.Get)
    participant S as Servidor Go (httptest)
    C->>S: GET /ping
    S-->>C: 200 + JSON {mensaje, estado, puertos}
    C->>C: Lee y parsea la respuesta`,
          caption: "Una petición HTTP y su respuesta JSON: el ciclo de vida de cualquier API.",
        },
        {
          t: "quiz",
          question: "¿Qué hace `json:\"mensaje\"` sobre un campo?",
          options: [
            "Lo convierte en string",
            "Indica el nombre de la clave JSON y serializa el campo",
            "Lo ignora en la respuesta",
            "Lo hace opcional",
          ],
          correct: 1,
          explanation:
            "Es una *tag* de struct: le dice a Go qué nombre usar como clave JSON al serializar, algo fundamental en APIs.",
        },
      ],
    },
    {
      id: "go-proyecto",
      title: "Proyecto: worker pool concurrente",
      durationMin: 22,
      summary: "Un grupo de trabajadores procesa números en paralelo, como en producción.",
      xp: 75,
      blocks: [
        {
          t: "theory",
          md: "El patrón **worker pool** es ubicuo en producción: N goroutines (trabajadores) consumen tareas de un canal y mandan resultados por otro. Es la arquitectura de scrapers, procesadores de colas y servicios de correos.\n\nConstruimos uno que calcula el factorial de varios números repartiendo el trabajo en paralelo.",
        },
        {
          t: "code",
          lang: "go",
          title: "Worker pool con 3 trabajadores",
          code: `package main

import (
    "fmt"
)

func factorial(n int) int {
    resultado := 1
    for i := 2; i <= n; i++ {
        resultado *= i
    }
    return resultado
}

func main() {
    trabajos := []int{5, 7, 3, 9, 4, 6, 8, 2}
    const workers = 3

    trabajosCh := make(chan int)
    resultadosCh := make(chan int)

    // Lanzar trabajadores
    for w := 0; w < workers; w++ {
        go func(id int) {
            for n := range trabajosCh {
                fmt.Printf("    worker #%d procesa %d!\\n", id, n)
                resultadosCh <- factorial(n)
            }
        }(w + 1)
    }

    // Enviar trabajos y cerrar el canal
    go func() {
        for _, n := range trabajos {
            trabajosCh <- n
        }
        close(trabajosCh)
    }()

    // Recoger resultados (el mismo número de trabajos)
    for range trabajos {
        fmt.Println("  Factorial recibido:", <-resultadosCh)
    }
    fmt.Println("TODO el pool terminó ✔")
}`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "💡 Léelo tres veces",
          md: "**1.** mandamos trabajos. **2.** 3 workers compiten por ellos. **3.** recolectamos en el orden en que terminan. Ese ida-y-vuelta por canales es la firma de Go en producción.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    IN[jobs: 5 7 3 9 4 6 8 2] -->|canal| W1[Worker 1]
    IN -->|canal| W2[Worker 2]
    IN -->|canal| W3[Worker 3]
    W1 -->|resultados| OUT[Salida ordenada de llegada]
    W2 -->|resultados| OUT
    W3 -->|resultados| OUT`,
          caption: "Tareas en un extremo, trabajadores compitiendo en el medio, resultados al otro.",
        },
        {
          t: "quiz",
          question: "En un worker pool, ¿qué logra `close(trabajosCh)`?",
          options: [
            "Elimina todos los resultados",
            "Indica que ya no habrá más trabajos y los workers terminan su bucle",
            "Reinicia el pool",
            "Bloquea el canal permanentemente",
          ],
          correct: 1,
          explanation:
            "Cerrar un canal de trabajo le dice a los workers (que lo recorren con `range`) que no llegará nada más; terminan limpiamente.",
        },
      ],
    },
  ],
};