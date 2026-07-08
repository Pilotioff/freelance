import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EvaluacionExperiencia,
  EvaluacionExperienciaDocument,
} from '../mongo/schemas/evaluacion-experiencia.schema';
import { Usuario, UsuarioDocument } from '../mongo/schemas/usuario.schema';
import { EvaluarExperienciaDto } from './dto/evaluar-experiencia.dto';
import {
  Categoria,
  LABELS_TECNOLOGIA,
  PESO_CATEGORIA,
  TECNOLOGIAS_EVALUABLES,
  TECNOLOGIA_CATEGORIA,
} from './tecnologias';

interface NivelRango {
  nivel: string;
  min: number;
  max: number;
  tarifaMin: number;
  tarifaMax: number;
}

const NIVELES: NivelRango[] = [
  { nivel: 'Junior', min: 1.0, max: 2.0, tarifaMin: 35000, tarifaMax: 55000 },
  { nivel: 'Semi Senior', min: 2.0, max: 3.3, tarifaMin: 60000, tarifaMax: 90000 },
  { nivel: 'Senior', min: 3.3, max: 4.4, tarifaMin: 95000, tarifaMax: 140000 },
  { nivel: 'Senior / Lead', min: 4.4, max: 5.0, tarifaMin: 150000, tarifaMax: 220000 },
];

export interface ResultadoEvaluacion {
  nivel_detectado: string;
  promedio_general: number;
  promedio_por_categoria: Record<Categoria, number>;
  tarifa_sugerida_cop: number;
  fortalezas: string[];
  areas_mejora: string[];
  confianza: number;
}

@Injectable()
export class FreelancerExperienceService {
  constructor(
    @InjectModel(EvaluacionExperiencia.name)
    private readonly evaluacionModel: Model<EvaluacionExperienciaDocument>,
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async evaluar(usuarioId: string, dto: EvaluarExperienciaDto): Promise<ResultadoEvaluacion> {
    const tecnologiasRecibidas = dto.puntajes.map((p) => p.tecnologia);
    const faltantes = TECNOLOGIAS_EVALUABLES.filter((t) => !tecnologiasRecibidas.includes(t));
    if (faltantes.length > 0) {
      throw new BadRequestException(
        `Faltan calificar ${faltantes.length} tecnologías: ${faltantes.join(', ')}`,
      );
    }

    const puntajesMap: Record<string, number> = {};
    for (const p of dto.puntajes) {
      puntajesMap[p.tecnologia] = p.estrellas;
    }

    const resultado = this.calcular(puntajesMap);

    await this.evaluacionModel.create({
      usuario_id: usuarioId,
      puntajes: puntajesMap,
      promedio_por_categoria: resultado.promedio_por_categoria,
      promedio_general: resultado.promedio_general,
      nivel_detectado: resultado.nivel_detectado,
      tarifa_sugerida_cop: resultado.tarifa_sugerida_cop,
      fortalezas: resultado.fortalezas,
      areas_mejora: resultado.areas_mejora,
      confianza: resultado.confianza,
    });

    await this.usuarioModel.findByIdAndUpdate(usuarioId, {
      onboarding_completado: true,
      tarifa_hora_sugerida: resultado.tarifa_sugerida_cop,
    });

    return resultado;
  }

  async obtenerMiEvaluacion(usuarioId: string): Promise<EvaluacionExperienciaDocument> {
    const evaluacion = await this.evaluacionModel
      .findOne({ usuario_id: usuarioId })
      .sort({ creado_en: -1 });
    if (!evaluacion) {
      throw new NotFoundException('Aún no has completado la evaluación de experiencia');
    }
    return evaluacion;
  }

  private calcular(puntajes: Record<string, number>): ResultadoEvaluacion {
    const sumaPorCategoria: Record<Categoria, { total: number; cantidad: number }> = {
      frontend: { total: 0, cantidad: 0 },
      backend: { total: 0, cantidad: 0 },
      bd: { total: 0, cantidad: 0 },
      devops: { total: 0, cantidad: 0 },
      cloud: { total: 0, cantidad: 0 },
      herramientas: { total: 0, cantidad: 0 },
    };

    for (const [tecnologia, estrellas] of Object.entries(puntajes)) {
      const categoria = TECNOLOGIA_CATEGORIA[tecnologia];
      if (!categoria) continue;
      sumaPorCategoria[categoria].total += estrellas;
      sumaPorCategoria[categoria].cantidad += 1;
    }

    const promedioPorCategoria = {} as Record<Categoria, number>;
    let promedioGeneral = 0;

    for (const categoria of Object.keys(sumaPorCategoria) as Categoria[]) {
      const { total, cantidad } = sumaPorCategoria[categoria];
      const promedio = cantidad > 0 ? total / cantidad : 0;
      promedioPorCategoria[categoria] = Math.round(promedio * 100) / 100;
      promedioGeneral += promedio * PESO_CATEGORIA[categoria];
    }
    promedioGeneral = Math.round(promedioGeneral * 100) / 100;

    const rango = NIVELES.find((n) => promedioGeneral >= n.min && promedioGeneral <= n.max) ?? NIVELES[0];
    const posicionEnRango =
      rango.max === rango.min ? 1 : (promedioGeneral - rango.min) / (rango.max - rango.min);
    const tarifaSugerida = Math.round(
      rango.tarifaMin + (rango.tarifaMax - rango.tarifaMin) * posicionEnRango,
    );

    const ordenadas = Object.entries(puntajes).sort((a, b) => b[1] - a[1]);
    const fortalezas = ordenadas.slice(0, 3).map(([tec]) => LABELS_TECNOLOGIA[tec] ?? tec);
    const areasMejora = ordenadas
      .slice(-3)
      .reverse()
      .map(([tec]) => LABELS_TECNOLOGIA[tec] ?? tec);

    const calificadasConExperiencia = Object.values(puntajes).filter((e) => e > 1).length;
    const confianza = Math.round((calificadasConExperiencia / TECNOLOGIAS_EVALUABLES.length) * 100);

    return {
      nivel_detectado: rango.nivel,
      promedio_general: promedioGeneral,
      promedio_por_categoria: promedioPorCategoria,
      tarifa_sugerida_cop: tarifaSugerida,
      fortalezas,
      areas_mejora: areasMejora,
      confianza,
    };
  }
}
