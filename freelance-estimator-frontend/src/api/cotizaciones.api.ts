import api, { unwrapData } from './axios';
import { Cotizacion, CrearCotizacionPayload } from '../types';

interface FiltrosCotizacion {
  complejidad?: string;
  desde?: string;
  hasta?: string;
}

export interface EstimarPayload {
  tipo_proyecto: string;
  cantidad_paginas: number;
  nivel_disenio: string;
  tecnologias?: string[];
  cantidad_desarrolladores: number;
  tiempo_entrega: string;
  hosting: string;
  perfil_cliente: string;
}

export interface EstimacionCalculada {
  horasEstimadas: number;
  costoDesarrollo: number;
  costoInfra: number;
  precioSinMargen: number;
  precioFinal: number;
  margenPerfil: number;
  complejidad: string;
  costoDiseno: number;
  costoFrontend: number;
  costoBackend: number;
  costoBd: number;
}

export const cotizacionesApi = {
  crear: async (payload: CrearCotizacionPayload): Promise<Cotizacion> => {
    const res = await api.post<{ data: Cotizacion }>('/cotizaciones', payload);
    return unwrapData(res);
  },

  estimar: async (payload: EstimarPayload): Promise<EstimacionCalculada> => {
    const res = await api.post<{ data: EstimacionCalculada }>('/cotizaciones/estimar', payload);
    return unwrapData(res);
  },

  listar: async (filtros?: FiltrosCotizacion): Promise<Cotizacion[]> => {
    const res = await api.get<{ data: Cotizacion[] }>('/cotizaciones', { params: filtros });
    return unwrapData(res);
  },
};
