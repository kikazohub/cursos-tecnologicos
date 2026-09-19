import type { Course } from "@/lib/content/types";

export const course: Course = {
  id: "python",
  emoji: "🐍",
  title: "Python",
  subtitle: "Python · IA · Datos · Automatización",
  category: "lenguajes",
  tagline: "El estándar para inteligencia artificial, ciencia de datos y automatización.",
  description:
    "Python es el lenguaje más humano que existe: su sintaxis parece inglés casi puro. Es la primera opción para IA, análisis de datos, scripts de servidor y automatización. Aquí lo aprenderás ejecutando código real en cada lección.",
  objectives: [
    "Leer y escribir Python con naturalidad desde el primer minuto",
    "Dominar listas, diccionarios y bucles",
    "Usar funciones, módulos y la biblioteca estándar",
    "Crear análisis de datos reales con Python puro",
    "Construir un script de automatización completo",
  ],
  prerequisites: ["Curso de JavaScript/TypeScript recomendado, pero no obligatorio."],
  color: "#3776ab",
  gradient: ["#3776ab", "#ffd43b"],
  lessons: [
    {
      id: "python-fundamentos",
      title: "Fundamentos de Python",
      durationMin: 15,
      summary: "Sintaxis limpia, variables y tipos que se entienden solos.",
      xp: 50,
      blocks: [
        {
          t: "theory",
          md: "Python fue creado para que el código **se lea como se lee una historia**. Su nombre viene de Monty Python, el grupo de comedia, y su filosofía es: *belleza sobre fealdad, simple sobre complejo*.\n\n> **Analogía del instructivo:** JavaScript es una receta de cocina genérica; Python es un instructivo de IKEA: casi perfecto en lenguaje natural, con dibujos (sangría) que organizan todo.",
        },
        {
          t: "code",
          lang: "python",
          title: "Variables y tipos",
          md: "Fíjate: no hace falta declarar el tipo, ni punto y coma, ni llaves. La **sangría** define los bloques.",
          code: `# Comentario con numeral
nombre = "Ada"
edad = 38
activo = True          # True/False en MAYÚSCULA
precio = 99.99
nulo = None            # equivalente a null

print("Hola,", nombre)
print("Tipo de edad:", type(edad))
print("Está activa:", activo)

# Operadores y f-strings (interpolación)
total = precio * 3
print(f"3 unidades x {precio} = {total:.2f}")

# Entrada del usuario (desactívala si te atascas)
# nombre = input("¿Cómo te llamas? ")`,
          run: true,
        },
        {
          t: "code",
          lang: "python",
          title: "Condicionales y bucles",
          code: `edad = 21

if edad >= 18:
    print("Mayor de edad 💪")
elif edad >= 13:
    print("Adolescente")
else:
    print("Menor")

# Bucle for: iterar sobre una secuencia
for i in range(1, 6):
    print(f"Iteración {i}")

# Bucle while
contador = 3
while contador > 0:
    print(f"Cuenta regresiva: {contador}")
    contador -= 1
print("¡Despegue! 🚀")`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "🖊️ La sangría es ley",
          md: "En Python la sangría *define* los bloques. 4 espacios por nivel es la convención universal (`PEP 8`). Cuidado con mezclar tabs y espacios: causa los errores más odiosos.",
        },
        {
          t: "quiz",
          question: "¿Qué imprime `type(3.14)` en Python?",
          options: ["`int`", "`float`", "`decimal`", "`number`"],
          correct: 1,
          explanation: "Python tiene `float` para números con decimales; `int` para enteros y `bool` para booleanos.",
        },
      ],
    },
    {
      id: "python-estructuras",
      title: "Listas, diccionarios y tuplas",
      durationMin: 18,
      summary: "Las estructuras de datos que usan el 95% de los scripts reales.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Python tiene 4 contenedores estrella. Vivirás con ellos todos los días:\n\n- **`list`** (`[1, 2, 3]`): ordenada y modificable.\n- **`tuple`** (`(1, 2, 3)`): ordenada e inmutable — un registro fijo.\n- **`dict`** (`{\"clave\": \"valor\"}`): búsqueda por clave, como un diccionario real.\n- **`set`** (`{1, 2, 3}`): colección sin duplicados.",
        },
        {
          t: "code",
          lang: "python",
          title: "Listas en acción",
          code: `lenguajes = ["Python", "Rust", "Go"]
lenguajes.append("JS")
print("Lista:", lenguajes)
print("Primero:", lenguajes[0], "| Último:", lenguajes[-1])
print("Longitud:", len(lenguajes))

# Slicing: recortar
print("Del 1 al 3:", lenguajes[1:3])
print("Reversa:", lenguajes[::-1])

# Tupla: registro inmutable
coordenada = (12.0, -77.0)
lat, lon = coordenada          # unpacking
print(f"Lat: {lat}, Lon: {lon}")`,
          run: true,
        },
        {
          t: "code",
          lang: "python",
          title: "Diccionarios: búsqueda instantánea",
          code: `usuario = {
    "nombre": "Grace",
    "rol": "developer",
    "skills": ["Python", "ML", "SQL"],
}

print("Nombre:", usuario["nombre"])
print("Skills:", usuario["skills"])

# Obtener con valor por defecto (evita el error)
print("Edad:", usuario.get("edad", "no especificada"))

# Añadir y actualizar
usuario["años_exp"] = 12
usuario["nombre"] = "Grace Hopper"

# Iterar
for clave, valor in usuario.items():
    print(f"  {clave} -> {valor}")

# Conjuntos: sin duplicados
tecnologias = {"Python", "Python", "SQL", "SQL", "Go"}
print("Set:", tecnologias)`,
          run: true,
        },
        {
          t: "diagram",
          mermaid: `flowchart LR
    L["Lista<br/>[1, 2, 3]"] -->|"índice numérico<br/>lst[0]"| A["Acceso por posición"]
    D["Dict<br/>{clave: valor}"] -->|"búsqueda por clave<br/>d[nombre]"| B["Acceso semántico"]
    T["Tupla<br/>(inmutable)"] -->|"registro fijo<br/>x, y = t"| C["Registros que no cambian"]
    S["Set<br/>sin duplicados"] -->|"contenido único"| E["Pertenencias / uniones"]`,
          caption: "Cuatro contenedores, cuatro superpoderes. Cada uno resuelve un problema distinto.",
        },
        {
          t: "quiz",
          question: "¿Qué estructura usarías para guardar \"dni → nombre\" y consultarlo por DNI?",
          options: ["Una tupla", "Una lista", "Un diccionario", "Un set"],
          correct: 2,
          explanation:
            "El diccionario ofrece búsqueda inmediata por clave: perfecto para mapear una clave única (DNI) a un valor (nombre).",
        },
      ],
    },
    {
      id: "python-funciones",
      title: "Funciones, módulos y la biblioteca estándar",
      durationMin: 18,
      summary: "Reutiliza código y aprovecha la batería incluida de Python.",
      xp: 55,
      blocks: [
        {
          t: "theory",
          md: "Piensa en una función como un **mini-programa** con entradas y salidas. Python trae cientos de módulos listos (la *batería incluida*): `json`, `math`, `datetime`, `random`, `collections`, `pathlib`...\n\n> **Analogía de la caja de herramientas:** no construyes tú cada destornillador; lo coges del cajón (`import`). Python destaca porque su cajón es gigantesco.",
        },
        {
          t: "code",
          lang: "python",
          title: "Funciones con todo",
          code: `def calcular_precio(base, descuento=0.0, impuesto=0.18):
    """Devuelve el precio final aplicando descuento e impuesto."""
    subtotal = base * (1 - descuento)
    return subtotal * (1 + impuesto)

print("Precio (100, 10% desc):", round(calcular_precio(100, 0.1), 2))

# *args: número variable de argumentos
def sumar(*numeros):
    return sum(numeros)

print("Suma:", sumar(1, 2, 3, 4, 5))

# lambda: función anónima para un uso puntual
duplicar = lambda x: x * 2
print("Doble del 21:", duplicar(21))`,
          run: true,
        },
        {
          t: "code",
          lang: "python",
          title: "Módulos de la biblioteca estándar",
          code: `import json
import math
import random
from datetime import datetime

# math: operaciones científicas
print("Raíz de 144:", math.sqrt(144))
print("Pi:", round(math.pi, 4))

# random: aleatoriedad
print("Dado 🎲:", random.randint(1, 6))

# datetime: tiempo real
ahora = datetime.now()
print("Ahora:", ahora.strftime("%d/%m/%Y %H:%M"))

# json: el formato de intercambio por excelencia
datos = {"curso": "Python", "nivel": "inicial"}
encoded = json.dumps(datos, indent=2)
print("JSON:\\n" + encoded)
print("Decodificado:", json.loads(encoded)["curso"])`,
          run: true,
        },
        {
          t: "callout",
          kind: "info",
          title: "📦 Paquetes de la comunidad",
          md: "Además de la biblioteca estándar existe PyPI: miles de paquetes con `pip install`. Los reyes del ecosistema IA/datos: **NumPy**, **pandas**, **scikit-learn**, **PyTorch** y **matplotlib**. Los verás en cursos más avanzados.",
        },
        {
          t: "quiz",
          question: "¿Qué hace `import json`?",
          options: [
            "Crea una base de datos nueva",
            "Carga el módulo json, con herramientas para serializar datos",
            "Abandona el programa",
            "Compila el código más rápido",
          ],
          correct: 1,
          explanation:
            "`import` carga un módulo y sus funciones: json permite convertir datos Python a texto JSON y viceversa (`json.dumps` / `json.loads`).",
        },
      ],
    },
    {
      id: "python-datos",
      title: "Trabajar con datos de verdad",
      durationMin: 20,
      summary: "Comprehensions, análisis y tablas en Python puro.",
      xp: 60,
      blocks: [
        {
          t: "theory",
          md: "La estrella de Python es el **análisis de datos**. Antes de llegar a pandas (el Excel de Python), es clave dominar las *comprehensions*: crear listas/dicts en una sola línea elegante.",
        },
        {
          t: "code",
          lang: "python",
          title: "List comprehensions",
          code: `numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Lo básico vs la versión elegante
cuadrados_viejo = []
for n in numeros:
    cuadrados_viejo.append(n * n)

cuadrados = [n * n for n in numeros]
print("Cuadrados:", cuadrados)

# Con condición: solo pares
pares = [n for n in numeros if n % 2 == 0]
print("Pares:", pares)

# Dict comprehension
cubo_impares = {n: n ** 3 for n in numeros if n % 2 == 1}
print("Cubos de impares:", cubo_impares)

# Y como magnífico extra: zip + enums
for indice, n in enumerate(cuadrados[:4]):
    print(f"  cuadrados[{indice}] = {n}")`,
          run: true,
        },
        {
          t: "code",
          lang: "python",
          title: "Mini análisis de ventas",
          code: `ventas = [
    {"producto": "Laptop",   "cantidad": 3,  "precio": 1200},
    {"producto": "Mouse",    "cantidad": 50, "precio": 25},
    {"producto": "Teclado",  "cantidad": 30, "precio": 45},
    {"producto": "Monitor",  "cantidad": 8,  "precio": 300},
]

# Ingreso total por producto
for v in ventas:
    v["ingreso"] = v["cantidad"] * v["precio"]

# Total general
total = sum(v["ingreso"] for v in ventas)
print(f"INGRESO TOTAL: \${total:,.2f}")

# Producto estrella (mayor ingreso)
estrella = max(ventas, key=lambda v: v["ingreso"])
print(f"Estrella: {estrella['producto']} -> \${estrella['ingreso']:,.2f}")

# Ordenar de mejor a peor
for v in sorted(ventas, key=lambda x: x["ingreso"], reverse=True):
    print(f"  {v['producto']:<10} \${v['ingreso']:>10,.2f}")`,
          run: true,
        },
        {
          t: "callout",
          kind: "tip",
          title: "🚀 Camino siguiente: pandas",
          md: "Ese patrón (datos → calcular → agrupar → ordenar) es exactamente lo que hacen pandas y SQL por ti a grande escala. Dominar Python puro hace trivial aprenderlos.",
        },
        {
          t: "quiz",
          question: "¿Qué produce `[n * 2 for n in range(3)]`?",
          options: ["`[0, 1, 2]`", "`[2, 4, 6]`", "`[0, 2, 4]`", "`(0, 2, 4)`"],
          correct: 2,
          explanation:
            "Un *list comprehension* aplica `n * 2` a cada elemento de `range(3)` = `0, 1, 2`, resultando `[0, 2, 4]`.",
        },
      ],
    },
    {
      id: "python-proyecto",
      title: "Proyecto: automatización real",
      durationMin: 22,
      summary: "Script que procesa datos y genera un informe, con errores gestionados.",
      xp: 75,
      blocks: [
        {
          t: "theory",
          md: "La joya de Python es **automatizar lo aburrido**. Construiremos un script que: lee datos, los procesa, detecta casos anómalos y genera un informe legible. Incluye manejo de errores con `try/except` — la diferencia entre un script frágil y uno profesional.",
        },
        {
          t: "code",
          lang: "python",
          title: "Script completo con errores controlados",
          code: `datos_sensores = [
    {"zona": "Norte", "temp": 22.5, "energia": 140},
    {"zona": "Centro", "temp": 31.2, "energia": 220},
    {"zona": "Sur", "temp": 18.0, "energia": 95},
    {"zona": "Oeste", "temp": 40.1, "energia": 300},
]


def clasificar(temp: float) -> str:
    """Devuelve el estado según la temperatura."""
    if temp > 35:
        return "CRÍTICO 🔥"
    if temp > 28:
        return "Alerta ⚠️"
    return "OK ✅"


def generar_informe(lista):
    print("=" * 42)
    print("INFORME DE SENSORES")
    print("=" * 42)
    for s in lista:
        try:
            estado = clasificar(s["temp"])
            print(f"  {s['zona']:<8} {s['temp']:>5.1f}°C  {estado}")
        except KeyError as e:
            print(f"  Registro incompleto: falta la clave {e}")

    alertas = [s for s in lista if s["temp"] > 28]
    print("-" * 42)
    print(f"  Total zonas: {len(lista)}  |  Alertas: {len(alertas)}")


# Prueba el manejo de errores: descomenta la línea siguiente
# datos_sensores.append({"zona": "Glitch"})          # falta "temp"
generar_informe(datos_sensores)`,
          run: true,
        },
        {
          t: "callout",
          kind: "warning",
          title: "🧯 try/except: no dejes que un dato rompa todo",
          md: "Un script en producción debe sobrevivir a datos sucios. `try/except` captura el error, lo reporta y el script sigue con los demás registros. Pruébalo: descomenta `datos_sensores.append(...)` y ve cómo el informe resiste.",
        },
        {
          t: "diagram",
          mermaid: `flowchart TD
    A[Datos crudos] --> B[Clasificar<br/>temp > 35?]
    B --> C[Reporte legible]
    C --> D{Ojalá un humano lo lea}
    B -.->|KeyError atrapado| E[try/except]
    E --> C
    style C fill:#104,color:#8fc,stroke:#38bdf8`,
          caption: "Flujo del script: entrada → procesamiento con guardianes de errores → informe.",
        },
        {
          t: "quiz",
          question: "¿Para qué sirve `try/except`?",
          options: [
            "Para que el programa sea más rápido",
            "Para capturar errores y manejarlos sin que el script se detenga",
            "Para declarar variables globales",
            "Para compilar Python",
          ],
          correct: 1,
          explanation:
            "`try/except` envuelve código propenso a fallos y define qué hacer si falla, evitando que el script entero se detenga.",
        },
      ],
    },
  ],
};