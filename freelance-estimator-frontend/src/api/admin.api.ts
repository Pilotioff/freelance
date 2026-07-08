import api, { unwrapData } from './axios';
import { PesosAgrupados, PesoSistema } from '../types';

export const adminApi = {
  pesos: async (): Promise<PesosAgrupados> => {
    const res = await api.get<{ data: PesosAgrupados }>('/admin/pesos');
    return unwrapData(res);
  },

  actualizarPeso: async (clave: string, valor: number): Promise<PesoSistema> => {
    const res = await api.patch<{ data: PesoSistema }>(`/admin/pesos/${clave}`, { valor });
    return unwrapData(res);
  },
};
