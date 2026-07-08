import { Injectable } from '@nestjs/common';
import { MarketDataProvider, PromedioMercado } from './market-data.interface';

interface DatoMercado {
  min: number;
  promedio: number;
  max: number;
}

const DATOS_MOCK: Record<string, DatoMercado> = {
  landing: { min: 40000, promedio: 55000, max: 70000 },
  blog: { min: 35000, promedio: 45000, max: 60000 },
  portafolio: { min: 35000, promedio: 45000, max: 60000 },
  ecommerce: { min: 60000, promedio: 85000, max: 120000 },
  webapp: { min: 65000, promedio: 90000, max: 130000 },
  mobile: { min: 70000, promedio: 95000, max: 140000 },
  dashboard: { min: 60000, promedio: 85000, max: 120000 },
  crm: { min: 70000, promedio: 100000, max: 150000 },
  erp: { min: 90000, promedio: 130000, max: 190000 },
  marketplace: { min: 80000, promedio: 115000, max: 170000 },
  saas: { min: 85000, promedio: 120000, max: 180000 },
  sistema_interno: { min: 65000, promedio: 90000, max: 135000 },
  chat: { min: 60000, promedio: 85000, max: 125000 },
  automatizacion: { min: 65000, promedio: 95000, max: 140000 },
  pos: { min: 60000, promedio: 85000, max: 125000 },
  lms: { min: 65000, promedio: 90000, max: 135000 },
  ia: { min: 90000, promedio: 135000, max: 200000 },
  microservicios: { min: 85000, promedio: 125000, max: 185000 },
  sistema_administrativo: { min: 65000, promedio: 90000, max: 135000 },
  api: { min: 60000, promedio: 90000, max: 130000 },
};

const DEFAULT: DatoMercado = { min: 55000, promedio: 80000, max: 120000 };

@Injectable()
export class MockMarketDataProvider implements MarketDataProvider {
  async obtenerPromedioMercado(tipoProyecto: string): Promise<PromedioMercado> {
    const dato = DATOS_MOCK[tipoProyecto] ?? DEFAULT;
    return {
      tipo_proyecto: tipoProyecto,
      valor_hora_promedio: dato.promedio,
      rango_hora_min: dato.min,
      rango_hora_max: dato.max,
    };
  }
}
