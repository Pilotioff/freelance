import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PesoSistema } from '@prisma/client';

export interface PesosAgrupados {
  [categoria: string]: PesoSistema[];
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerPesos(): Promise<PesosAgrupados> {
    const pesos = await this.prisma.pesoSistema.findMany({
      orderBy: [{ categoria: 'asc' }, { clave: 'asc' }],
    });

    return pesos.reduce<PesosAgrupados>((acc, peso) => {
      if (!acc[peso.categoria]) {
        acc[peso.categoria] = [];
      }
      acc[peso.categoria].push(peso);
      return acc;
    }, {});
  }

  async actualizarPeso(
    clave: string,
    valor: number,
    modificadoPor: string,
  ): Promise<PesoSistema> {
    const peso = await this.prisma.pesoSistema.findUnique({ where: { clave } });
    if (!peso) {
      throw new NotFoundException(`Peso no encontrado: ${clave}`);
    }

    const [actualizado] = await this.prisma.$transaction([
      this.prisma.pesoSistema.update({
        where: { clave },
        data: { valor },
      }),
      this.prisma.historialCambiosPesos.create({
        data: {
          peso_id: peso.id,
          valor_anterior: peso.valor,
          valor_nuevo: valor,
          modificado_por: modificadoPor,
        },
      }),
    ]);

    return actualizado;
  }
}
