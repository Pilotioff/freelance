import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarketComparisonService } from './market-comparison.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('MarketComparison')
@Controller('market-comparison')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('token')
export class MarketComparisonController {
  constructor(private readonly service: MarketComparisonService) {}

  @Get(':tipoProyecto')
  @ApiOperation({ summary: 'Obtener el promedio de mercado para un tipo de proyecto' })
  @ApiResponse({ status: 200, description: 'Promedio de mercado' })
  async obtener(
    @Param('tipoProyecto') tipoProyecto: string,
  ): Promise<Awaited<ReturnType<MarketComparisonService['obtenerPromedio']>>> {
    return this.service.obtenerPromedio(tipoProyecto);
  }
}
