import { Test, TestingModule } from '@nestjs/testing';
import { CotizacionesService } from './cotizaciones.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { NotFoundException } from '@nestjs/common';

describe('CotizacionesService', () => {
  let service: CotizacionesService;
  let prisma: jest.Mocked<PrismaService>;

  const mockPesos: Record<string, number> = {
    webapp_base_hours: 160,
    design_intermedio: 1.3,
    delivery_1mes: 1,
    hosting_vps: 1500000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CotizacionesService,
        {
          provide: PrismaService,
          useValue: {
            pesoSistema: {
              findUnique: jest.fn(({ where }: { where: { clave: string } }) =>
                Promise.resolve(
                  mockPesos[where.clave]
                    ? { clave: where.clave, valor: mockPesos[where.clave] }
                    : null,
                ),
              ),
            },
            cotizacion: {
              create: jest.fn((args) =>
                Promise.resolve({ id: 'cot-1', ...args.data, tecnologias: [] }),
              ),
              findMany: jest.fn(() => Promise.resolve([])),
            },
          },
        },
        {
          provide: AuthService,
          useValue: {
            obtenerPorId: jest.fn(() =>
              Promise.resolve({ id: 'user-1', tarifa_hora_cop: 150000 }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get(CotizacionesService);
    prisma = module.get(PrismaService);
  });

  it('debe calcular precio final correctamente', async () => {
    const result = await service.crear('user-1', {
      nombre_proyecto: 'Test',
      tipo_proyecto: 'webapp',
      cantidad_paginas: 10,
      nivel_disenio: 'intermedio',
      tecnologias: ['React'],
      cantidad_desarrolladores: 2,
      tiempo_entrega: '1mes',
      hosting: 'vps',
    });

    const horasEsperadas = 160 * 1.3 * 1;
    const precioEsperado = horasEsperadas * 150000 * 2 + 1500000;
    expect(result.horas_estimadas).toBe(horasEsperadas);
    expect(result.precio_final).toBe(precioEsperado);
    expect(result.complejidad).toBe('alta');
  });

  it('debe lanzar error si peso no existe', async () => {
    await expect(
      service.crear('user-1', {
        nombre_proyecto: 'Test',
        tipo_proyecto: 'inexistente',
        cantidad_paginas: 1,
        nivel_disenio: 'intermedio',
        tecnologias: [],
        cantidad_desarrolladores: 1,
        tiempo_entrega: '1mes',
        hosting: 'vps',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('debe listar cotizaciones del usuario', async () => {
    const cotizaciones = await service.listar('user-1', {});
    expect(cotizaciones).toEqual([]);
    expect(prisma.cotizacion.findMany).toHaveBeenCalled();
  });
});
