import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearClienteDto } from './dto/crear-cliente.dto';
import { ActualizarClienteDto } from './dto/actualizar-cliente.dto';
import { ListarClientesDto } from './dto/listar-clientes.dto';
import { Cliente, Prisma } from '@prisma/client';

export interface ClienteConMetricas extends Cliente {
  cantidad_cotizaciones: number;
  valor_total_cotizado: number;
  ultima_cotizacion: Date | null;
}

export interface ListadoClientes {
  clientes: ClienteConMetricas[];
  total: number;
  pagina: number;
  porPagina: number;
}

export interface DetalleCliente extends ClienteConMetricas {
  promedio_por_proyecto: number;
  tecnologias_mas_usadas: { tecnologia: string; cantidad: number }[];
  cotizaciones: Prisma.CotizacionGetPayload<{ include: { tecnologias: true } }>[];
}

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(usuarioId: string, dto: CrearClienteDto): Promise<Cliente> {
    return this.prisma.cliente.create({
      data: {
        usuario_id: usuarioId,
        nombre: dto.nombre,
        apellido: dto.apellido,
        empresa: dto.empresa,
        correo: dto.correo,
        telefono: dto.telefono,
        ciudad: dto.ciudad,
        pais: dto.pais,
        sitio_web: dto.sitio_web,
        linkedin: dto.linkedin,
        tipo_cliente: dto.tipo_cliente,
        observaciones: dto.observaciones,
        activo: dto.activo ?? true,
      },
    });
  }

  async listar(usuarioId: string, query: ListarClientesDto): Promise<ListadoClientes> {
    const where: Prisma.ClienteWhereInput = { usuario_id: usuarioId };

    if (query.busqueda) {
      where.OR = [
        { nombre: { contains: query.busqueda, mode: 'insensitive' } },
        { apellido: { contains: query.busqueda, mode: 'insensitive' } },
        { empresa: { contains: query.busqueda, mode: 'insensitive' } },
        { correo: { contains: query.busqueda, mode: 'insensitive' } },
      ];
    }
    if (query.tipo_cliente) {
      where.tipo_cliente = query.tipo_cliente;
    }
    if (query.activo !== undefined) {
      where.activo = query.activo === 'true';
    }

    const clientes = await this.prisma.cliente.findMany({ where });
    const conMetricas = await Promise.all(clientes.map((c) => this.adjuntarMetricas(c)));

    const ordenarPor = query.ordenarPor ?? 'creado_en';
    const orden = query.orden ?? 'desc';
    conMetricas.sort((a, b) => {
      let valorA: number | string;
      let valorB: number | string;
      switch (ordenarPor) {
        case 'valor_total_cotizado':
          valorA = a.valor_total_cotizado;
          valorB = b.valor_total_cotizado;
          break;
        case 'ultima_cotizacion':
          valorA = a.ultima_cotizacion?.getTime() ?? 0;
          valorB = b.ultima_cotizacion?.getTime() ?? 0;
          break;
        case 'nombre':
          valorA = a.nombre.toLowerCase();
          valorB = b.nombre.toLowerCase();
          break;
        default:
          valorA = a.creado_en.getTime();
          valorB = b.creado_en.getTime();
      }
      if (valorA < valorB) return orden === 'asc' ? -1 : 1;
      if (valorA > valorB) return orden === 'asc' ? 1 : -1;
      return 0;
    });

    const pagina = query.pagina ?? 1;
    const porPagina = query.porPagina ?? 10;
    const inicio = (pagina - 1) * porPagina;
    const paginados = conMetricas.slice(inicio, inicio + porPagina);

    return { clientes: paginados, total: conMetricas.length, pagina, porPagina };
  }

  async obtenerPorId(usuarioId: string, clienteId: string): Promise<DetalleCliente> {
    const cliente = await this.prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente || cliente.usuario_id !== usuarioId) {
      throw new NotFoundException('Cliente no encontrado');
    }

    const conMetricas = await this.adjuntarMetricas(cliente);

    const cotizaciones = await this.prisma.cotizacion.findMany({
      where: { cliente_id: clienteId },
      include: { tecnologias: true },
      orderBy: { creado_en: 'desc' },
    });

    const conteoTecnologias = new Map<string, number>();
    for (const cot of cotizaciones) {
      for (const t of cot.tecnologias) {
        conteoTecnologias.set(t.tecnologia, (conteoTecnologias.get(t.tecnologia) ?? 0) + 1);
      }
    }
    const tecnologiasMasUsadas = [...conteoTecnologias.entries()]
      .map(([tecnologia, cantidad]) => ({ tecnologia, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    const promedioPorProyecto =
      conMetricas.cantidad_cotizaciones > 0
        ? conMetricas.valor_total_cotizado / conMetricas.cantidad_cotizaciones
        : 0;

    return {
      ...conMetricas,
      promedio_por_proyecto: promedioPorProyecto,
      tecnologias_mas_usadas: tecnologiasMasUsadas,
      cotizaciones,
    };
  }

  async actualizar(
    usuarioId: string,
    clienteId: string,
    dto: ActualizarClienteDto,
  ): Promise<Cliente> {
    const cliente = await this.prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente || cliente.usuario_id !== usuarioId) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return this.prisma.cliente.update({
      where: { id: clienteId },
      data: dto,
    });
  }

  async obtenerTipoCliente(usuarioId: string, clienteId: string): Promise<string | null> {
    const cliente = await this.prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente || cliente.usuario_id !== usuarioId) {
      return null;
    }
    return cliente.tipo_cliente;
  }

  private async adjuntarMetricas(cliente: Cliente): Promise<ClienteConMetricas> {
    const agregado = await this.prisma.cotizacion.aggregate({
      where: { cliente_id: cliente.id },
      _count: { id: true },
      _sum: { precio_final: true },
      _max: { creado_en: true },
    });

    return {
      ...cliente,
      cantidad_cotizaciones: agregado._count.id,
      valor_total_cotizado: agregado._sum.precio_final ?? 0,
      ultima_cotizacion: agregado._max.creado_en,
    };
  }
}
