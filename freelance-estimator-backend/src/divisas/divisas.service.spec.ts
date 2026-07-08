import { DivisasService } from './divisas.service';

describe('DivisasService', () => {
  let service: DivisasService;

  beforeEach(() => {
    service = new DivisasService();
  });

  it('debe retornar tasas de cambio', () => {
    const tasas = service.obtenerTasas();
    expect(tasas.USD).toBe(0.00025);
    expect(tasas.EUR).toBe(0.00023);
  });

  it('debe convertir COP a USD', () => {
    const result = service.convertir({
      valor: 4000000,
      monedaOrigen: 'COP',
      monedaDestino: 'USD',
    });
    expect(result.resultado).toBe(1000);
  });

  it('debe convertir USD a COP', () => {
    const result = service.convertir({
      valor: 1,
      monedaOrigen: 'USD',
      monedaDestino: 'COP',
    });
    expect(result.resultado).toBe(4000);
  });
});
