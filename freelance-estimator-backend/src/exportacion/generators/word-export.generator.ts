import { Injectable } from '@nestjs/common';
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';
import { DatosExportacion, ExportGenerator } from './export-generator.interface';

function formatoMoneda(valor: number, moneda: string): string {
  return `${moneda} ${valor.toLocaleString('es-CO', { maximumFractionDigits: 2 })}`;
}

function filaTabla(label: string, valor: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 40, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })],
      }),
      new TableCell({
        width: { size: 60, type: WidthType.PERCENTAGE },
        children: [new Paragraph(valor)],
      }),
    ],
  });
}

@Injectable()
export class WordExportGenerator implements ExportGenerator {
  readonly contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  readonly extension = 'docx';

  async generar(datos: DatosExportacion): Promise<Buffer> {
    const tablaResumen = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        filaTabla('Número de cotización', datos.numero_cotizacion),
        filaTabla('Fecha', datos.fecha),
        filaTabla('Freelancer', datos.freelancer_nombre),
        filaTabla('Email', datos.freelancer_email),
        filaTabla('Proyecto', datos.nombre_proyecto),
        filaTabla('Tipo de proyecto', datos.tipo_proyecto),
        filaTabla('Hosting', datos.hosting),
        filaTabla('Tiempo de entrega', datos.tiempo_entrega),
        filaTabla('Complejidad', datos.complejidad),
        filaTabla('Horas estimadas', String(datos.horas_estimadas)),
        filaTabla('Valor por hora', formatoMoneda(datos.valor_hora, datos.moneda)),
        filaTabla('Tecnologías', datos.tecnologias.join(', ') || 'No especificadas'),
      ],
    });

    const tablaDesglose = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        filaTabla('Diseño', formatoMoneda(datos.desglose.diseno, datos.moneda)),
        filaTabla('Frontend', formatoMoneda(datos.desglose.frontend, datos.moneda)),
        filaTabla('Backend', formatoMoneda(datos.desglose.backend, datos.moneda)),
        filaTabla('Base de datos', formatoMoneda(datos.desglose.bd, datos.moneda)),
        filaTabla('Infraestructura', formatoMoneda(datos.desglose.infraestructura, datos.moneda)),
        filaTabla('Margen aplicado', `×${datos.margen_aplicado.toFixed(2)}`),
        filaTabla('COSTO TOTAL', formatoMoneda(datos.costo_total, datos.moneda)),
      ],
    });

    const children: (Paragraph | Table)[] = [
      new Paragraph({
        text: 'FREELANCE ESTIMATOR',
        heading: HeadingLevel.TITLE,
      }),
      new Paragraph({
        text: 'Cotización de Proyecto',
        heading: HeadingLevel.HEADING_2,
      }),
      new Paragraph({ text: '' }),
      new Paragraph({ text: 'Resumen general', heading: HeadingLevel.HEADING_1 }),
      tablaResumen,
      new Paragraph({ text: '' }),
      new Paragraph({ text: 'Desglose de costos', heading: HeadingLevel.HEADING_1 }),
      tablaDesglose,
      new Paragraph({ text: '' }),
    ];

    if (datos.observaciones) {
      children.push(
        new Paragraph({ text: 'Observaciones', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: datos.observaciones }),
      );
    }

    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
        children: [
          new TextRun({ text: 'Freelance Estimator — Documento generado automáticamente', italics: true, size: 16 }),
        ],
      }),
    );

    const doc = new Document({
      sections: [{ children }],
    });

    return Packer.toBuffer(doc);
  }
}
