import { Test, TestingModule } from '@nestjs/testing';
import { ClientesService } from './clientes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClientesService', () => {
  let service: ClientesService;

  const clientesMock = [
    { id: 'c1', usuario_id: 'user-1', nombre: 'Ana', apellido: 'Gómez', activo: true, creado_en: new Date('2026-01-01') },
    { id: 'c2', usuario_id: 'user-1', nombre: 'Beto', apellido: 'Ruiz', activo: true, creado_en: new Date('2026-02-01') },
  ];

  const agregadosPorCliente: Record<string, { count: number; sum: number }> = {
    c1: { count: 3, sum: 900000 },
    c2: { count: 1, sum: 100000 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: PrismaService,
          useValue: {
            cliente: {
              findMany: jest.fn(() => Promise.resolve(clientesMock)),
            },
            cotizacion: {
              aggregate: jest.fn(({ where }: { where: { cliente_id: string } }) => {
                const datos = agregadosPorCliente[where.cliente_id] ?? { count: 0, sum: 0 };
                return Promise.resolve({
                  _count: { id: datos.count },
                  _sum: { precio_final: datos.sum || null },
                  _max: { creado_en: null },
                });
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get(ClientesService);
  });

  it('debe listar clientes con sus metricas agregadas', async () => {
    const resultado = await service.listar('user-1', {});

    expect(resultado.total).toBe(2);
    const ana = resultado.clientes.find((c) => c.id === 'c1');
    expect(ana?.cantidad_cotizaciones).toBe(3);
    expect(ana?.valor_total_cotizado).toBe(900000);
  });

  it('debe ordenar por valor_total_cotizado descendente', async () => {
    const resultado = await service.listar('user-1', { ordenarPor: 'valor_total_cotizado', orden: 'desc' });

    expect(resultado.clientes[0].id).toBe('c1');
    expect(resultado.clientes[1].id).toBe('c2');
  });

  it('debe paginar correctamente', async () => {
    const resultado = await service.listar('user-1', { pagina: 1, porPagina: 1 });

    expect(resultado.clientes.length).toBe(1);
    expect(resultado.total).toBe(2);
  });
});
