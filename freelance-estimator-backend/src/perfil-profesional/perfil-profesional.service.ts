import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { FreelancerExperienceService } from '../freelancer-experience/freelancer-experience.service';
import { Usuario, UsuarioDocument } from '../mongo/schemas/usuario.schema';
import { EvaluacionExperiencia, EvaluacionExperienciaDocument } from '../mongo/schemas/evaluacion-experiencia.schema';
import { ActualizarTarifaDto } from './dto/actualizar-tarifa.dto';
import { LABELS_TECNOLOGIA } from '../freelancer-experience/tecnologias';

const CATEGORIA_LABEL: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  bd: 'Bases de datos',
  devops: 'DevOps',
  cloud: 'Cloud',
  herramientas: 'Herramientas',
};

export interface EstadisticasPerfil {
  cotizaciones_realizadas: number;
  valor_promedio: number;
  cantidad_clientes: number;
  proyecto_mas_costoso: { nombre_proyecto: string; precio_final: number } | null;
  tecnologias_mas_usadas: { tecnologia: string; cantidad: number }[];
}

export interface PerfilProfesional {
  nombre: string;
  avatar_url?: string;
  nivel_detectado: string | null;
  especialidad: string | null;
  valor_hora_recomendado: number | null;
  valor_hora_personalizado?: number;
  tarifa_preferida: string;
  fecha_ultima_evaluacion: Date | null;
  promedio_por_categoria: Record<string, { label: string; valor: number }>;
  tecnologias_evaluadas: { tecnologia: string; label: string; estrellas: number }[];
  confianza: number | null;
  recomendaciones: string[];
  estadisticas: EstadisticasPerfil;
}

@Injectable()
export class PerfilProfesionalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly freelancerExperienceService: FreelancerExperienceService,
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<UsuarioDocument>,
    @InjectModel(EvaluacionExperiencia.name)
    private readonly evaluacionModel: Model<EvaluacionExperienciaDocument>,
  ) {}

  async obtenerPerfil(usuarioId: string): Promise<PerfilProfesional> {
    const usuario = await this.authService.obtenerPorId(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    let evaluacion: EvaluacionExperienciaDocument | null = null;
    try {
      evaluacion = await this.freelancerExperienceService.obtenerMiEvaluacion(usuarioId);
    } catch {
      evaluacion = null;
    }

    const promedioPorCategoria: Record<string, { label: string; valor: number }> = {};
    let especialidad: string | null = null;
    let mejorPromedio = -1;

    if (evaluacion) {
      for (const [clave, valor] of Object.entries(evaluacion.promedio_por_categoria)) {
        promedioPorCategoria[clave] = { label: CATEGORIA_LABEL[clave] ?? clave, valor };
        if (valor > mejorPromedio) {
          mejorPromedio = valor;
          especialidad = CATEGORIA_LABEL[clave] ?? clave;
        }
      }
    }

    const tecnologiasEvaluadas = evaluacion
      ? Object.entries(evaluacion.puntajes)
          .map(([tecnologia, estrellas]) => ({
            tecnologia,
            label: LABELS_TECNOLOGIA[tecnologia] ?? tecnologia,
            estrellas,
          }))
          .sort((a, b) => b.estrellas - a.estrellas)
      : [];

    const estadisticas = await this.calcularEstadisticas(usuarioId);
    const recomendaciones = this.generarRecomendaciones(evaluacion, promedioPorCategoria);

    return {
      nombre: `${usuario.nombre} ${usuario.apellido}`,
      avatar_url: usuario.avatar_url,
      nivel_detectado: evaluacion?.nivel_detectado ?? null,
      especialidad,
      valor_hora_recomendado: evaluacion?.tarifa_sugerida_cop ?? usuario.tarifa_hora_sugerida ?? null,
      valor_hora_personalizado: usuario.tarifa_hora_cop,
      tarifa_preferida: usuario.tarifa_preferida ?? 'manual',
      fecha_ultima_evaluacion: evaluacion?.get('creado_en') ?? null,
      promedio_por_categoria: promedioPorCategoria,
      tecnologias_evaluadas: tecnologiasEvaluadas,
      confianza: evaluacion?.confianza ?? null,
      recomendaciones,
      estadisticas,
    };
  }

  async actualizarTarifa(usuarioId: string, dto: ActualizarTarifaDto): Promise<{ actualizado: boolean }> {
    const cambios: Record<string, unknown> = {};
    if (dto.tarifa_hora_cop !== undefined) cambios.tarifa_hora_cop = dto.tarifa_hora_cop;
    if (dto.tarifa_preferida !== undefined) cambios.tarifa_preferida = dto.tarifa_preferida;

    await this.usuarioModel.findByIdAndUpdate(usuarioId, cambios);
    return { actualizado: true };
  }

  private async calcularEstadisticas(usuarioId: string): Promise<EstadisticasPerfil> {
    const cotizaciones = await this.prisma.cotizacion.findMany({
      where: { usuario_id: usuarioId },
      include: { tecnologias: true },
    });

    const cantidadClientes = new Set(
      cotizaciones.filter((c) => c.cliente_id).map((c) => c.cliente_id),
    ).size;

    const valorPromedio =
      cotizaciones.length > 0
        ? cotizaciones.reduce((acc, c) => acc + c.precio_final, 0) / cotizaciones.length
        : 0;

    const proyectoMasCostoso = cotizaciones.reduce<{ nombre_proyecto: string; precio_final: number } | null>(
      (max, c) => (!max || c.precio_final > max.precio_final ? { nombre_proyecto: c.nombre_proyecto, precio_final: c.precio_final } : max),
      null,
    );

    const conteoTecnologias = new Map<string, number>();
    for (const cot of cotizaciones) {
      for (const t of cot.tecnologias) {
        conteoTecnologias.set(t.tecnologia, (conteoTecnologias.get(t.tecnologia) ?? 0) + 1);
      }
    }
    const tecnologiasMasUsadas = [...conteoTecnologias.entries()]
      .map(([tecnologia, cantidad]) => ({ tecnologia, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    return {
      cotizaciones_realizadas: cotizaciones.length,
      valor_promedio: valorPromedio,
      cantidad_clientes: cantidadClientes,
      proyecto_mas_costoso: proyectoMasCostoso,
      tecnologias_mas_usadas: tecnologiasMasUsadas,
    };
  }

  private generarRecomendaciones(
    evaluacion: EvaluacionExperienciaDocument | null,
    promedioPorCategoria: Record<string, { label: string; valor: number }>,
  ): string[] {
    if (!evaluacion) return [];
    const recomendaciones: string[] = [];

    const categoriaMasDebil = Object.entries(promedioPorCategoria).sort((a, b) => a[1].valor - b[1].valor)[0];
    if (categoriaMasDebil && categoriaMasDebil[1].valor < 3.5) {
      recomendaciones.push(`Fortalecer ${categoriaMasDebil[1].label} podría incrementar tus oportunidades laborales.`);
    }

    const tecnologiasDebiles = Object.entries(evaluacion.puntajes)
      .filter(([, estrellas]) => estrellas <= 2)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 1);

    for (const [tecnologia, estrellas] of tecnologiasDebiles) {
      const label = LABELS_TECNOLOGIA[tecnologia] ?? tecnologia;
      const porcentaje = Math.min(15, (5 - estrellas) * 3);
      recomendaciones.push(`Aprender ${label} aumentaría aproximadamente un ${porcentaje}% tu valor de mercado.`);
    }

    return recomendaciones;
  }
}
