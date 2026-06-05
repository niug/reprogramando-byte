export const BLOCKS = [
  {
    id: "variables",
    title: "Tipus de dades i variables",
    icon: "📦",
    color: "blue",
    theory: {
      content: `
## Tipus de dades i variables

Una **variable** és com una caixa on guardem informació.

\`\`\`python
nom = "Anna"       # String (text)
edat = 17          # Integer (número enter)
nota = 9.5         # Float (decimal)
aprovat = True     # Boolean (cert/fals)
\`\`\`

### Tipus principals:
- **str** → text entre cometes: \`"hola"\`
- **int** → números enters: \`42\`
- **float** → decimals: \`3.14\`
- **bool** → True o False

### Operacions bàsiques:
\`\`\`python
# Concatenar text
salutació = "Hola, " + nom

# Operacions matemàtiques
resultat = edat * 2

# Convertir tipus
text_edat = str(edat)
\`\`\`
      `
    },
    challenges: [
      {
        id: "var_1",
        title: "Presentació del robot",
        description: `El robot no sap qui és! Crea dues variables:
- \`nom\` amb el teu nom
- \`edat\` amb la teva edat

Després fes que el robot es presenti:
\`robot.print_robot(f"Hola! Em dic {nom} i tinc {edat} anys")\``,
        starterCode: `nom = \nnitat = \n\nrobot.print_robot(f"Hola! Em dic {nom} i tinc {edat} anys")`,
        grid: { cols: 6, rows: 5, robotStart: [0, 0], rocks: [] },
        solution: (output, actions) => actions.some(a => a.type === "say" && a.text.includes("Hola")),
        hint: "Recorda posar el text entre cometes: nom = \"Anna\""
      },
      {
        id: "var_2",
        title: "La calculadora del robot",
        description: `Calcula l'àrea d'un rectangle i mostra-la amb \`robot.print_robot()\`.`,
        starterCode: `amplada = \naltura = \narea = \n\nrobot.print_robot(f"L'àrea és {area}")`,
        grid: { cols: 6, rows: 5, robotStart: [0, 0], rocks: [[1,2],[2,4]] },
        solution: (output, actions) => actions.some(a => a.type === "say" && a.text.includes("àrea")),
        hint: "area = amplada * altura"
      },
      {
        id: "var_3",
        title: "Conversió de tipus",
        description: `Calcula el doble de la teva edat i mostra-ho amb \`robot.print_robot()\`.`,
        starterCode: `edat = \ndoble = \n\nrobot.print_robot(f"El doble és {doble}")`,
        grid: { cols: 6, rows: 5, robotStart: [2, 0], rocks: [[0,3],[1,1],[3,4]] },
        solution: (output, actions) => actions.some(a => a.type === "say"),
        hint: "doble = edat * 2"
      }
    ]
  },
  {
    id: "condicionals",
    title: "Sentències condicionals",
    icon: "🔀",
    color: "green",
    theory: {
      content: `
## Sentències condicionals

Permeten que el programa prengui **decisions**.

\`\`\`python
if condicio:
    # s'executa si és cert
elif altra_condicio:
    # s'executa si l'altra és cert
else:
    # s'executa si cap és cert
\`\`\`

### Operadors de comparació:
- \`==\` igual
- \`!=\` diferent
- \`>\` major que
- \`<\` menor que
- \`>=\` major o igual
- \`<=\` menor o igual

### Operadors lògics:
- \`and\` → les dues condicions han de ser certes
- \`or\` → n'hi ha prou amb una
- \`not\` → nega la condició
      `
    },
    challenges: [
        {
        id: "cond_1",
        title: "El robot semàfor",
        description: `Crea una variable \`color\` ("verd"/"groc"/"vermell").
Usa un condicional per decidir si el robot avança o s'atura.
- "verd" → \`robot.dreta()\` i \`robot.print_robot("Puc creuar!")\`
- "groc" → \`robot.print_robot("Espera...")\`
- "vermell" → \`robot.print_robot("Para!")\``,
        starterCode: `color = "verd"\n\nif color == ___:\n    robot.dreta()\n    robot.print_robot("Puc creuar!")\nelif color == ___:\n    robot.print_robot("Espera...")\nelse:\n    robot.print_robot("Para!")`,
        grid: { cols: 7, rows: 4, robotStart: [1, 0], rocks: [[0,3],[2,3],[1,5]],door: [2, 6] },
        solution: (output, actions) => actions.some(a => a.type === "say") && actions.some(a => a.type === "move"),
        hint: "if color == \"verd\":"
      },
      {
        id: "cond_2",
        title: "El classificador de notes",
        description: `Crea \`nota\` (0-10) i usa condicionals per mostrar el resultat amb \`robot.print_robot()\`.`,
        starterCode: `nota = 7\n\nif nota >= ___:\n    robot.print_robot("Excel·lent! 🌟")\nelif ___:\n    robot.print_robot("Aprovat! ✅")\nelse:\n    robot.print_robot("Suspès ❌")`,
        grid: { cols: 6, rows: 5, robotStart: [0, 0], rocks: [[2,1],[2,3],[2,5],[4,0],[4,2],[4,4]] },
        solution: (output, actions) => actions.some(a => a.type === "say"),
        hint: "elif nota >= 5:"
      },
      {
        id: "cond_3",
        title: "El robot explorador",
        description: `El robot ha d'arribar al final del corredor evitant les pedres.
Comprova si hi ha pedra davant amb \`robot.pedra_davant()\` i decideix cap on moure't.`,
        starterCode: `if robot.pedra_davant():\n    robot.avall()\nelse:\n    robot.dreta()\n\nif robot.pedra_davant():\n    robot.amunt()\nelse:\n    robot.dreta()`,
        grid: {
          cols: 7, rows: 5, robotStart: [2, 0],
          rocks: [[2,2],[1,3],[3,3],[2,5]],
          goal: [2, 6]
        },
        solution: (output, actions) => {
          // Comprova si el robot ha arribat a la meta
          return actions.some(a => a.type === "goal");
        },
        hint: "Usa robot.pedra_davant() per detectar obstacles"
      }
    ]
  },
  {
    id: "iteratives",
    title: "Sentències iteratives",
    icon: "🔄",
    color: "purple",
    theory: {
      content: `
## Sentències iteratives (bucles)

Permeten repetir codi múltiples vegades.

### Bucle \`for\`:
\`\`\`python
for i in range(5):      # repeteix 5 vegades (0,1,2,3,4)
    print(i)

for element in llista:  # recorre una llista
    print(element)
\`\`\`

### Bucle \`while\`:
\`\`\`python
comptador = 0
while comptador < 5:
    print(comptador)
    comptador += 1      # important! si no, bucle infinit
\`\`\`

### Control de bucles:
- \`break\` → surt del bucle
- \`continue\` → salta a la següent iteració
      `
    },
    challenges: [
      {
        id: "iter_1",
        title: "El robot ballarí",
        description: `Usa un bucle \`for\` per fer avançar el robot 4 vegades cap a la dreta i arribar a la meta.`,
        starterCode: `for i in range(___):\n    robot.dreta()\n\nrobot.print_robot(f"He fet {i+1} passos!")`,
        grid: {
          cols: 8, rows: 3, robotStart: [1, 0],
          rocks: [],
          goal: [1, 4]
        },
        solution: (output, actions) => actions.filter(a => a.type === "move").length >= 4,
        hint: "range(4) genera els números 0, 1, 2, 3"
      },
      {
        id: "iter_2",
        title: "Esquiva les pedres",
        description: `Hi ha pedres al corredor! Usa un bucle \`while\` i \`robot.pedra_davant()\` per esquivar-les i arribar a la meta.`,
        starterCode: `while not robot.pedra_davant():\n    robot.dreta()\n\nrobot.avall()\nrobot.dreta()\nrobot.dreta()\nrobot.amunt()`,
        grid: {
          cols: 8, rows: 4, robotStart: [1, 0],
          rocks: [[1,3],[0,4],[2,4],[1,5],[0,6],[2,6]],
          goal: [1, 7]
        },
        solution: (output, actions) => actions.some(a => a.type === "goal"),
        hint: "while not robot.pedra_davant(): robot.dreta()"
      },
      {
        id: "iter_3",
        title: "El laberint",
        description: `Navega pel laberint usant bucles i condicionals. Arriba a la meta (⭐)!`,
        starterCode: `# Usa robot.pedra_davant(), robot.pedra_dreta(), robot.pedra_esquerra()\n# i les funcions robot.amunt/avall/dreta/esquerra()\n\nfor i in range(10):\n    if not robot.pedra_davant():\n        robot.dreta()\n    elif not robot.pedra_avall():\n        robot.avall()\n    else:\n        robot.amunt()`,
        grid: {
          cols: 8, rows: 6, robotStart: [0, 0],
          rocks: [[0,2],[1,0],[1,1],[2,2],[2,3],[3,1],[3,4],[4,2],[4,4],[5,3]],
          goal: [5, 7]
        },
        solution: (output, actions) => actions.some(a => a.type === "goal"),
        hint: "Comprova tots els costats abans de moure't"
      }
    ]
  },
  {
    id: "funcions",
    title: "Funcions",
    icon: "⚙️",
    color: "orange",
    theory: {
      content: `
## Funcions

Les funcions permeten **reutilitzar codi** donant-li un nom.

\`\`\`python
def saluda(nom):           # definició
    print(f"Hola, {nom}!")

saluda("Anna")             # crida
saluda("Bernat")           # reutilització
\`\`\`

### Funcions amb retorn:
\`\`\`python
def suma(a, b):
    return a + b

resultat = suma(3, 4)      # resultat = 7
\`\`\`

### Bones pràctiques:
- Nom descriptiu en minúscules amb _
- Una funció = una responsabilitat
- Documenta amb comentaris
      `
    },
    challenges: [
{
        id: "func_1",
        title: "La funció de salutació",
        description: `Crea una funció \`saludar(nom)\` que cridi \`robot.print_robot()\`. Crida-la 3 vegades.`,
        starterCode: `def saludar(nom):\n    robot.print_robot(___)\n\nsaludar("Anna")\nsaludar("Bernat")\nsaludar("Carla")`,
        grid: { cols: 6, rows: 4, robotStart: [0, 0], rocks: [[1,2],[2,4],[3,1]] },
        solution: (output, actions) => actions.filter(a => a.type === "say").length >= 3,
        hint: "robot.print_robot(f\"Hola, {nom}!\")"
      },
      {
        id: "func_2",
        title: "Funció de moviment",
        description: `Crea una funció \`anar_dreta(n)\` que mogui el robot \`n\` vegades a la dreta. Usa-la per arribar a la meta evitant pedres.`,
        starterCode: `def anar_dreta(n):\n    for i in range(n):\n        robot.dreta()\n\nanar_dreta(___)\nrobot.avall()\nanar_dreta(___)`,
        grid: {
          cols: 8, rows: 4, robotStart: [0, 0],
          rocks: [[0,3],[1,3],[0,6],[1,6],[2,6]],
          goal: [2, 7]
        },
        solution: (output, actions) => actions.some(a => a.type === "goal"),
        hint: "Pensa quants passos cal fer a cada tram"
      },
      {
        id: "func_3",
        title: "El robot intel·ligent",
        description: `Crea una funció \`esquivar()\` que comprovi \`robot.pedra_davant()\` i mogui el robot per sobre o per sota. Usa-la en un bucle per arribar a la meta.`,
        starterCode: `def esquivar():\n    if robot.pedra_davant():\n        if not robot.pedra_amunt():\n            robot.amunt()\n            robot.dreta()\n            robot.avall()\n        else:\n            robot.avall()\n            robot.dreta()\n            robot.amunt()\n    else:\n        robot.dreta()\n\nfor i in range(10):\n    esquivar()`,
        grid: {
          cols: 9, rows: 5, robotStart: [2, 0],
          rocks: [[2,2],[1,3],[3,3],[2,5],[1,6],[3,6]],
          goal: [2, 8]
        },
        solution: (output, actions) => actions.some(a => a.type === "goal"),
        hint: "La funció esquivar() encapsula la lògica de decisió"
      }
    ]
  }
];