import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { DatosExportacion, ExportGenerator } from './export-generator.interface';

const COLOR_DORADO = '#F5B700';
const COLOR_NEGRO = '#0A0A0A';
const COLOR_GRIS = '#4B5563';

function formatoMoneda(valor: number, moneda: string): string {
  return `${moneda} ${valor.toLocaleString('es-CO', { maximumFractionDigits: 2 })}`;
}

@Injectable()
export class PdfExportGenerator implements ExportGenerator {
  readonly contentType = 'application/pdf';
  readonly extension = 'pdf';

  async generar(datos: DatosExportacion): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Portada
      doc.rect(0, 0, doc.page.width, 200).fill(COLOR_NEGRO);
      doc
        .fillColor(COLOR_DORADO)
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('FREELANCE ESTIMATOR', 50, 80);
      doc
        .fillColor('#FFFFFF')
        .fontSize(14)
        .font('Helvetica')
        .text('Cotización de Proyecto', 50, 120);

      doc.moveDown(4);
      doc.fillColor(COLOR_NEGRO).fontSize(20).font('Helvetica-Bold').text(datos.nombre_proyecto);
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fillColor(COLOR_GRIS);
      doc.text(`Número de cotización: ${datos.numero_cotizacion}`);
      doc.text(`Fecha: ${datos.fecha}`);
      doc.moveDown(1);

      // Información del freelancer
      doc.fillColor(COLOR_NEGRO).fontSize(13).font('Helvetica-Bold').text('Información del freelancer');
      doc.fontSize(10).font('Helvetica').fillColor(COLOR_GRIS);
      doc.text(`Nombre: ${datos.freelancer_nombre}`);
      doc.text(`Email: ${datos.freelancer_email}`);
      doc.moveDown(1);

      // Resumen ejecutivo
      doc.fillColor(COLOR_NEGRO).fontSize(13).font('Helvetica-Bold').text('Resumen ejecutivo');
      doc.fontSize(10).font('Helvetica').fillColor(COLOR_GRIS);
      doc.text(`Tipo de proyecto: ${datos.tipo_proyecto}`);
      doc.text(`Hosting: ${datos.hosting}`);
      doc.text(`Tiempo estimado de entrega: ${datos.tiempo_entrega}`);
      doc.text(`Complejidad: ${datos.complejidad}`);
      doc.text(`Horas estimadas: ${datos.horas_estimadas}`);
      doc.text(`Valor por hora: ${formatoMoneda(datos.valor_hora, datos.moneda)}`);
      doc.moveDown(1);

      // Tecnologías
      doc.fillColor(COLOR_NEGRO).fontSize(13).font('Helvetica-Bold').text('Tecnologías');
      doc.fontSize(10).font('Helvetica').fillColor(COLOR_GRIS);
      doc.text(datos.tecnologias.length > 0 ? datos.tecnologias.join(', ') : 'No especificadas');
      doc.moveDown(1);

      // Desglose completo
      doc.fillColor(COLOR_NEGRO).fontSize(13).font('Helvetica-Bold').text('Desglose completo del costo');
      doc.moveDown(0.3);
      const filas: [string, number][] = [
        ['Diseño', datos.desglose.diseno],
        ['Frontend', datos.desglose.frontend],
        ['Backend', datos.desglose.backend],
        ['Base de datos', datos.desglose.bd],
        ['Infraestructura', datos.desglose.infraestructura],
      ];
      doc.fontSize(10).font('Helvetica');
      for (const [label, valor] of filas) {
        doc.fillColor(COLOR_GRIS).text(label, 50, doc.y, { continued: true, width: 300 });
        doc.fillColor(COLOR_NEGRO).text(formatoMoneda(valor, datos.moneda), { align: 'right' });
      }
      doc.moveDown(0.3);
      doc.fillColor(COLOR_GRIS).font('Helvetica').text(`Margen aplicado`, 50, doc.y, { continued: true, width: 300 });
      doc.fillColor(COLOR_NEGRO).text(`×${datos.margen_aplicado.toFixed(2)}`, { align: 'right' });
      doc.moveDown(0.5);

      // Costo final
      doc.rect(50, doc.y, doc.page.width - 100, 40).fill(COLOR_DORADO);
      doc
        .fillColor(COLOR_NEGRO)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('COSTO TOTAL', 60, doc.y - 30, { continued: true, width: 300 });
      doc.text(formatoMoneda(datos.costo_total, datos.moneda), { align: 'right' });
      doc.moveDown(2);

      if (datos.observaciones) {
        doc.fillColor(COLOR_NEGRO).fontSize(13).font('Helvetica-Bold').text('Observaciones');
        doc.fontSize(10).font('Helvetica').fillColor(COLOR_GRIS).text(datos.observaciones);
      }

      // Pie de página con numeración en todas las páginas
      const rango = doc.bufferedPageRange();
      for (let i = 0; i < rango.count; i++) {
        doc.switchToPage(i);
        doc
          .fontSize(8)
          .fillColor(COLOR_GRIS)
          .text(
            `Freelance Estimator · Página ${i + 1} de ${rango.count}`,
            50,
            doc.page.height - 40,
            { align: 'center', width: doc.page.width - 100 },
          );
      }

      doc.end();
    });
  }
}
