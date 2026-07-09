import { IsOptional, IsString, IsIn, IsInt, Min, IsBooleanString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

const CAMPOS_ORDEN = ['nombre', 'creado_en', 'ultima_cotizacion', 'valor_total_cotizado'] as const;

export class ListarClientesDto {
  @ApiPropertyOptional({ example: 'ana' })
  @IsOptional()
  @IsString()
  busqueda?: string;

  @ApiPropertyOptional({ example: 'startup' })
  @IsOptional()
  @IsString()
  tipo_cliente?: string;

  @ApiPropertyOptional({ example: 'true' })
  @IsOptional()
  @IsBooleanString()
  activo?: string;

  @ApiPropertyOptional({ example: 'nombre', enum: CAMPOS_ORDEN })
  @IsOptional()
  @IsIn([...CAMPOS_ORDEN])
  ordenarPor?: string;

  @ApiPropertyOptional({ example: 'asc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  orden?: 'asc' | 'desc';

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  porPagina?: number;
}
