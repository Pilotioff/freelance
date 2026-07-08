import { CotizacionFormState, TipoProyecto } from '../types';

export type NivelComplejidad = 'baja' | 'media' | 'alta' | 'muy_alta' | 'extrema';

export interface ResultadoComplejidad {
  nivel: NivelComplejidad;
  label: string;
  puntaje: number;
}

const TIPO_PUNTAJE_BASE: Record<TipoProyecto, number> = {
  landing: 0, blog: 0, portafolio: 0,
  api: 10, dashboard: 10, chat: 10, automatizacion: 10, pos: 10,
  webapp: 15, mobile: 15, ecommerce: 15, crm: 15, sistema_interno: 15,
  lms: 15, sistema_administrativo: 15,
  saas: 20, marketplace: 20, microservicios: 20, ia: 20,
  erp: 25,
};

function puntajeTecnologias(cantidad: number): number {
  if (cantidad <= 1) return 0;
  if (cantidad <= 3) return 5;
  if (cantidad <= 5) return 10;
  return 15;
}

function puntajeDiseno(nivel: CotizacionFormState['nivel_disenio']): number {
  const mapa: Record<string, number> = { basico: 0, intermedio: 5, premium: 10, animado: 15 };
  return mapa[nivel] ?? 0;
}

function puntajeHosting(hosting: string): number {
  const mapa: Record<string, number> = { ninguno: 0, basico: 5, vps: 10, cloud: 15 };
  return mapa[hosting] ?? 0;
}

function puntajeTiempoEntrega(tiempo: string): number {
  const mapa: Record<string, number> = { '1semana': 15, '2semanas': 10, '1mes': 5, mas1mes: 0 };
  return mapa[tiempo] ?? 0;
}

function puntajePaginas(cantidad: number): number {
  if (cantidad <= 5) return 0;
  if (cantidad <= 15) return 5;
  if (cantidad <= 30) return 10;
  return 15;
}

export function calcularComplejidad(form: CotizacionFormState): ResultadoComplejidad {
  const puntajeTipo = form.tipo_proyecto ? (TIPO_PUNTAJE_BASE[form.tipo_proyecto] ?? 10) : 0;

  const puntaje =
    puntajeTipo +
    puntajeTecnologias(form.tecnologias.length) +
    puntajeDiseno(form.nivel_disenio) +
    puntajeHosting(form.hosting || 'ninguno') +
    puntajeTiempoEntrega(form.tiempo_entrega || 'mas1mes') +
    puntajePaginas(form.cantidad_paginas);

  if (puntaje <= 20) return { nivel: 'baja', label: 'Baja', puntaje };
  if (puntaje <= 40) return { nivel: 'media', label: 'Media', puntaje };
  if (puntaje <= 60) return { nivel: 'alta', label: 'Alta', puntaje };
  if (puntaje <= 80) return { nivel: 'muy_alta', label: 'Muy Alta', puntaje };
  return { nivel: 'extrema', label: 'Extrema', puntaje };
}
