import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CrearClienteDto } from './dto/crear-cliente.dto';
import { ActualizarClienteDto } from './dto/actualizar-cliente.dto';
import { ListarClientesDto } from './dto/listar-clientes.dto';
import { JwtAuthGuard, AuthenticatedRequest } from '../common/guards/jwt-auth.guard';

@ApiTags('Clientes')
@Controller('clientes')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('token')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado' })
  async crear(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CrearClienteDto,
  ): Promise<Awaited<ReturnType<ClientesService['crear']>>> {
    return this.clientesService.crear(req.user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes con busqueda, filtros, orden y paginacion' })
  @ApiResponse({ status: 200, description: 'Listado de clientes' })
  async listar(
    @Req() req: AuthenticatedRequest,
    @Query() query: ListarClientesDto,
  ): Promise<Awaited<ReturnType<ClientesService['listar']>>> {
    return this.clientesService.listar(req.user.sub, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el perfil completo de un cliente' })
  @ApiResponse({ status: 200, description: 'Detalle del cliente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async obtenerPorId(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<Awaited<ReturnType<ClientesService['obtenerPorId']>>> {
    return this.clientesService.obtenerPorId(req.user.sub, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado' })
  async actualizar(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: ActualizarClienteDto,
  ): Promise<Awaited<ReturnType<ClientesService['actualizar']>>> {
    return this.clientesService.actualizar(req.user.sub, id, dto);
  }
}
