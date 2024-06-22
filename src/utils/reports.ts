interface Item {
  total: number
}

interface Resultado {
  [key: string]: Item
}

export const crearObjetos = (n: number): Resultado => {
  const resultado: Resultado = {}

  for (let i = 1; i <= n; i++) {
    resultado[`${i}`] = {
      total: 0
    }
  }

  return resultado
}

export const crearArray = (n: number): string[] => {
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", 
    "Junio", "Julio", "Agosto", "Septiembre", 
    "Octubre", "Noviembre", "Diciembre"
  ];

  if (n < 1 || n > 12) {
    throw new Error("El número debe estar entre 1 y 12");
  }

  return months.slice(0, n);

}

