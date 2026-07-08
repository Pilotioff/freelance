import { Injectable, NotFoundException } from '@nestjs/common';
import { CotizacionesService } from '../cotizaciones/cotizaciones.service';
import { AuthService } from '../auth/auth.service';
import { PdfExportGenerator } from './generators/pdf-export.generator';
import { WordExportGenerator } from './generators/word-export.generator';
import { ExcelExportGenerator } from './generators/excel-export.generator';
import { DatosExportacion, ExportGenerator } from './generators/export-generator.interface';

export type FormatoExportacion = 'pdf' | 'word' | 'excel';

export interface ArchivoGenerado {
  buffer: Buffer;
  contentType: string;
  nombreArchivo: string;
}

@Injectable()
export class ExportacionService {
  constructor(
    private readonly cotizacionesService: CotizacionesService,
    private readonly authService: AuthService,
    private readonly pdfGenerator: PdfExportGenerator,
    private readonly wordGenerator: WordExportGenerator,
    private readonly excelGenerator: ExcelExportGenerator,
  ) {}

  async exportar(
    usuarioId: string,
    cotizacionId: string,
    formato: FormatoExportacion,
  ): Promise<ArchivoGenerado> {
    const cotizacion = await this.cotizacionesService.obtenerPorId(usuarioId, cotizacionId);
    if (!cotizacion) {
      throw new NotFoundException('Cotización no encontrada');
    }

    const usuario = await this.authService.obtenerPorId(usuarioId);

    const datos: DatosExportacion = {
      numero_cotizacion: cotizacion.id,
      fecha: new Date(cotizacion.creado_en).toLocaleDateString('es-CO'),
      freelancer_nombre: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Freelancer',
      freelancer_email: usuario?.email ?? '',
      nombre_proyecto: cotizacion.nombre_proyecto,
      tipo_proyecto: cotizacion.tipo_proyecto,
      moneda: cotizacion.moneda_seleccionada,
      valor_hora:
        cotizacion.horas_estimadas > 0 && cotizacion.cantidad_desarrolladores > 0
          ? ((cotizacion.costo_diseno ?? 0) +
              (cotizacion.costo_frontend ?? 0) +
              (cotizacion.costo_backend ?? 0) +
              (cotizacion.costo_bd ?? 0)) /
            cotizacion.horas_estimadas /
            cotizacion.cantidad_desarrolladores
          : 0,
      horas_estimadas: cotizacion.horas_estimadas,
      tiempo_entrega: cotizacion.tiempo_entrega,
      tecnologias: cotizacion.tecnologias.map((t) => t.tecnologia),
      hosting: cotizacion.hosting,
      complejidad: cotizacion.complejidad,
      desglose: {
        diseno: cotizacion.costo_diseno ?? 0,
        frontend: cotizacion.costo_frontend ?? 0,
        backend: cotizacion.costo_backend ?? 0,
        bd: cotizacion.costo_bd ?? 0,
        infraestructura: cotizacion.costo_infraestructura,
      },
      margen_aplicado: cotizacion.margen_aplicado,
      costo_total:
        cotizacion.moneda_seleccionada !== 'COP' && cotizacion.precio_convertido != null
          ? cotizacion.precio_convertido
          : cotizacion.precio_final,
    };

    const generador = this.obtenerGenerador(formato);
    const buffer = await generador.generar(datos);
    const nombreArchivo = `cotizacion-${cotizacion.nombre_proyecto.replace(/\s+/g, '-').toLowerCase()}.${generador.extension}`;

    return { buffer, contentType: generador.contentType, nombreArchivo };
  }

  private obtenerGenerador(formato: FormatoExportacion): ExportGenerator {
    switch (formato) {
      case 'pdf':
        return this.pdfGenerator;
      case 'word':
        return this.wordGenerator;
      case 'excel':
        return this.excelGenerator;
    }
  }
}
