import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CotizacionPorMes {
  mes: string;
  cantidad: number;
  total_precio: number;
}

export interface DashboardResumen {
  total_cotizaciones: number;
  precio_promedio: number;
  horas_totales: number;
  proyectos_mes: number;
  cotizaciones_por_mes: CotizacionPorMes[];
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerResumen(usuarioId: string): Promise<DashboardResumen> {
    const cotizaciones = await this.prisma.cotizacion.findMany({
      where: { usuario_id: usuarioId },
      orderBy: { creado_en: 'desc' },
    });

    const total = cotizaciones.length;
    const precioPromedio = total > 0
      ? cotizaciones.reduce((sum, c) => sum + c.precio_final, 0) / total
      : 0;
    const horasTotales = cotizaciones.reduce((sum, c) => sum + c.horas_estimadas, 0);

    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const proyectosMes = cotizaciones.filter(
      (c) => new Date(c.creado_en) >= inicioMes,
    ).length;

    const cotizacionesPorMes = this.agruparPorMes(cotizaciones);

    return {
      total_cotizaciones: total,
      precio_promedio: Math.round(precioPromedio),
      horas_totales: Math.round(horasTotales * 10) / 10,
      proyectos_mes: proyectosMes,
      cotizaciones_por_mes: cotizacionesPorMes,
    };
  }

  private agruparPorMes(
    cotizaciones: { creado_en: Date; precio_final: number }[],
  ): CotizacionPorMes[] {
    const meses: CotizacionPorMes[] = [];
    const ahora = new Date();

    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      const delMes = cotizaciones.filter((c) => {
        const d = new Date(c.creado_en);
        return d.getFullYear() === fecha.getFullYear() && d.getMonth() === fecha.getMonth();
      });

      meses.push({
        mes: mesKey,
        cantidad: delMes.length,
        total_precio: delMes.reduce((sum, c) => sum + c.precio_final, 0),
      });
    }

    return meses;
  }
}
