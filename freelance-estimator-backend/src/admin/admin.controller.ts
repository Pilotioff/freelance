import { Controller, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard, AuthenticatedRequest } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

class ActualizarPesoDto {
  @ApiProperty({ example: 1.5 })
  @IsNumber()
  valor!: number;
}

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiCookieAuth('token')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('pesos')
  @ApiOperation({ summary: 'Listar pesos del sistema agrupados por categoría' })
  @ApiResponse({ status: 200, description: 'Pesos del sistema' })
  async pesos(): Promise<Awaited<ReturnType<AdminService['obtenerPesos']>>> {
    return this.adminService.obtenerPesos();
  }

  @Patch('pesos/:clave')
  @ApiOperation({ summary: 'Actualizar peso del sistema' })
  @ApiResponse({ status: 200, description: 'Peso actualizado' })
  @ApiResponse({ status: 404, description: 'Peso no encontrado' })
  async actualizarPeso(
    @Param('clave') clave: string,
    @Body() dto: ActualizarPesoDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Awaited<ReturnType<AdminService['actualizarPeso']>>> {
    return this.adminService.actualizarPeso(clave, dto.valor, req.user.sub);
  }
}
