import api, { unwrapData } from './axios';
import { PerfilProfesional } from '../types';

export interface ActualizarTarifaPayload {
  tarifa_hora_cop?: number;
  tarifa_preferida?: 'manual' | 'sugerida';
}

export const perfilProfesionalApi = {
  obtener: async (): Promise<PerfilProfesional> => {
    const res = await api.get<{ data: PerfilProfesional }>('/perfil-profesional');
    return unwrapData(res);
  },

  actualizarTarifa: async (payload: ActualizarTarifaPayload): Promise<{ actualizado: boolean }> => {
    const res = await api.patch<{ data: { actualizado: boolean } }>('/perfil-profesional/tarifa', payload);
    return unwrapData(res);
  },

  exportarPdf: async (): Promise<void> => {
    const res = await api.get('/perfil-profesional/exportar', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'perfil-profesional.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
