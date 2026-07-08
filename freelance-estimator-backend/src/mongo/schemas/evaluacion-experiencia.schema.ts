import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EvaluacionExperienciaDocument = EvaluacionExperiencia & Document;

@Schema({ collection: 'evaluaciones_experiencia', timestamps: { createdAt: 'creado_en', updatedAt: false } })
export class EvaluacionExperiencia {
  @Prop({ required: true })
  usuario_id!: string;

  @Prop({ type: Object, required: true })
  puntajes!: Record<string, number>;

  @Prop({ type: Object, required: true })
  promedio_por_categoria!: Record<string, number>;

  @Prop({ required: true })
  promedio_general!: number;

  @Prop({ required: true })
  nivel_detectado!: string;

  @Prop({ required: true })
  tarifa_sugerida_cop!: number;

  @Prop({ type: [String], default: [] })
  fortalezas!: string[];

  @Prop({ type: [String], default: [] })
  areas_mejora!: string[];

  @Prop({ required: true })
  confianza!: number;
}

export const EvaluacionExperienciaSchema = SchemaFactory.createForClass(EvaluacionExperiencia);
