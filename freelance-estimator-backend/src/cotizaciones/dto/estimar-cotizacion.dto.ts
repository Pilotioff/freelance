import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

const TIPOS_PROYECTO = [
  'landing', 'ecommerce', 'webapp', 'mobile', 'api', 'dashboard',
  'crm', 'erp', 'marketplace', 'saas', 'sistema_interno', 'blog',
  'portafolio', 'chat', 'automatizacion', 'pos', 'lms', 'ia',
  'microservicios', 'sistema_administrativo',
] as const;
const NIVELES_DISENIO = ['basico', 'intermedio', 'premium', 'animado'] as const;
const TIEMPOS_ENTREGA = ['1semana', '2semanas', '1mes', 'mas1mes'] as const;
const HOSTING_OPTIONS = ['ninguno', 'basico', 'vps', 'cloud'] as const;
const PERFILES_CLIENTE = [
  'estudiante', 'freelancer', 'emprendedor', 'startup',
  'empresa_pequena', 'empresa_mediana', 'empresa_grande', 'gobierno', 'ong',
] as const;

export class EstimarCotizacionDto {
  @ApiProperty({ example: 'webapp', enum: TIPOS_PROYECTO })
  @IsIn([...TIPOS_PROYECTO], { message: 'Selecciona un tipo de proyecto válido' })
  tipo_proyecto!: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  cantidad_paginas!: number;

  @ApiProperty({ example: 'intermedio', enum: NIVELES_DISENIO })
  @IsIn([...NIVELES_DISENIO])
  nivel_disenio!: string;

  @ApiPropertyOptional({ example: ['React', 'Node.js'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tecnologias?: string[];

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Max(10)
  @Type(() => Number)
  cantidad_desarrolladores!: number;

  @ApiProperty({ example: '1mes', enum: TIEMPOS_ENTREGA })
  @IsIn([...TIEMPOS_ENTREGA], { message: 'Selecciona un tiempo de entrega válido' })
  tiempo_entrega!: string;

  @ApiProperty({ example: 'vps', enum: HOSTING_OPTIONS })
  @IsIn([...HOSTING_OPTIONS], { message: 'Selecciona una opción de hosting válida' })
  hosting!: string;

  @ApiProperty({ example: 'startup', enum: PERFILES_CLIENTE })
  @IsIn([...PERFILES_CLIENTE], { message: 'Selecciona un perfil de cliente válido' })
  perfil_cliente!: string;
}
