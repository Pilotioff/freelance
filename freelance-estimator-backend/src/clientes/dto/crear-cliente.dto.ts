import { IsString, IsNotEmpty, IsOptional, IsEmail, IsIn, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const TIPOS_CLIENTE = [
  'estudiante', 'freelancer', 'emprendedor', 'startup',
  'empresa_pequena', 'empresa_mediana', 'empresa_grande', 'gobierno', 'ong',
] as const;

export class CrearClienteDto {
  @ApiProperty({ example: 'Ana' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @ApiProperty({ example: 'García' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  apellido!: string;

  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsOptional()
  @IsString()
  empresa?: string;

  @ApiPropertyOptional({ example: 'ana@acme.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Correo inválido' })
  correo?: string;

  @ApiPropertyOptional({ example: '+57 300 1234567' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ example: 'Bogotá' })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiPropertyOptional({ example: 'Colombia' })
  @IsOptional()
  @IsString()
  pais?: string;

  @ApiPropertyOptional({ example: 'https://acme.com' })
  @IsOptional()
  @IsUrl({}, { message: 'Sitio web inválido' })
  sitio_web?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/ana' })
  @IsOptional()
  @IsUrl({}, { message: 'LinkedIn inválido' })
  linkedin?: string;

  @ApiProperty({ example: 'startup', enum: TIPOS_CLIENTE })
  @IsIn([...TIPOS_CLIENTE], { message: 'Selecciona un tipo de cliente válido' })
  tipo_cliente!: string;

  @ApiPropertyOptional({ example: 'Cliente referido por LinkedIn' })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
