import api, { unwrapData } from './axios';

export interface PromedioMercado {
  tipo_proyecto: string;
  valor_hora_promedio: number;
  rango_hora_min: number;
  rango_hora_max: number;
}

export const marketComparisonApi = {
  obtenerPromedio: async (tipoProyecto: string): Promise<PromedioMercado> => {
    const res = await api.get<{ data: PromedioMercado }>(`/market-comparison/${tipoProyecto}`);
    return unwrapData(res);
  },
};
