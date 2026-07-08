import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearCotizacionDto } from './dto/crear-cotizacion.dto';
import { EstimarCotizacionDto } from './dto/estimar-cotizacion.dto';
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

export interface CalculoCotizacion {
  horasEstimadas: number;
  costoDesarrollo: number;
  costoInfra: number;
  precioSinMargen: number;
  precioFinal: number;
  margenPerfil: number;
  complejidad: string;
  costoDiseno: number;
  costoFrontend: number;
  costoBackend: number;
  costoBd: number;
}

interface DatosParaCalculo {
  tipo_proyecto: string;
  nivel_disenio: string;
  tiempo_entrega: string;
  hosting: string;
  perfil_cliente: string;
  cantidad_desarrolladores: number;
  tarifaHora: number;
}

@Injectable()
export class CotizacionesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly divisasService: DivisasService,
  ) {}

  private async obtenerTarifaHora(usuarioId: string): Promise<number> {
    const usuario = await this.authService.obtenerPorId(usuarioId);
    return usuario?.tarifa_hora_sugerida ?? usuario?.tarifa_hora_cop ?? 150000;
  }

  async calcular(datos: DatosParaCalculo): Promise<CalculoCotizacion> {
    const horasBase = await this.obtenerPeso(`${datos.tipo_proyecto}_base_hours`);
    const multDiseno = await this.obtenerPeso(`design_${datos.nivel_disenio}`);
    const multTiempo = await this.obtenerPeso(`delivery_${datos.tiempo_entrega}`);
    const costoInfra = await this.obtenerPeso(`hosting_${datos.hosting}`);
    const margenPerfil = await this.obtenerPeso(`margen_${datos.perfil_cliente}`);

    const arquetipo = obtenerArquetipo(datos.tipo_proyecto);
    const pctDiseno = await this.obtenerPeso(`desglose_${arquetipo}_diseno`);
    const pctFrontend = await this.obtenerPeso(`desglose_${arquetipo}_frontend`);
    const pctBackend = await this.obtenerPeso(`desglose_${arquetipo}_backend`);
    const pctBd = await this.obtenerPeso(`desglose_${arquetipo}_bd`);

    const horasEstimadas = horasBase * multDiseno * multTiempo;
    const costoDesarrollo = horasEstimadas * datos.tarifaHora * datos.cantidad_desarrolladores;
    const precioSinMargen = costoDesarrollo + costoInfra;
    const precioFinal = precioSinMargen * margenPerfil;
    const complejidad = this.calcularComplejidad(horasEstimadas);

    return {
      horasEstimadas,
      costoDesarrollo,
      costoInfra,
      precioSinMargen,
      precioFinal,
      margenPerfil,
      complejidad,
      costoDiseno: costoDesarrollo * pctDiseno,
      costoFrontend: costoDesarrollo * pctFrontend,
      costoBackend: costoDesarrollo * pctBackend,
      costoBd: costoDesarrollo * pctBd,
    };
  }

  async estimar(usuarioId: string, dto: EstimarCotizacionDto): Promise<CalculoCotizacion> {
    const tarifaHora = await this.obtenerTarifaHora(usuarioId);

    return this.calcular({
      tipo_proyecto: dto.tipo_proyecto,
      nivel_disenio: dto.nivel_disenio,
      tiempo_entrega: dto.tiempo_entrega,
      hosting: dto.hosting,
      perfil_cliente: dto.perfil_cliente,
      cantidad_desarrolladores: dto.cantidad_desarrolladores,
      tarifaHora,
    });
  }

  async crear(usuarioId: string, dto: CrearCotizacionDto): Promise<CotizacionConTecnologias> {
    const tarifaHora = await this.obtenerTarifaHora(usuarioId);

    const calculo = await this.calcular({
      tipo_proyecto: dto.tipo_proyecto,
      nivel_disenio: dto.nivel_disenio,
      tiempo_entrega: dto.tiempo_entrega,
      hosting: dto.hosting,
      perfil_cliente: dto.perfil_cliente,
      cantidad_desarrolladores: dto.cantidad_desarrolladores,
      tarifaHora,
    });

    const monedaSeleccionada = dto.moneda_seleccionada ?? 'COP';
    let precioConvertido: number | null = null;
    let tasaCambioUsada: number | null = null;

    if (monedaSeleccionada !== 'COP') {
      const conversion = this.divisasService.convertir({
        valor: calculo.precioFinal,
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
        horas_estimadas: calculo.horasEstimadas,
        costo_infraestructura: calculo.costoInfra,
        precio_final: calculo.precioFinal,
        complejidad: calculo.complejidad,
        generado_por_ia: dto.generado_por_ia ?? false,
        confianza_ia: dto.confianza_ia,
        moneda_seleccionada: monedaSeleccionada,
        precio_convertido: precioConvertido,
        tasa_cambio_usada: tasaCambioUsada,
        perfil_cliente: dto.perfil_cliente,
        margen_aplicado: calculo.margenPerfil,
        costo_diseno: calculo.costoDiseno,
        costo_frontend: calculo.costoFrontend,
        costo_backend: calculo.costoBackend,
        costo_bd: calculo.costoBd,
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
