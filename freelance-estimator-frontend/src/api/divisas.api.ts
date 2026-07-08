import api, { unwrapData } from './axios';
import { TasasCambio, ResultadoConversion } from '../types';

export const divisasApi = {
  tasas: async (): Promise<TasasCambio> => {
    const res = await api.get<{ data: TasasCambio }>('/divisas/tasas');
    return unwrapData(res);
  },

  convertir: async (
    valor: number,
    monedaOrigen: string,
    monedaDestino: string,
  ): Promise<ResultadoConversion> => {
    const res = await api.post<{ data: ResultadoConversion }>('/divisas/convertir', {
      valor,
      monedaOrigen,
      monedaDestino,
    });
    return unwrapData(res);
  },
};
