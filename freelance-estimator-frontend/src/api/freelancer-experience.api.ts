import api, { unwrapData } from './axios';
import { ResultadoEvaluacion } from '../types';

export interface PuntajeTecnologia {
  tecnologia: string;
  estrellas: number;
}

export const freelancerExperienceApi = {
  evaluar: async (puntajes: PuntajeTecnologia[]): Promise<ResultadoEvaluacion> => {
    const res = await api.post<{ data: ResultadoEvaluacion }>('/freelancer-experience/evaluar', { puntajes });
    return unwrapData(res);
  },

  miEvaluacion: async (): Promise<ResultadoEvaluacion | null> => {
    try {
      const res = await api.get<{ data: ResultadoEvaluacion }>('/freelancer-experience/mi-evaluacion');
      return unwrapData(res);
    } catch {
      return null;
    }
  },
};
