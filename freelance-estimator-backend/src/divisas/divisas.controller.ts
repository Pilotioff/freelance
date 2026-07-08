import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsNumber, IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DivisasService, Moneda, ResultadoConversion } from './divisas.service';

class ConvertirDto {
  @ApiProperty({ example: 1500000 })
  @IsNumber()
  valor!: number;

  @ApiProperty({ example: 'COP', enum: ['COP', 'USD', 'EUR', 'GBP', 'JPY'] })
  @IsIn(['COP', 'USD', 'EUR', 'GBP', 'JPY'])
  @IsNotEmpty()
  monedaOrigen!: Moneda;

  @ApiProperty({ example: 'USD', enum: ['COP', 'USD', 'EUR', 'GBP', 'JPY'] })
  @IsIn(['COP', 'USD', 'EUR', 'GBP', 'JPY'])
  @IsNotEmpty()
  monedaDestino!: Moneda;
}

@ApiTags('Divisas')
@Controller('divisas')
export class DivisasController {
  constructor(private readonly divisasService: DivisasService) {}

  @Get('tasas')
  @ApiOperation({ summary: 'Obtener tasas de cambio' })
  @ApiResponse({ status: 200, description: 'Tasas actuales' })
  tasas(): ReturnType<DivisasService['obtenerTasas']> {
    return this.divisasService.obtenerTasas();
  }

  @Post('convertir')
  @ApiOperation({ summary: 'Convertir entre divisas' })
  @ApiResponse({ status: 200, description: 'Resultado de conversión' })
  convertir(@Body() dto: ConvertirDto): ResultadoConversion {
    return this.divisasService.convertir(dto);
  }
}
