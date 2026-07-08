import { Inject, Injectable } from '@nestjs/common';
import { MARKET_DATA_PROVIDER, MarketDataProvider, PromedioMercado } from './market-data.interface';

@Injectable()
export class MarketComparisonService {
  constructor(
    @Inject(MARKET_DATA_PROVIDER) private readonly proveedor: MarketDataProvider,
  ) {}

  async obtenerPromedio(tipoProyecto: string): Promise<PromedioMercado> {
    return this.proveedor.obtenerPromedioMercado(tipoProyecto);
  }
}
