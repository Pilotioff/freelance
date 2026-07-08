import { useState, useEffect, useRef } from 'react';
import { cotizacionesApi, EstimacionCalculada } from '../api/cotizaciones.api';
import { CotizacionFormState } from '../types';

const CAMPOS_REQUERIDOS_PARA_ESTIMAR: (keyof CotizacionFormState)[] = [
  'tipo_proyecto',
  'nivel_disenio',
  'cantidad_desarrolladores',
  'tiempo_entrega',
  'hosting',
  'perfil_cliente',
];

function formularioListoParaEstimar(form: CotizacionFormState): boolean {
  return CAMPOS_REQUERIDOS_PARA_ESTIMAR.every((campo) => !!form[campo]);
}

export function useEstimacionViva(form: CotizacionFormState) {
  const [estimacion, setEstimacion] = useState<EstimacionCalculada | null>(null);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!formularioListoParaEstimar(form)) {
      setEstimacion(null);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setLoading(true);
      cotizacionesApi
        .estimar({
          tipo_proyecto: form.tipo_proyecto,
          cantidad_paginas: form.cantidad_paginas,
          nivel_disenio: form.nivel_disenio,
          tecnologias: form.tecnologias,
          cantidad_desarrolladores: form.cantidad_desarrolladores,
          tiempo_entrega: form.tiempo_entrega,
          hosting: form.hosting,
          perfil_cliente: form.perfil_cliente,
        })
        .then(setEstimacion)
        .catch(() => setEstimacion(null))
        .finally(() => setLoading(false));
    }, 400);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    form.tipo_proyecto,
    form.cantidad_paginas,
    form.nivel_disenio,
    form.tecnologias,
    form.cantidad_desarrolladores,
    form.tiempo_entrega,
    form.hosting,
    form.perfil_cliente,
  ]);

  return { estimacion, loading };
}
