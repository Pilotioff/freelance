import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

export enum RolUsuario {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Schema({ collection: 'usuarios', timestamps: { createdAt: 'creado_en', updatedAt: 'actualizado_en' } })
export class Usuario {
  @Prop({ required: true })
  nombre!: string;

  @Prop({ required: true })
  apellido!: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: String, enum: RolUsuario, default: RolUsuario.USER })
  rol!: RolUsuario;

  @Prop({ default: true })
  activo!: boolean;

  @Prop()
  empresa?: string;

  @Prop()
  telefono?: string;

  @Prop()
  tarifa_hora_cop?: number;

  @Prop()
  avatar_url?: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
