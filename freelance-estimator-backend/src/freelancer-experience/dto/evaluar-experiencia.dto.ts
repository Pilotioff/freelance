import { IsArray, ValidateNested, IsIn, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TECNOLOGIAS_EVALUABLES } from '../tecnologias';

export class PuntajeTecnologiaDto {
  @ApiProperty({ example: 'react', enum: TECNOLOGIAS_EVALUABLES })
  @IsIn(TECNOLOGIAS_EVALUABLES, { message: 'Tecnología no reconocida' })
  tecnologia!: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  @Max(5)
  estrellas!: number;
}

export class EvaluarExperienciaDto {
  @ApiProperty({ type: [PuntajeTecnologiaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PuntajeTecnologiaDto)
  puntajes!: PuntajeTecnologiaDto[];
}
