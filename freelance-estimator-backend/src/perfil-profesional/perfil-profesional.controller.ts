import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PerfilProfesionalService } from './perfil-profesional.service';
import { ActualizarTarifaDto } from './dto/actualizar-tarifa.dto';
import { JwtAuthGuard, AuthenticatedRequest } from '../common/guards/jwt-auth.guard';

@ApiTags('PerfilProfesional')
@Controller('perfil-profesional')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('token')
export class PerfilProfesionalController {
  constructor(private readonly service: PerfilProfesionalService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el perfil profesional completo del freelancer' })
  @ApiResponse({ status: 200, description: 'Perfil profesional' })
  async obtener(
    @Req() req: AuthenticatedRequest,
  ): Promise<Awaited<ReturnType<PerfilProfesionalService['obtenerPerfil']>>> {
    return this.service.obtenerPerfil(req.user.sub);
  }

  @Patch('tarifa')
  @ApiOperation({ summary: 'Actualizar valor por hora manual y/o preferencia de tarifa' })
  @ApiResponse({ status: 200, description: 'Tarifa actualizada' })
  async actualizarTarifa(
    @Req() req: AuthenticatedRequest,
    @Body() dto: ActualizarTarifaDto,
  ): Promise<Awaited<ReturnType<PerfilProfesionalService['actualizarTarifa']>>> {
    return this.service.actualizarTarifa(req.user.sub, dto);
  }
}
