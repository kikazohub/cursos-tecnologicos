import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "rust",
  emoji: "🦀",
  title: "Rust",
  subtitle: "Rust · Systems · Seguridad",
  category: "lenguajes",
  tagline: "Máxima velocidad y seguridad en memoria, sin sacrificar control.",
  description:
    "Rust es el lenguaje más querido del mundo según la encuesta de Stack Overflow, y no es casualidad: te da la velocidad de C con garantías de memoria que hacen imposibles millonadas de bugs. Nació en Mozilla y hoy corre en el kernel de Linux, bases de datos y herramientas esenciales.",
  objectives: [
    "Compilar y ejecutar Rust real aquí mismo",
    "Entender la propiedad (ownership), su concepto más famoso",
    "Modelar datos con structs, enums y match",
    "Manejar errores con Option y Result sin crashes",
    "Programar un CLI completo y seguro por memoria",
  ],
  prerequisites: ["Curiosidad sobre por qué Rust rompe récords de amor dev."],
  color: "#ce422b",
  gradient: ["#ce422b", "#f4a340"],
  lessons: [
    {
      id: "rust-fundamentos",
      title: "Fundamentos de Rust",
      durationMin: 15,
      summary: "Variables inmutables por defecto y tipos fuertes.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Dos ideas definen Rust desde el primer minuto:\n\n1. **Todo es inmutable por defecto** (`let`). Para cambiar un valor pides `let mut`. Contrario y seguro.\n2. **El compilador es tu entrenador personal**: rechaza programas que arriesgan la memoria al *compilar*, no al agarrarte un fallo en producción.\n\n> **Analogía del semáforo:** otros lenguajes dejan cruzar y te avisan cuando hay choque (crash). Rust solo te deja cruzar si el semáforo está en verde (el compilador lo verifica de antemano).",
        },
        {
          t: "code",
          lang: "rust",
          title: "Immutabilidad y tipos",
          code: `fn main() {
    // Inmutable por defecto
    let nombre = "Ada";
    // let nombre = "Grace"; // <- error: no puedes reasignar una let

    println!("Hola, {}!", nombre);

    // Numéricos
    let edad: u32 = 38;       // unsigned 32 bits
    let pi: f64 = 3.14159;    // float 64 bits
    let activo: bool = true;

    println!("{edad}, pi={:.3}, activo={activo}", pi);

    // mut para cambiar
    let mut puntos = 10;
    puntos += 5;
    println!("Puntos: {puntos}");

    // arrays y tuplas
    let cursos = ["Rust", "Go", "Python"];
    let (lat, lon) = (12.0, -77.0);
    println!("Primer curso: {}", cursos[0]);
    println!("Lat {lat}, Lon {lon}");
}`,
          run: true,
        },
        {
          t: "code",
          lang: "rust",
          title: "El compilador te atrapa",
          md: "Descomenta la línea que reasigna `nombre` y mira: el compilador avisa **antes** de ejecutar, sin siquiera correr el programa.",
          code: `fn main() {
    let total = 100;
    println!("Total: {total}");

    // Descomenta las dos líneas siguientes y compila de nuevo:
    // total = total + 1;
    // println!("Nuevo total: {total}");

    // Rust exige un valor "usado": no hay lecturas muertas sin aviso.
}`,
          run: true,
        },
        {
          t: "callout",
          kind: "info",
          title: "🧠 Seguridad sin garbage collector",
          md: "Otros lenguajes gestionan la memoria con un recolector de basura (GC) invisible. Rust la gestiona con reglas *en el compilador*: cero pausas, cero fugas, cero accesos inválidos.",
        },
        {
          t: "quiz",
          question: "¿Cuál es el comportamiento por defecto de las variables en Rust?",
          options: ["Mutables", "Inmutables", "Globales", "Dinámicas"],
          correct: 1,
          explanation:
            "Las variables son inmutables por defecto (`let`). Solo con `let mut` puedes cambiarlas. Esta decisión de diseño elimina bugs enteros de estados inesperados.",
        },
      ],
    },
    {
      id: "rust-ownership",
      title: "Ownership: la propiedad de los datos",
      durationMin: 20,
      summary: "El concepto que hace único a Rust, explicado con cajas.",
      xp: 65,
      blocks: [
        {
          t: "theory",
          md: "**Ownership (propiedad)** responde a: ¿quién es dueño de este dato y cuándo se libera su memoria?\n\n- Cada valor tiene **un único dueño**.\n- Cuando el dueño sale de su ámbito, el dato se libera (sin esperar a nadie).\n- **Prestar** (`&`) permite que otras funciones *lean* sin llevarse el dato.\n\n> **Analogía de la caja preciosa:** tienes una caja con un tesoro. O la posees tú, o la prestas *para verla* (`&`), o la regalas por completo (mover). Dos dueños a la vez = imposible. Eso elimina de raíz los *use-after-free*.",
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    A["let s = String::from('hola')"] -->|"dueño: s"| D["s : String"]
    B["fn usar(s: &String)"] -->|"préstamo &"| D
    D -.->|"presta lectura"| B
    E["fn consumir(s: String)"] -->|"mueve el valor"| D
    style D fill:#102,color:#f8c8b0,stroke:#ce422b`,
          caption: "Un dato, un dueño. Préstamos para leer (`&`), movimientos para transferir.",
        },
        {
          t: "code",
          lang: "rust",
          title: "Dueños, préstamos y la máquina compiladora",
          code: `fn main() {
    let frase = String::from("Hola Rust");

    // Préstamo inmutable: lee sin robar la propiedad
    let largo = medir(&frase);
    println!("Largo: {largo}");

    // Se puede volver a usar frase: seguimos siendo dueños
    println!("Frase original intacta: {frase}");
}

fn medir(s: &String) -> usize {
    s.len() // leemos y devolvemos el tamaño
}
// frase se libera aquí, al terminar main

// DESCOMENTA esto para ver a Rust protegerte:
// fn main() {
//     let mut x = String::from("a");
//     let r = &mut x;   // préstamo mutable
//     println!("{}", x); // ERROR: ya está prestado
// }`,
          run: true,
        },
        {
          t: "callout",
          kind: "warning",
          title: "🚧 La batalla que ganas una vez",
          md: "Los primeros días Rust te va a pelear. Es *a propósito*: cada error del compilador es un bug que nunca llegará a producción. La comunidad tiene un dicho: *\"Rust escupe errores que en otros lenguajes son ataques remotos\"*.",
        },
        {
          t: "quiz",
          question: "¿Qué significa `&` en `fn medir(s: &String)`?",
          options: [
            "Puntero salvaje peligroso",
            "Un préstamo: leo el dato sin ser su dueño",
            "Copia del valor en memoria",
            "Un error de sintaxis",
          ],
          correct: 1,
          explanation:
            "`&` crea una referencia (préstamo). La función lee el dato sin reclamar la propiedad, así el dueño original sigue pudiendo usarlo después.",
        },
      ],
    },
    {
      id: "rust-tipos",
      title: "Structs, enums y match",
      durationMin: 18,
      summary: "Modela el mundo real con tipos expresivos y exhaustivos.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Rust modela los datos con **structs** (campos con nombre), **enums** (un valor entre varias variantes) y **match** (desglose exhaustivo). La virguería: el compilador obliga a manejar *todos* los casos. No hay `else` olvidado que reviente a las 3am.",
        },
        {
          t: "code",
          lang: "rust",
          title: "Structs y enums",
          code: `#[derive(Debug)]
struct Usuario {
    nombre: String,
    rol: Rol,
    puntos: u32,
}

#[derive(Debug)]
enum Rol {
    Admin,
    Editor,
    Lector,
}

fn main() {
    let grace = Usuario {
        nombre: "Grace".to_string(),
        rol: Rol::Admin,
        puntos: 120,
    };
    println!("Usuario: {grace:#?}");
}`,
          run: true,
        },
        {
          t: "code",
          lang: "rust",
          title: "match: manejar TODOS los casos",
          code: `enum Estado {
    EnCola,
    Procesando,
    Listo(String), // con datos
    Fallido,
}

fn mostrar(e: &Estado) {
    match e {
        Estado::EnCola => println!("  ⏳ En cola"),
        Estado::Procesando => println!("  ⚙️  Procesando..."),
        Estado::Listo(url) => println!("  ✅ Listo: {url}"),
        Estado::Fallido => println!("  ❌ Fallido"),
        // si quitas un brazo, el compilador se queja:
        // "non-exhaustive patterns"
    }
}

fn main() {
    let estados = [
        Estado::EnCola,
        Estado::Procesando,
        Estado::Listo("https://api.test/reporte.pdf".to_string()),
        Estado::Fallido,
    ];
    for e in &estados {
        mostrar(e);
    }
}`,
          run: true,
        },
        {
          t: "quiz",
          question: "¿Qué garantiza `match` en Rust?",
          options: [
            "Ejecuta más rápido cualquier código",
            "Debes contemplar todas las variantes posibles o el compilador falla",
            "Elimina la necesidad de funciones",
            "Solo funciona con números",
          ],
          correct: 1,
          explanation:
            "`match` es exhaustivo: el compilador verifica que cubras todas las variantes del enum, evitando el clásico *default olvidado*.",
        },
      ],
    },
    {
      id: "rust-errores",
      title: "Option y Result: errores sin crash",
      durationMin: 18,
      summary: "Valores opcionales y errores tratados como ciudadanos de primera clase.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Nada de `null` convertido en un bombazo. Rust usa dos tipos del sistema:\n\n- **`Option<T>`**: `Some(v)` o `None` → *puede o no haber valor*.\n- **`Result<T, E>`**: `Ok(v)` o `Err(e)` → *puede triunfar o fallar*.\n\nRecordarás el patrón de Go (`valor, error`)... Rust lo eleva a nivel de tipo, imposible de ignorar.",
        },
        {
          t: "code",
          lang: "rust",
          title: "Option y Result en acción",
          code: `fn encontrar(cursos: &[&str], objetivo: &str) -> Option<usize> {
    // Devuelve Some(índice) o None
    let mut pos = 0;
    for c in cursos {
        if *c == objetivo {
            return Some(pos);
        }
        pos += 1;
    }
    None
}

fn dividir(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        return Err("división por cero".to_string());
    }
    Ok(a / b)
}

fn main() {
    let cursos = ["Rust", "Go", "Python"];

    match encontrar(&cursos, "Go") {
        Some(i) => println!("'Go' está en la posición {i}"),
        None => println!("No está"),
    }

    match dividir(10.0, 2.0) {
        Ok(r) => println!("10/2 = {r}"),
        Err(e) => println!("Error: {e}"),
    }
    match dividir(5.0, 0.0) {
        Ok(r) => println!("5/0 = {r}"),
        Err(e) => println!("Error: {e}"),
    }
}`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "🍀 Casos felices sin anidar",
          md: "Con `？` encadenas operaciones que pueden fallar sin anidar `match`: `let r = dividir(1.0, 2.0)?;`. El error sale *solo* hacia arriba. (En `main` se usa `.unwrap()`/`expect` con cuidado.)",
        },
        {
          t: "quiz",
          question: "¿Cuál es la diferencia entre `Option` y `Result`?",
          options: [
            "Son el mismo tipo en Rust",
            "`Option` expresa ausencia o presencia; `Result` expresa éxito o fallo (con detalles)",
            "`Result` es para números y `Option` para texto",
            "Ninguno existe en Rust",
          ],
          correct: 1,
          explanation:
            "`Option<T>` dice 'hay o no hay' (`Some/None`). `Result<T, E>` da el resultado **o** una descripción del error (`Ok/Err`).",
        },
      ],
    },
    {
      id: "rust-proyecto",
      title: "Proyecto: mini calculadora CLI",
      durationMin: 22,
      summary: "Una calculadora segura por tipos: sin panics, sin sorpresas.",
      xp: 75,
      blocks: [
        {
          t: "theory",
          md: "Vamos a integrar todo: enums, match, Result y funciones. La calculadora devuelve resultados como `Result` — imposible dividir por cero sin recibir un `Err`. Ese es Rust: el editor de estado imposibles.",
        },
        {
          t: "code",
          lang: "rust",
          title: "Calculadora con tipos",
          code: `enum Operacion {
    Suma,
    Resta,
    Multiplicacion,
    Division,
}

fn interpretar(c: char) -> Option<Operacion> {
    match c {
        '+' => Some(Operacion::Suma),
        '-' => Some(Operacion::Resta),
        '*' => Some(Operacion::Multiplicacion),
        '/' => Some(Operacion::Division),
        _ => None,
    }
}

fn calcular(a: f64, op: Operacion, b: f64) -> Result<f64, String> {
    match op {
        Operacion::Suma => Ok(a + b),
        Operacion::Resta => Ok(a - b),
        Operacion::Multiplicacion => Ok(a * b),
        Operacion::Division => {
            if b == 0.0 {
                Err("división por cero".to_string())
            } else {
                Ok(a / b)
            }
        }
    }
}

fn main() {
    let expr = [(10.0, '+', 4.0), (8.0, '/', 0.0), (7.0, '*', 3.0)];

    for (a, simbolo, b) in expr {
        // Option: el símbolo puede ser inválido
        let Some(op) = interpretar(simbolo) else {
            println!("'{simbolo}' no es un operador válido");
            continue;
        };

        // Result: la división puede fallar
        match calcular(a, op, b) {
            Ok(r) => println!("{a} {simbolo} {b} = {r}"),
            Err(e) => println!("Error en {a} {simbolo} {b}: {e}"),
        }
    }
    println!("Cero crashes. Certeza por tipos. 🦀");
}`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "💡 Edítala y vé a Rust reaccionar",
          md: "Añade una potencia `potencia(a, b)` al enum y a `match`. El compilador te marcará los brazos que faltan — y tú sonreirás al ver que desarrollas el *muscle memory* de cubrirlo todo.",
        },
        {
          t: "diagram",
          mermaid: `flowchart TD
    A["Expresión (a, op, b)"] --> B["interpretar<br/>char -> Option<Operacion>"]
    B -->|"None"| E["Mensaje: operador inválido"]
    B -->|"Some(op)"| C["calcular<br/>-> Result<f64, String>"]
    C -->|"Ok(r)"| D["Imprime el resultado"]
    C -->|"Err"| F["Imprime el error"]
    D --> G["Sin panics al ejecutar"]
    F --> G`,
          caption: "Cada fallo posible queda capturado por el sistema de tipos antes de correr.",
        },
        {
          t: "quiz",
          question: "¿Por qué esta calculadora 'imposible' de romper?",
          options: [
            "Porque usa punteros",
            "Porque el sistema de tipos obliga a manejar la ausencia y los fallos",
            "Porque el código es corto",
            "Porque se ejecuta en el navegador",
          ],
          correct: 1,
          explanation:
            "`Option` y `Result` fuerzan tratar los casos inválidos en tiempo de compilación: lo que no puede compilar, no puede fallar en runtime.",
        },
      ],
    },
  ],
};