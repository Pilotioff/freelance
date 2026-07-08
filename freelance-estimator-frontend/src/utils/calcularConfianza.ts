import { CotizacionFormState } from '../types';

export interface ResultadoConfianza {
  porcentaje: number;
  explicacion: string;
}

interface FactorConfianza {
  cumplido: boolean;
  peso: number;
}

export function calcularConfianza(form: CotizacionFormState): ResultadoConfianza {
  const factores: FactorConfianza[] = [
    { cumplido: !!form.tipo_proyecto, peso: 20 },
    { cumplido: !!form.nombre_proyecto.trim(), peso: 10 },
    { cumplido: !!form.hosting, peso: 15 },
    { cumplido: !!form.tiempo_entrega, peso: 15 },
    { cumplido: !!form.perfil_cliente, peso: 15 },
    { cumplido: form.tecnologias.length > 0, peso: 15 },
    { cumplido: form.cantidad_paginas > 0, peso: 10 },
  ];

  const base = factores.reduce((acc, f) => acc + (f.cumplido ? f.peso : 0), 0);
  const porcentaje = Math.min(100, Math.max(30, base));

  const explicacion =
    porcentaje >= 90
      ? 'Esta estimación está basada en proyectos similares y reglas de cálculo, con información completa.'
      : porcentaje >= 60
        ? 'Esta estimación está basada en proyectos similares y reglas de cálculo. Completa más campos para mayor precisión.'
        : 'Faltan datos importantes. Completa el formulario para una estimación más precisa.';

  return { porcentaje, explicacion };
}
