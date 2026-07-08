import { useState, useCallback } from 'react';
import {
  CotizacionFormState,
  TipoProyecto,
  NivelDisenio,
  TiempoEntrega,
  Hosting,
  CrearCotizacionPayload,
  Cotizacion,
} from '../types';
import { cotizacionesApi } from '../api/cotizaciones.api';

const INITIAL_STATE: CotizacionFormState = {
  nombre_proyecto: '',
  tipo_proyecto: '',
  cantidad_paginas: 5,
  nivel_disenio: 'intermedio',
  tecnologias: [],
  cantidad_desarrolladores: 1,
  tiempo_entrega: '',
  hosting: '',
  generado_por_ia: false,
  supuestos: [],
  esMockup: false,
  moneda_seleccionada: 'COP',
};

export function useCotizacion() {
  const [form, setForm] = useState<CotizacionFormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Cotizacion | null>(null);

  const updateForm = useCallback((partial: Partial<CotizacionFormState>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetForm = useCallback(() => {
    setForm(INITIAL_STATE);
    setResultado(null);
    setError(null);
  }, []);

  const crearCotizacion = useCallback(async (): Promise<Cotizacion | null> => {
    if (!form.tipo_proyecto) {
      setError('Selecciona un tipo de proyecto');
      return null;
    }
    if (!form.nombre_proyecto.trim()) {
      setError('El nombre del proyecto es obligatorio');
      return null;
    }
    if (!form.hosting) {
      setError('Selecciona una opción de hosting');
      return null;
    }
    if (!form.tiempo_entrega) {
      setError('Selecciona un tiempo de entrega');
      return null;
    }

    setLoading(true);
    setError(null);

    const payload: CrearCotizacionPayload = {
      nombre_proyecto: form.nombre_proyecto.trim(),
      tipo_proyecto: form.tipo_proyecto as TipoProyecto,
      cantidad_paginas: form.cantidad_paginas,
      nivel_disenio: form.nivel_disenio as NivelDisenio,
      tecnologias: form.tecnologias,
      cantidad_desarrolladores: form.cantidad_desarrolladores,
      tiempo_entrega: form.tiempo_entrega as TiempoEntrega,
      hosting: form.hosting as Hosting,
      generado_por_ia: form.generado_por_ia,
      confianza_ia: form.confianza_ia,
      moneda_seleccionada: form.moneda_seleccionada,
    };

    try {
      const cotizacion = await cotizacionesApi.crear(payload);
      setResultado(cotizacion);
      return cotizacion;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear cotización';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [form]);

  return { form, updateForm, resetForm, crearCotizacion, loading, error, resultado };
}
