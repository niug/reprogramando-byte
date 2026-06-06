// ============================================================
//  CODEQUEST — CURRICULUM COMPLET
//  4 mòduls × 3 reptes = 12 missions
//  Mecàniques: robot.print_robot(), dreta/esquerra/amunt/avall,
//              pedra_davant/amunt/avall/esquerra(), porta de sortida
// ============================================================
export const GLOBAL_HIDDEN_CODE = `
# ── Variables globals del sistema ──────────────────────────
sistema     = "ByteOS"
versio      = 11.4
sector      = "ALPHA-7"
color_robot = "verd"

# ── Funcions d'utilitat globals ─────────────────────────────
def derecha():
    robot.derecha()
    
def izquierda():
    robot.izquierda()

def arriba():
    robot.arriba()

def abajo():
    robot.abajo()

def missatge_sistema(text):
    """Mostra un missatge amb prefix del sistema."""
    robot.print_robot(f"[{sistema}] {text}")

def print_robot(text):
    """Mostra un missatge amb prefix del sistema."""
    robot.print_robot(f"{text}")

def es_parell(n):
    """Retorna True si n és parell."""
    return n % 2 == 0

def es_positiu(n):
    """Retorna True si n és positiu."""
    return n > 0

def maxim(a, b):
    """Retorna el major dels dos valors."""
    return a if a > b else b

def minim(a, b):
    """Retorna el menor dels dos valors."""
    return a if a < b else b
`;

