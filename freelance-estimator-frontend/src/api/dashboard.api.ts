import api, { unwrapData } from './axios';
import { DashboardResumen } from '../types';

export const dashboardApi = {
  resumen: async (): Promise<DashboardResumen> => {
    const res = await api.get<{ data: DashboardResumen }>('/dashboard/resumen');
    return unwrapData(res);
  },
};
