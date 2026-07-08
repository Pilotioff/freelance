import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FreelancerExperienceService } from './freelancer-experience.service';
import { EvaluarExperienciaDto } from './dto/evaluar-experiencia.dto';
import { JwtAuthGuard, AuthenticatedRequest } from '../common/guards/jwt-auth.guard';

@ApiTags('FreelancerExperience')
@Controller('freelancer-experience')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('token')
export class FreelancerExperienceController {
  constructor(private readonly service: FreelancerExperienceService) {}

  @Post('evaluar')
  @ApiOperation({ summary: 'Enviar evaluación de experiencia técnica y calcular nivel' })
  @ApiResponse({ status: 201, description: 'Evaluación calculada y guardada' })
  async evaluar(
    @Req() req: AuthenticatedRequest,
    @Body() dto: EvaluarExperienciaDto,
  ): Promise<Awaited<ReturnType<FreelancerExperienceService['evaluar']>>> {
    return this.service.evaluar(req.user.sub, dto);
  }

  @Get('mi-evaluacion')
  @ApiOperation({ summary: 'Obtener la última evaluación de experiencia del usuario' })
  @ApiResponse({ status: 200, description: 'Evaluación encontrada' })
  @ApiResponse({ status: 404, description: 'Sin evaluación aún' })
  async miEvaluacion(
    @Req() req: AuthenticatedRequest,
  ): Promise<Awaited<ReturnType<FreelancerExperienceService['obtenerMiEvaluacion']>>> {
    return this.service.obtenerMiEvaluacion(req.user.sub);
  }
}