export const BLOCKS = [

  // ════════════════════════════════════════════════════════
  //  MÒDUL 1 — TIPOS DE DADES I VARIABLES
  // ════════════════════════════════════════════════════════
  {
    id: "variables",
    title: "Tipos de datos y variables",
    icon: "📦",
    color: "blue",
    theory: {
      content: `
## Tipos de datos y variables

Una **variable** es com una caja donde guardamos información.

\`\`\`python
nombre = "Anna"    # String (text)
edad = 17          # Integer (número enter)
nota = 9.5         # Float (decimal)
aprovada = True    # Boolean (cert/fals)
\`\`\`

### Tipos principales:
- **str** → texto entre comillas: \`"hola"\`
- **int** → números enteros: \`42\`
- **float** → decimales: \`3.14\`
- **bool** → Booleanos: True o False

### Operaciones básicas:
\`\`\`python
salutacion = "Hola, " + nom   # concatenar text
doble = edad * 2              # multiplicar
texto_edad = str(edat)        # convertir a text
\`\`\`
      `
    },
    challenges: [

      // ── M1 · R1 ─────────────────────────────────────────
      {
        id: "var_1",
        title: "Información básica del Robot",
        description: `El robot ha olvidado información básica sobre sí mismo. Debes guardar sus datos en variables.

Crea las siguientes variables:
- \`nombre\` nombre del robot (texto).
- \`energia\` cantidad de energía que le queda (entero).
- \`velocidad\` velocidad máxima en km/h (decimal).
- \`activo\` indica si está encendido o apagado (booleano).`,
        starterCode: `# Define las siguientes variables:
# nombre (texto)
# energia (entero)
# velocidad (decimal)
# activo (booleano)

`,
        endCode: `
if (
    isinstance(nombre, str) and
    isinstance(energia, int) and
    isinstance(velocidad, float) and
    isinstance(activo, bool)
):
    print_robot(f"-CORRECTO! Robot: {nombre}, energia {energia}, velocidad: {velocidad}, activo: {activo}")
else:
    print_robot("-ERROR! Alguna de las variables no es de tipo correcto.")`,

        grid: {
          cols: 6, rows: 4,
          robotStart: [1, 0],
          rocks: [],
          door: null
        },
        // Superado si el robot habla e incluye el texto correcto
        solution: (output, actions) =>
          actions.some(a => a.type === "say" &&
            a.text.toLowerCase().includes("-correcto!")),
        hint: 'nom = "Anna" — recuerda las comillas para los textos!'
      },

      // ── M1 · R2 ─────────────────────────────────────────
      {
        id: "var_2",
        title: "Reconstruir la identificación y la energía",
        description: `El robot ha recuperado parte de su memoria. Ahora debe calcular su energía total y generar su identificación con su código y nombre. En su memoria, el robot, ha recuperado tres variables: codigo, energia_bateria_1 y energia_bateria_2.

Crea las siguientes variables:
- energia (entero): Con la suma de la energía de sus dos baterías
- identificacion (texto): Concatenando el valor de su código con su nombre

`,
        starterCode: `# Crea las variables:
# - energia: suma de las variables energia_bateria_1 y energia_bateria_2
# - identificacion: concatenando la variable codigo con el nombre
`,
        hiddenCode: `
energia_bateria_1 = 45
energia_bateria_2 = 30
codigo = "C43P0"
`,
        endCode: `
if (
    isinstance(identificacion, str) and
    isinstance(energia, int) and
    energia == 75 and
    codigo in identificacion
):
    print_robot(f"-CORRECTO! Identificación: {identificacion}, energia {energia}")
else:
    print_robot("-ERROR! Alguna de las variables no es de tipo correcto.")`,
        grid: {
          cols: 6, rows: 3,
          robotStart: [1, 0],
          rocks: [],
          door: []
        },
        solution: (output, actions) =>
          actions.some(a => a.type === "say" &&
            a.text.toLowerCase().includes("-correcto!")),
        hint: 'codigo = "BYTE" + "OS" → "BYTEOS".'
      },

      // ── M1 · R3 ─────────────────────────────────────────
      {
        id: "var_3",
        title: "Targeta de memoria",
        description: `El robot ha recuperado suficiente memoria para solicitar una nueva identificación. Para ello debe generar una tarjeta con sus datos principales.`,
        starterCode: `# Crea las variable nombre (str), nivel (int) y energia (float) 

# Concatena todos los valores en la variable targeta

`,
        endCode: `
if (
    isinstance(nombre, str) and
    isinstance(nivel, int) and
    isinstance(energia, float) and
    isinstance(targeta, str)
):
    print_robot(f"-CORRECTO! Targeta: {targeta}")
else:
    print_robot("-ERROR! Alguna de las variables no es de tipo correcto.")`,
        grid: {
          cols: 6, rows: 3,
          robotStart: [1, 0],
          rocks: [],
          door: []
        },
        solution: (output, actions) =>
          actions.some(a => a.type === "say" &&
            a.text.toLowerCase().includes("-correcto!")),
        hint: 'codigo = "BYTE" + "OS" → "BYTEOS".'
      },
    ]
  },

  // ════════════════════════════════════════════════════════
  //  MÒDUL 2 — SENTÈNCIES CONDICIONALS
  // ════════════════════════════════════════════════════════
  {
    id: "condicionals",
    title: "Sentencias condicionales",
    icon: "🔀",
    color: "green",
    theory: {
      content: `
## Sentencias condicionales

Permiten que el programa tome **decisiones** según una condición.

\`\`\`python
if condicion:
    # se ejecuta si es cierto
elif otra_condicion:
    # se ejecuta si la otra es cierta
else:
    # se ejecuta si ninguna condición es cierta
\`\`\`

### Operadores de comparación:
- \`==\` igual · \`!=\` diferente
- \`>\` mayor · \`<\` menor
- \`>=\` mayor o igual · \`<=\` menor o igual

### Operadores lógicos:
- \`and\` → las dos deben ser ciertas
- \`or\`  → hay suficiente con una condición cierta
- \`not\` → nega la condición

### Con el robot:
\`\`\`python
if piedra_delante():
    abajo()    # esquiva por abajo
else:
    derecha()  # sigue recto
\`\`\`
      `
    },
    challenges: [

      // ── M2 · R1 ─────────────────────────────────────────
      {
        id: "cond_1",
        title: "Comprobación estado Robot",
        description: `Debemos comprobar si el robot está activo para poder avanzar.
`,
        hiddenCode: `
# Variables del sistema disponibles per a l'alumne
activo = True
`,
        starterCode: `
# Comprueba si el robot tiene la variable "activo" a True
#   Si está activo, avanza con la función a derecha() tantas 
#   veces como sea necesario para llegar a la puerta

# Asegurate de comprovar si el robot está activo o no!


derecha()
`,
        endCode:`

`,
        grid: {
          cols: 5, rows: 3,
          robotStart: [1, 0],
          rocks: [],
          door: [1, 4]
        },
        solution: (output, actions, code) =>
          actions.some(a => a.type === "door") && 
          code.toLowerCase().includes("if activo"),
        hint: 'if acces: → si acces es True, entrar al bloque. Recuerda la indentación!'
      },

      // ── M2 · R2 ─────────────────────────────────────────
      {
        id: "cond_2",
        title: "Transportar carga",
        description: `Comprueba las variables de capacidad y peso_carga para validar que el robot puede transportar la carga. Sino puede muestra un mensaje con la función print_robot, si puede avanza hasta la puerta.
`,
        hiddenCode: `
capacidad = 120
print_robot("Capacidad: " + str(capacidad))
        `,
        starterCode: `# Comprueba si la capacidad del robot puede soportar la carga
carga = 90

# Si el robot soporta la carga, avanza hasta la puerta

# Si no soporta la carga, muestra el mensaje: Carga demasiado pesada!
print_robot("Carga demasiado pesada!")
`,
        grid: {
          cols: 7, rows: 4,
          robotStart: [1, 0],
          rocks: [[1, 1], [1, 2]],
          door: [1, 6]
        },
        solution: (output, actions) =>
          actions.some(a => a.type === "door"),
        hint: 'robot.pedra_davant() retorna True si hi ha pedra a la dreta del robot'
      },

      // ── M2 · R3 ─────────────────────────────────────────
      {
        id: "cond_3",
        title: "Velocidad según energia",
        description: `Haz avanzar el robot según su nivel de energia, hasta la puerta de salida.
`,
        hiddenCode: `
def derecha():
    if energia > 70:
        robot.derecha()
        robot.derecha()
        robot.derecha()
    elif 50 <= energia <= 70:
        robot.derecha()
        robot.derecha()
    else :
        robot.derecha()
def izquierda():
    if energia > 70:
        robot.izquierda()
        robot.izquierda()
        robot.izquierda()
    elif 50 <= energia <= 70:
        robot.izquierda()
        robot.izquierda()
    else :
        robot.izquierda()
def arriba():
    if energia > 70:
        robot.arriba()
        robot.arriba()
        robot.arriba()
    elif 50 <= energia <= 70:
        robot.arriba()
        robot.arriba()
    else :
        robot.arriba()
def abajo():
    if energia > 70:
        robot.abajo()
        robot.abajo()
        robot.abajo()
    elif 50 <= energia <= 70:
        robot.abajo()
        robot.abajo()
    else :
        robot.abajo()
import random
energia = random.randint(1, 3) * 30
if energia > 70:
    print_robot("Mi nivel de energia es de: " + str(energia) + ". Avanzo de tres en tres.")
elif 50 <= energia <= 70 :
    print_robot("Mi nivel de energia es de: " + str(energia) + ". Avanzo de dos en dos.")
else : 
    print_robot("Mi nivel de energia es de: " + str(energia) + ". Avanzo solo una casilla.")
`,
        starterCode: `# Cuidado, el nivel de avance dependerá de la energia del robot
#   Utiliza la sentencia if/elif/else para invocar la función de 
#   avanzar dependiendo de la energia del robot.

`,
        grid: {
          cols: 7, rows: 7,
          robotStart: [3, 0],
          rocks: [[2, 1], [0, 2], [3, 2], [4, 2], [2, 4], [2, 5]],
          door: [0, 6]
        },
        solution: (output, actions) =>
          actions.some(a => a.type === "door") &&
          actions.some(a => a.type === "say"),
        hint: 'Simula pas a pas: on és el robot? Quines pedres té al voltant?'
      }
    ]
  },

  // ════════════════════════════════════════════════════════
  //  MÒDUL 3 — SENTÈNCIES ITERATIVES
  // ════════════════════════════════════════════════════════
  {
    id: "iteratives",
    title: "Sentencias iterativas",
    icon: "🔄",
    color: "purple",
    theory: {
      content: `
## Sentencias iterativas (bucles)

Permiten **repetir** instrucciones sin necesidad de escribirlas múltiples veces.

### Bucle \`for\`:
\`\`\`python
for i in range(5):       # repite 5 veces (i = 0,1,2,3,4)
    derecha()

for i in range(3):
    print_robot(f"Paso {i+1}")
\`\`\`

### Bucle \`while\`:
\`\`\`python
while not robot.piedra_delante():
    robot.dreta()        # avanza mientre no tenga una piedra delante

contador = 0
while contador < 5:
    robot.derecha()
    contador += 1
\`\`\`

### Control de flujo:
- \`break\`    → sale del bucle inmediatamente
- \`continue\` → salta a la siguiente iteración
      `
    },
    challenges: [

      // ── M3 · R1 ─────────────────────────────────────────
      {
        id: "iter_1",
        title: "Optimización del avance",
        description: `El robot debe llegar a la puerta en como mucho 2 líneas de código.`,
        starterCode: `# Utiliza la sentencia condicional necesaria`,
        grid: {
          cols: 8, rows: 3,
          robotStart: [1, 0],
          rocks: [],
          door: [1, 7]
        },
        solution: (output, actions) =>
          actions.filter(a => a.type === "move").length >= 6 &&
          actions.some(a => a.type === "door"),
        hint: 'for i in range(9) : derecha() → avanza 9 veces a la derecha'
      },

      // ── M3 · R2 ─────────────────────────────────────────
      {
        id: "iter_2",
        title: "El serpentí",
        description: `El robot ha de recórrer el mapa en forma de serpentí (com una S) per arribar a la porta.

Usa \`for\` i \`range()\` per repetir els moviments:
- 3 passos a la dreta
- 1 pas avall
- 3 passos a l'esquerra  
- 1 pas avall
- Continua fins a la porta

El robot ha de dir quantes files ha recorregut.`,
        starterCode: `files = 0

# Fila 0: vés a la dreta
for i in range(3):
    robot.dreta()

robot.avall()
files += 1

# Fila 1: vés a l'esquerra
for i in range(3):
    robot.esquerra()

robot.avall()
files += 1

# Fila 2: vés a la dreta fins a la porta
for i in range(3):
    robot.dreta()

robot.print_robot(f"He recorregut {files} files!")`,
        grid: {
          cols: 5, rows: 5,
          robotStart: [0, 0],
          rocks: [[1, 4], [3, 0]],
          door: [2, 4]
        },
        solution: (output, actions) =>
          actions.some(a => a.type === "door") &&
          actions.some(a => a.type === "say"),
        hint: 'Pensa en el recorregut: → ↓ ← ↓ → fins arribar a la porta'
      },

      // ── M3 · R3 ─────────────────────────────────────────
      {
        id: "iter_3",
        title: "El laberint automàtic",
        description: `El robot ha de navegar un laberint complex de forma automàtica.

Usa un bucle \`for i in range(20)\` i dins comprova cada direcció:

\`\`\`python
for i in range(20):
    if not robot.pedra_davant():
        robot.dreta()
    elif not robot.pedra_avall():
        robot.avall()
    elif not robot.pedra_amunt():
        robot.amunt()
\`\`\`

Quan arribi a la porta, el robot ha de dir: \`"Laberint superat en {i+1} iteracions!"\`

⚠️ Pista: potser cal ajustar l'ordre de preferència de direccions!`,
        starterCode: `for i in range(20):
    if not robot.pedra_davant():
        robot.dreta()
    elif not robot.pedra_avall():
        robot.avall()
    elif not robot.pedra_amunt():
        robot.amunt()
    else:
        robot.esquerra()

robot.print_robot("Laberint superat!")`,
        grid: {
          cols: 8, rows: 6,
          robotStart: [0, 0],
          rocks: [
            [0, 2], [1, 0], [1, 1], [1, 3], [1, 4],
            [2, 4], [3, 2], [3, 3], [3, 5], [4, 1],
            [4, 5], [5, 3], [5, 4], [2, 6], [4, 6]
          ],
          door: [0, 7]
        },
        solution: (output, actions) =>
          actions.some(a => a.type === "door") &&
          actions.some(a => a.type === "say"),
        hint: "L'ordre de les condicions importa. Prova: dreta → amunt → avall"
      }
    ]
  },

  // ════════════════════════════════════════════════════════
  //  MÒDUL 4 — FUNCIONS
  // ════════════════════════════════════════════════════════
  {
    id: "funcions",
    title: "Funciones",
    icon: "⚙️",
    color: "orange",
    theory: {
      content: `
## Funcions

Les funcions permeten **reutilitzar codi** donant-li un nom.

\`\`\`python
def saluda(nom):           # definició amb paràmetre
    robot.print_robot(f"Hola, {nom}!")

saluda("Anna")             # crida → "Hola, Anna!"
saluda("Bernat")           # reutilització
\`\`\`

### Funcions amb retorn:
\`\`\`python
def distancia_porta(passos):
    return passos * 2

total = distancia_porta(3)   # total = 6
\`\`\`

### Funcions de moviment:
\`\`\`python
def anar_dreta(n):
    for i in range(n):
        robot.dreta()

def esquivar():
    if robot.pedra_davant():
        robot.avall()
        robot.dreta()
        robot.amunt()
    else:
        robot.dreta()
\`\`\`
      `
    },
    challenges: [

      // ── M4 · R1 ─────────────────────────────────────────
      {
        id: "func_1",
        title: "El protocol de comunicació",
        description: `El robot necessita un protocol estàndard per comunicar-se.

Crea una funció \`comunicar(missatge, prioritat)\` que:
- Si \`prioritat == "alta"\`: digui \`"[URGENT] {missatge}"\`
- Si no: digui \`"[INFO] {missatge}"\`

Crida-la almenys 3 vegades amb missatges diferents.
Un d'ells ha de ser d'alta prioritat amb la paraula "porta".`,
        starterCode: `def comunicar(missatge, prioritat):
    if prioritat == "alta":
        robot.print_robot(f"[URGENT] {missatge}")
    else:
        robot.print_robot(f"[INFO] {missatge}")

# Crida la funció 3 vegades
comunicar("Sistema inicialitzat", "baixa")
comunicar("Porta detectada", "alta")
comunicar("Explorant sector", "baixa")`,
        grid: {
          cols: 5, rows: 4,
          robotStart: [1, 0],
          rocks: [],
          door: null
        },
        solution: (output, actions) => {
          const says = actions.filter(a => a.type === "say");
          return says.length >= 3 &&
            says.some(a => a.text.includes("[URGENT]") &&
              a.text.toLowerCase().includes("porta"));
        },
        hint: 'if prioritat == "alta": — recorda les cometes al comparar textos'
      },

      // ── M4 · R2 ─────────────────────────────────────────
      {
        id: "func_2",
        title: "El pilot automàtic",
        description: `Crea un sistema de pilot automàtic amb funcions reutilitzables.

Defineix:
- \`anar_dreta(n)\` → mou el robot \`n\` vegades a la dreta
- \`anar_avall(n)\` → mou el robot \`n\` vegades avall

Usa-les per navegar el mapa en forma de L i arribar a la porta.
El robot ha d'anunciar cada maniobra amb \`robot.print_robot()\`.`,
        starterCode: `def anar_dreta(n):
    robot.print_robot(f"Maniobra: {n} passos a la dreta")
    for i in range(n):
        robot.dreta()

def anar_avall(n):
    robot.print_robot(f"Maniobra: {n} passos avall")
    for i in range(n):
        robot.avall()

# Navega fins a la porta en forma de L
anar_dreta(3)
anar_avall(2)
anar_dreta(3)`,
        grid: {
          cols: 8, rows: 5,
          robotStart: [0, 0],
          rocks: [[0, 4], [0, 5], [0, 6], [1, 4], [2, 0], [2, 1], [2, 2]],
          door: [2, 6]
        },
        solution: (output, actions) =>
          actions.some(a => a.type === "door") &&
          actions.filter(a => a.type === "say").length >= 2,
        hint: "Segueix el camí en L: dreta, avall, dreta. Quants passos a cada tram?"
      },

      // ── M4 · R3 ─────────────────────────────────────────
      {
        id: "func_3",
        title: "El robot explorador autònom",
        description: `Crea un robot completament autònom que explori i surti del laberint.

Implementa:
- \`esquivar()\` → comprova \`pedra_davant()\` i decideix cap on anar
- \`explorar(max_passos)\` → crida \`esquivar()\` en bucle fins arribar o esgotar passos
- El robot ha de dir quants passos ha necessitat per sortir

Aquest és el repte final. Necessites tot el que has après!`,
        starterCode: `def esquivar():
    if not robot.pedra_davant():
        robot.dreta()
    elif not robot.pedra_amunt():
        robot.amunt()
        robot.dreta()
        robot.avall()
    elif not robot.pedra_avall():
        robot.avall()
        robot.dreta()
        robot.amunt()
    else:
        robot.esquerra()

def explorar(max_passos):
    for i in range(max_passos):
        esquivar()
    robot.print_robot(f"Exploració completada en {max_passos} passos!")

explorar(15)`,
        grid: {
          cols: 9, rows: 6,
          robotStart: [2, 0],
          rocks: [
            [0, 1], [1, 1], [3, 1], [4, 1],
            [2, 3], [0, 3], [1, 3], [4, 3], [5, 3],
            [2, 5], [3, 5], [1, 6], [4, 6],
            [0, 7], [5, 7]
          ],
          door: [2, 8]
        },
        solution: (output, actions) =>
          actions.some(a => a.type === "door") &&
          actions.some(a => a.type === "say"),
        hint: "La funció esquivar() ha de gestionar tots els casos. Prova ordre: dreta → amunt → avall → esquerra"
      }
    ]
  }
];
