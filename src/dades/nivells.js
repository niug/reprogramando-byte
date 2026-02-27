export const contingutNivells = [
  {
    titol: "Tipo de Datos",
    proves: [
      {
        titol_prova: "Inyección de Identidad",
        teoria: "En Python, una <b>variable</b> es como una caja donde guardamos información. Para guardar un texto (string) utilizacmos comillas: <code>nombre = 'Byte'</code>. Para números (integers), sin comillas: <code>edat = 10</code>.",
        missio: "Configura el protocolo inicial: Crea una variable que se llame 'alias' con el valor 'Byte'.",
        validarCodi: (py) => py.globals.get("alias") === "Byte"
      },
    ]
  }
];