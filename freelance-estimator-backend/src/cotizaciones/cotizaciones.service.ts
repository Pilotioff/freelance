import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearCotizacionDto } from './dto/crear-cotizacion.dto';
import { Cotizacion, Prisma } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { DivisasService, Moneda } from '../divisas/divisas.service';
import { obtenerArquetipo } from './arquetipos';

export interface CotizacionConTecnologias extends Cotizacion {
  tecnologias: { id: string; tecnologia: string }[];
}

export interface FiltrosCotizacion {
  complejidad?: string;
  desde?: string;
  hasta?: string;
}

@Injectable()
export class CotizacionesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly divisasService: DivisasService,
  ) {}

  async crear(usuarioId: string, dto: CrearCotizacionDto): Promise<CotizacionConTecnologias> {
    const usuario = await this.authService.obtenerPorId(usuarioId);
    const tarifaHora = usuario?.tarifa_hora_cop ?? 150000;

    const horasBase = await this.obtenerPeso(`${dto.tipo_proyecto}_base_hours`);
    const multDiseno = await this.obtenerPeso(`design_${dto.nivel_disenio}`);
    const multTiempo = await this.obtenerPeso(`delivery_${dto.tiempo_entrega}`);
    const costoInfra = await this.obtenerPeso(`hosting_${dto.hosting}`);
    const margenPerfil = await this.obtenerPeso(`margen_${dto.perfil_cliente}`);

    const arquetipo = obtenerArquetipo(dto.tipo_proyecto);
    const pctDiseno = await this.obtenerPeso(`desglose_${arquetipo}_diseno`);
    const pctFrontend = await this.obtenerPeso(`desglose_${arquetipo}_frontend`);
    const pctBackend = await this.obtenerPeso(`desglose_${arquetipo}_backend`);
    const pctBd = await this.obtenerPeso(`desglose_${arquetipo}_bd`);

    const horasEstimadas = horasBase * multDiseno * multTiempo;
    const costoDesarrollo = horasEstimadas * tarifaHora * dto.cantidad_desarrolladores;
    const precioSinMargen = costoDesarrollo + costoInfra;
    const precioFinal = precioSinMargen * margenPerfil;
    const complejidad = this.calcularComplejidad(horasEstimadas);

    const costoDiseno = costoDesarrollo * pctDiseno;
    const costoFrontend = costoDesarrollo * pctFrontend;
    const costoBackend = costoDesarrollo * pctBackend;
    const costoBd = costoDesarrollo * pctBd;

    const monedaSeleccionada = dto.moneda_seleccionada ?? 'COP';
    let precioConvertido: number | null = null;
    let tasaCambioUsada: number | null = null;

    if (monedaSeleccionada !== 'COP') {
      const conversion = this.divisasService.convertir({
        valor: precioFinal,
        monedaOrigen: 'COP',
        monedaDestino: monedaSeleccionada as Moneda,
      });
      precioConvertido = conversion.resultado;
      tasaCambioUsada = conversion.tasa;
    }

    const cotizacion = await this.prisma.cotizacion.create({
      data: {
        usuario_id: usuarioId,
        nombre_proyecto: dto.nombre_proyecto,
        tipo_proyecto: dto.tipo_proyecto,
        cantidad_paginas: dto.cantidad_paginas,
        nivel_disenio: dto.nivel_disenio,
        hosting: dto.hosting,
        tiempo_entrega: dto.tiempo_entrega,
        cantidad_desarrolladores: dto.cantidad_desarrolladores,
        horas_estimadas: horasEstimadas,
        costo_infraestructura: costoInfra,
        precio_final: precioFinal,
        complejidad,
        generado_por_ia: dto.generado_por_ia ?? false,
        confianza_ia: dto.confianza_ia,
        moneda_seleccionada: monedaSeleccionada,
        precio_convertido: precioConvertido,
        tasa_cambio_usada: tasaCambioUsada,
        perfil_cliente: dto.perfil_cliente,
        margen_aplicado: margenPerfil,
        costo_diseno: costoDiseno,
        costo_frontend: costoFrontend,
        costo_backend: costoBackend,
        costo_bd: costoBd,
        tecnologias: {
          create: dto.tecnologias.map((t) => ({ tecnologia: t })),
        },
      },
      include: { tecnologias: true },
    });

    return cotizacion;
  }

  async listar(
    usuarioId: string,
    filtros: FiltrosCotizacion,
  ): Promise<CotizacionConTecnologias[]> {
    const where: Prisma.CotizacionWhereInput = { usuario_id: usuarioId };

    if (filtros.complejidad) {
      where.complejidad = filtros.complejidad;
    }

    if (filtros.desde || filtros.hasta) {
      where.creado_en = {};
      if (filtros.desde) {
        where.creado_en.gte = new Date(filtros.desde);
      }
      if (filtros.hasta) {
        where.creado_en.lte = new Date(filtros.hasta);
      }
    }

    return this.prisma.cotizacion.findMany({
      where,
      include: { tecnologias: true },
      orderBy: { creado_en: 'desc' },
    });
  }

  private async obtenerPeso(clave: string): Promise<number> {
    const peso = await this.prisma.pesoSistema.findUnique({ where: { clave } });
    if (!peso) {
      throw new NotFoundException(`Peso del sistema no encontrado: ${clave}`);
    }
    return peso.valor;
  }

  private calcularComplejidad(horasEstimadas: number): string {
    if (horasEstimadas < 80) return 'baja';
    if (horasEstimadas < 160) return 'media';
    return 'alta';
  }
}
