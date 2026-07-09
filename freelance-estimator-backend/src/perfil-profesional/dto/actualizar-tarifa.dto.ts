import { IsOptional, IsNumber, Min, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const TARIFAS_PREFERIDAS = ['manual', 'sugerida'] as const;

export class ActualizarTarifaDto {
  @ApiPropertyOptional({ example: 90000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tarifa_hora_cop?: number;

  @ApiPropertyOptional({ example: 'sugerida', enum: TARIFAS_PREFERIDAS })
  @IsOptional()
  @IsIn([...TARIFAS_PREFERIDAS])
  tarifa_preferida?: string;
}
