import { Controller, Get, Param, Query, Req, Res, UseGuards, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ApiCookieAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ExportacionService, FormatoExportacion } from './exportacion.service';
import { JwtAuthGuard, AuthenticatedRequest } from '../common/guards/jwt-auth.guard';

const FORMATOS_VALIDOS: FormatoExportacion[] = ['pdf', 'word', 'excel'];

@ApiTags('Exportacion')
@Controller('exportacion')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('token')
export class ExportacionController {
  constructor(private readonly exportacionService: ExportacionService) {}

  @Get(':cotizacionId')
  @ApiOperation({ summary: 'Exportar una cotización a PDF, Word o Excel' })
  @ApiQuery({ name: 'formato', enum: FORMATOS_VALIDOS })
  async exportar(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
    @Param('cotizacionId') cotizacionId: string,
    @Query('formato') formato: string,
  ): Promise<void> {
    if (!FORMATOS_VALIDOS.includes(formato as FormatoExportacion)) {
      throw new BadRequestException('Formato inválido. Usa: pdf, word o excel');
    }

    const archivo = await this.exportacionService.exportar(
      req.user.sub,
      cotizacionId,
      formato as FormatoExportacion,
    );

    res.set({
      'Content-Type': archivo.contentType,
      'Content-Disposition': `attachment; filename="${archivo.nombreArchivo}"`,
      'Content-Length': archivo.buffer.length,
    });
    res.send(archivo.buffer);
  }
}
