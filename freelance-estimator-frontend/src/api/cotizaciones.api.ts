import api, { unwrapData } from './axios';
import { Cotizacion, CrearCotizacionPayload } from '../types';

interface FiltrosCotizacion {
  complejidad?: string;
  desde?: string;
  hasta?: string;
}

export const cotizacionesApi = {
  crear: async (payload: CrearCotizacionPayload): Promise<Cotizacion> => {
    const res = await api.post<{ data: Cotizacion }>('/cotizaciones', payload);
    return unwrapData(res);
  },

  listar: async (filtros?: FiltrosCotizacion): Promise<Cotizacion[]> => {
    const res = await api.get<{ data: Cotizacion[] }>('/cotizaciones', { params: filtros });
    return unwrapData(res);
  },
};
