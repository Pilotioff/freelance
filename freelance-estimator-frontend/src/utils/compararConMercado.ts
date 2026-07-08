export type EstadoComparacion = 'dentro' | 'por_encima' | 'por_debajo';

export interface ResultadoComparacion {
  estado: EstadoComparacion;
  diferenciaPorcentaje: number;
  mensaje: string;
}

const UMBRAL_DENTRO_DEL_PROMEDIO = 10;

export function compararConMercado(
  valorHoraUsuario: number,
  valorHoraPromedioMercado: number,
): ResultadoComparacion {
  if (valorHoraPromedioMercado <= 0) {
    return { estado: 'dentro', diferenciaPorcentaje: 0, mensaje: 'No hay datos suficientes de mercado para comparar.' };
  }

  const diferencia = ((valorHoraUsuario - valorHoraPromedioMercado) / valorHoraPromedioMercado) * 100;
  const diferenciaAbs = Math.round(Math.abs(diferencia));

  if (Math.abs(diferencia) <= UMBRAL_DENTRO_DEL_PROMEDIO) {
    return {
      estado: 'dentro',
      diferenciaPorcentaje: Math.round(diferencia),
      mensaje: 'Tu precio está dentro del promedio del mercado.',
    };
  }

  if (diferencia > 0) {
    return {
      estado: 'por_encima',
      diferenciaPorcentaje: Math.round(diferencia),
      mensaje: `Estás cobrando aproximadamente un ${diferenciaAbs}% por encima del promedio.`,
    };
  }

  return {
    estado: 'por_debajo',
    diferenciaPorcentaje: Math.round(diferencia),
    mensaje: `Tu cotización es un ${diferenciaAbs}% inferior al promedio. Podrías estar subvalorando tu trabajo.`,
  };
}
