export const contingutNivells = [
  {
    titol: "Tipus de Dades",
    proves: [
      {
        titol_prova: "Injecció d'Identitat",
        teoria: "En Python, una <b>variable</b> és com una caixa on guardem informació. Per guardar un text (string) fem servir cometes: <code>nom = 'Byte'</code>. Per números (integers), no calen: <code>edat = 10</code>.",
        missio: "Configura el protocol inicial: Crea una variable anomenada 'alias' amb el valor 'Byte'.",
        validar: (py) => py.globals.get("alias") === "Byte"
      },
      // ... 3 proves més
    ]
  },
  {
    titol: "Condicionals",
    proves: [
      {
        missio: "Si la x de l'heroi és 0, mou-lo a la dreta.",
        hint: "Fes servir 'if heroi.x == 0:'"
      }
    ]
  }
  // I així fins a completar els 4 mòduls
];