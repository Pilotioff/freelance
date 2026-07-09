import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiQuery } from '@nestjs/swagger';
import { CotizacionesService } from './cotizaciones.service';
import { CrearCotizacionDto } from './dto/crear-cotizacion.dto';
import { EstimarCotizacionDto } from './dto/estimar-cotizacion.dto';
import { JwtAuthGuard, AuthenticatedRequest } from '../common/guards/jwt-auth.guard';

@ApiTags('Cotizaciones')
@Controller('cotizaciones')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('token')
export class CotizacionesController {
  constructor(private readonly cotizacionesService: CotizacionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear cotización' })
  @ApiResponse({ status: 201, description: 'Cotización creada' })
  async crear(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CrearCotizacionDto,
  ): Promise<Awaited<ReturnType<CotizacionesService['crear']>>> {
    return this.cotizacionesService.crear(req.user.sub, dto);
  }

  @Post('estimar')
  @ApiOperation({ summary: 'Calcular una estimación en vivo sin guardar la cotización' })
  @ApiResponse({ status: 200, description: 'Cálculo estimado' })
  async estimar(
    @Req() req: AuthenticatedRequest,
    @Body() dto: EstimarCotizacionDto,
  ): Promise<Awaited<ReturnType<CotizacionesService['estimar']>>> {
    return this.cotizacionesService.estimar(req.user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cotizaciones del usuario' })
  @ApiQuery({ name: 'complejidad', required: false })
  @ApiQuery({ name: 'desde', required: false })
  @ApiQuery({ name: 'hasta', required: false })
  @ApiResponse({ status: 200, description: 'Lista de cotizaciones' })
  async listar(
    @Req() req: AuthenticatedRequest,
    @Query('complejidad') complejidad?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string,
  ): Promise<Awaited<ReturnType<CotizacionesService['listar']>>> {
    return this.cotizacionesService.listar(req.user.sub, { complejidad, desde, hasta });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una cotización' })
  @ApiResponse({ status: 200, description: 'Cotización eliminada' })
  @ApiResponse({ status: 404, description: 'Cotización no encontrada' })
  async eliminar(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<Awaited<ReturnType<CotizacionesService['eliminar']>>> {
    return this.cotizacionesService.eliminar(req.user.sub, id);
  }
}
