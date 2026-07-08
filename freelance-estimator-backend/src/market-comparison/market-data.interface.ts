export interface PromedioMercado {
  tipo_proyecto: string;
  valor_hora_promedio: number;
  rango_hora_min: number;
  rango_hora_max: number;
}

export const MARKET_DATA_PROVIDER = 'MARKET_DATA_PROVIDER';

export interface MarketDataProvider {
  obtenerPromedioMercado(tipoProyecto: string): Promise<PromedioMercado>;
}
