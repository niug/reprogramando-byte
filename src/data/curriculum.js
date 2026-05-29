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

Després fes que el robot es presenti amb:
\`robot.say(f"Hola! Em dic {nom} i tinc {edat} anys")\``,
        starterCode: `# Crea les variables
nom = 
edat = 

# Fes parlar el robot
robot.say(f"Hola! Em dic {nom} i tinc {edat} anys")`,
        solution: (output, robotActions) =>
          robotActions.some(a => a.type === "say" && a.text.includes("Hola")),
        robotActions: ["say"],
        hint: "Recorda posar el text entre cometes: nom = \"Anna\""
      },
      {
        id: "var_2",
        title: "La calculadora del robot",
        description: `El robot vol calcular l'àrea d'un rectangle.
Crea les variables \`amplada\` i \`altura\` amb els valors que vulguis, calcula l'\`area\` i mostra-la:
\`robot.say(f"L'àrea és {area}")\``,
        starterCode: `amplada = 
altura = 
area = 

robot.say(f"L'àrea és {area}")`,
        solution: (output, robotActions) =>
          robotActions.some(a => a.type === "say" && a.text.includes("àrea")),
        robotActions: ["say"],
        hint: "L'àrea = amplada * altura"
      },
      {
        id: "var_3",
        title: "Conversió de tipus",
        description: `El robot vol saber d'aquí quants anys tindrà el doble de la teva edat actual.
1. Guarda la teva edat en una variable \`edat\`
2. Calcula \`doble = edat * 2\`  
3. Calcula \`anys_fins = doble - edat\`
4. \`robot.say(f"D'aquí {anys_fins} anys tindré {doble} anys")\``,
        starterCode: `edat = 
doble = 
anys_fins = 

robot.say(f"D'aquí {anys_fins} anys tindré {doble} anys")`,
        solution: (output, robotActions) =>
          robotActions.some(a => a.type === "say"),
        robotActions: ["say"],
        hint: "anys_fins = doble - edat"
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
        description: `El robot ha de decidir si pot creuar.
Crea una variable \`color\` amb "verd", "groc" o "vermell".
- Si és "verd": \`robot.move("endavant")\` i \`robot.say("Puc creuar!")\`
- Si és "groc": \`robot.say("Espera...")\`  
- Si és "vermell": \`robot.say("Para!")\``,
        starterCode: `color = "verd"  # prova canviant el color

if color == ___:
    robot.move("endavant")
    robot.say("Puc creuar!")
elif color == ___:
    robot.say("Espera...")
else:
    robot.say("Para!")`,
        solution: (output, robotActions) =>
          robotActions.some(a => a.type === "say") &&
          robotActions.some(a => a.type === "move" || a.text),
        robotActions: ["say", "move"],
        hint: "Utilitza == per comparar strings: color == \"verd\""
      },
      {
        id: "cond_2",
        title: "El classificador de notes",
        description: `El robot és professor i ha de dir si has aprovat.
Crea una variable \`nota\` entre 0 i 10.
- \`nota >= 9\`: \`robot.say("Excel·lent! 🌟")\`
- \`nota >= 5\`: \`robot.say("Aprovat! ✅")\`
- Sinó: \`robot.say("Suspès ❌")\``,
        starterCode: `nota = 7  # canvia la nota

if nota >= ___:
    robot.say("Excel·lent! 🌟")
elif ___:
    robot.say("Aprovat! ✅")
else:
    robot.say("Suspès ❌")`,
        solution: (output, robotActions) =>
          robotActions.some(a => a.type === "say"),
        robotActions: ["say"],
        hint: "elif nota >= 5:"
      },
      {
        id: "cond_3",
        title: "El robot porter",
        description: `El robot guarda l'entrada. Només pot entrar qui tingui més de 18 anys I tingui invitació.
Crea \`edat\` i \`te_invitacio\` (True/False).
- Si les dues condicions: \`robot.move("obrir")\` i \`robot.say("Endavant!")\`
- Sinó: \`robot.say("Ho sento, no pots passar")\``,
        starterCode: `edat = 20
te_invitacio = True

if ___ and ___:
    robot.move("obrir")
    robot.say("Endavant!")
else:
    robot.say("Ho sento, no pots passar")`,
        solution: (output, robotActions) =>
          robotActions.some(a => a.type === "say"),
        robotActions: ["say", "move"],
        hint: "if edat >= 18 and te_invitacio:"
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
        description: `Fes que el robot balli 4 vegades seguides!
Utilitza un bucle \`for\` per fer que el robot faci \`robot.move("ballar")\` 4 vegades.
Al final: \`robot.say(f"He ballat {vegades} vegades!")\``,
        starterCode: `vegades = 0

for i in range(___):
    robot.move("ballar")
    vegades += 1

robot.say(f"He ballat {vegades} vegades!")`,
        solution: (output, robotActions) =>
          robotActions.filter(a => a.type === "move").length >= 4,
        robotActions: ["move", "say"],
        hint: "range(4) genera els números 0, 1, 2, 3"
      },
      {
        id: "iter_2",
        title: "Compte enrere!",
        description: `El robot ha de fer un compte enrere del 5 al 1 i després dir "¡Llançament!".
Utilitza un bucle \`while\` amb una variable \`comptador = 5\`.
Cada iteració: \`robot.say(str(comptador))\` i redueix el comptador.`,
        starterCode: `comptador = 5

while comptador > ___:
    robot.say(str(comptador))
    comptador -= ___

robot.say("¡Llançament! 🚀")`,
        solution: (output, robotActions) =>
          robotActions.filter(a => a.type === "say").length >= 6,
        robotActions: ["say"],
        hint: "comptador -= 1 redueix el comptador en 1 cada vegada"
      },
      {
        id: "iter_3",
        title: "El robot explorador",
        description: `El robot ha d'explorar una llista de llocs i moure's a cadascun.
Crea una llista \`llocs = ["nord", "sud", "est", "oest"]\`
Recorre-la amb un \`for\` i fes \`robot.move(lloc)\` per a cada un.
Al final: \`robot.say("Exploració completada!")\``,
        starterCode: `llocs = ["nord", "sud", "est", "oest"]

for ___ in llocs:
    robot.move(___)

robot.say("Exploració completada!")`,
        solution: (output, robotActions) =>
          robotActions.filter(a => a.type === "move").length >= 4,
        robotActions: ["move", "say"],
        hint: "for lloc in llocs: — la variable 'lloc' agafa cada valor de la llista"
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
        description: `Crea una funció \`saludar(nom)\` que faci que el robot digui "Hola, [nom]!".
Crida-la 3 vegades amb noms diferents.`,
        starterCode: `def saludar(nom):
    robot.say(___)

saludar("Anna")
saludar("Bernat")
saludar("Carla")`,
        solution: (output, robotActions) =>
          robotActions.filter(a => a.type === "say").length >= 3,
        robotActions: ["say"],
        hint: "robot.say(f\"Hola, {nom}!\")"
      },
      {
        id: "func_2",
        title: "El robot calculador",
        description: `Crea una funció \`calcular_area(amplada, altura)\` que retorni l'àrea.
Crida-la i fes que el robot digui el resultat:
\`robot.say(f"L'àrea és {area}")\``,
        starterCode: `def calcular_area(amplada, altura):
    return ___

area = calcular_area(5, 3)
robot.say(f"L'àrea és {area}")`,
        solution: (output, robotActions) =>
          robotActions.some(a => a.type === "say" && a.text.includes("15")),
        robotActions: ["say"],
        hint: "return amplada * altura"
      },
      {
        id: "func_3",
        title: "El robot ballarí intel·ligent",
        description: `Crea una funció \`ballar(vegades)\` que faci moure el robot \`vegades\` cops i al final digui quantes vegades ha ballat.
Crida-la amb 3 i amb 5.`,
        starterCode: `def ballar(vegades):
    for i in range(___):
        robot.move("ballar")
    robot.say(f"He ballat {vegades} vegades!")

ballar(___)
ballar(___)`,
        solution: (output, robotActions) =>
          robotActions.filter(a => a.type === "move").length >= 8,
        robotActions: ["move", "say"],
        hint: "Crida ballar(3) i ballar(5) → en total 8 moviments"
      }
    ]
  }
];