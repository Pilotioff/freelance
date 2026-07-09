import { Test, TestingModule } from '@nestjs/testing';
import { MarketComparisonService } from './market-comparison.service';
import { MARKET_DATA_PROVIDER, PromedioMercado } from './market-data.interface';

describe('MarketComparisonService', () => {
  let service: MarketComparisonService;
  let proveedorMock: { obtenerPromedioMercado: jest.Mock };

  const promedioFalso: PromedioMercado = {
    tipo_proyecto: 'webapp',
    valor_hora_promedio: 90000,
    rango_hora_min: 65000,
    rango_hora_max: 130000,
  };

  beforeEach(async () => {
    proveedorMock = { obtenerPromedioMercado: jest.fn().mockResolvedValue(promedioFalso) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketComparisonService,
        { provide: MARKET_DATA_PROVIDER, useValue: proveedorMock },
      ],
    }).compile();

    service = module.get(MarketComparisonService);
  });

  it('debe delegar al proveedor de datos de mercado inyectado', async () => {
    const resultado = await service.obtenerPromedio('webapp');

    expect(proveedorMock.obtenerPromedioMercado).toHaveBeenCalledWith('webapp');
    expect(resultado).toEqual(promedioFalso);
  });

  it('debe funcionar con cualquier implementacion que cumpla la interfaz (desacoplado del mock)', async () => {
    const otroProveedor = {
      obtenerPromedioMercado: jest.fn().mockResolvedValue({
        tipo_proyecto: 'erp',
        valor_hora_promedio: 130000,
        rango_hora_min: 90000,
        rango_hora_max: 190000,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketComparisonService,
        { provide: MARKET_DATA_PROVIDER, useValue: otroProveedor },
      ],
    }).compile();

    const otroServicio = module.get(MarketComparisonService);
    const resultado = await otroServicio.obtenerPromedio('erp');

    expect(resultado.valor_hora_promedio).toBe(130000);
  });
});
