import api, { unwrapData } from './axios';
import { ResultadoIA } from '../types';

export const iaApi = {
  analizarDocumento: async (file: File): Promise<ResultadoIA> => {
    const formData = new FormData();
    formData.append('documento', file);
    const res = await api.post<{ data: ResultadoIA }>('/ia/analizar-documento', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return unwrapData(res);
  },

  analizarMockup: async (file: File): Promise<ResultadoIA> => {
    const formData = new FormData();
    formData.append('imagen', file);
    const res = await api.post<{ data: ResultadoIA }>('/ia/analizar-mockup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return unwrapData(res);
  },
};
