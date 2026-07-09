import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PerfilProfesional } from './perfil-profesional.service';

const COLOR_DORADO = '#F5B700';
const COLOR_NEGRO = '#0A0A0A';
const COLOR_GRIS = '#4B5563';

function formatoMoneda(valor: number): string {
  return `COP ${valor.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
}

@Injectable()
export class PdfPerfilGenerator {
  async generar(perfil: PerfilProfesional): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.rect(0, 0, doc.page.width, 150).fill(COLOR_NEGRO);
      doc.fillColor(COLOR_DORADO).fontSize(24).font('Helvetica-Bold').text('PERFIL PROFESIONAL', 50, 60);
      doc.fillColor('#FFFFFF').fontSize(16).font('Helvetica').text(perfil.nombre, 50, 95);

      doc.moveDown(5);
      if (perfil.nivel_detectado) {
        doc.fillColor(COLOR_NEGRO).fontSize(12).font('Helvetica-Bold').text(`Nivel: ${perfil.nivel_detectado}`);
      }
      if (perfil.especialidad) {
        doc.fillColor(COLOR_GRIS).fontSize(11).font('Helvetica').text(`Especialidad: ${perfil.especialidad}`);
      }
      doc.moveDown(0.5);
      if (perfil.valor_hora_recomendado) {
        doc.fillColor(COLOR_GRIS).text(`Valor por hora recomendado: ${formatoMoneda(perfil.valor_hora_recomendado)}`);
      }
      if (perfil.valor_hora_personalizado) {
        doc.text(`Valor por hora personalizado: ${formatoMoneda(perfil.valor_hora_personalizado)}`);
      }
      if (perfil.fecha_ultima_evaluacion) {
        doc.text(`Última evaluación: ${new Date(perfil.fecha_ultima_evaluacion).toLocaleDateString('es-CO')}`);
      }
      doc.moveDown(1);

      const categorias = Object.values(perfil.promedio_por_categoria);
      if (categorias.length > 0) {
        doc.fillColor(COLOR_NEGRO).fontSize(13).font('Helvetica-Bold').text('Resumen de habilidades');
        doc.moveDown(0.3);
        doc.fontSize(10).font('Helvetica');
        for (const cat of categorias) {
          doc.fillColor(COLOR_GRIS).text(cat.label, 50, doc.y, { continued: true, width: 300 });
          doc.fillColor(COLOR_NEGRO).text(`${cat.valor.toFixed(1)} / 5`, { align: 'right' });
        }
        doc.moveDown(1);
      }

      if (perfil.tecnologias_evaluadas.length > 0) {
        doc.fillColor(COLOR_NEGRO).fontSize(13).font('Helvetica-Bold').text('Tecnologías evaluadas');
        doc.moveDown(0.3);
        doc.fontSize(9).font('Helvetica');
        for (const t of perfil.tecnologias_evaluadas) {
          doc.fillColor(COLOR_GRIS).text(t.label, 50, doc.y, { continued: true, width: 300 });
          doc.fillColor(COLOR_NEGRO).text(`${t.estrellas} / 5`, { align: 'right' });
        }
        doc.moveDown(1);
      }

      if (perfil.recomendaciones.length > 0) {
        doc.fillColor(COLOR_NEGRO).fontSize(13).font('Helvetica-Bold').text('Recomendaciones');
        doc.moveDown(0.3);
        doc.fontSize(10).font('Helvetica').fillColor(COLOR_GRIS);
        for (const r of perfil.recomendaciones) {
          doc.text(`• ${r}`);
        }
        doc.moveDown(1);
      }

      doc.fillColor(COLOR_NEGRO).fontSize(13).font('Helvetica-Bold').text('Estadísticas');
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').fillColor(COLOR_GRIS);
      doc.text(`Cotizaciones realizadas: ${perfil.estadisticas.cotizaciones_realizadas}`);
      doc.text(`Valor promedio: ${formatoMoneda(perfil.estadisticas.valor_promedio)}`);
      doc.text(`Clientes: ${perfil.estadisticas.cantidad_clientes}`);
      if (perfil.estadisticas.proyecto_mas_costoso) {
        doc.text(
          `Proyecto más costoso: ${perfil.estadisticas.proyecto_mas_costoso.nombre_proyecto} (${formatoMoneda(perfil.estadisticas.proyecto_mas_costoso.precio_final)})`,
        );
      }

      const rango = doc.bufferedPageRange();
      for (let i = 0; i < rango.count; i++) {
        doc.switchToPage(i);
        doc
          .fontSize(8)
          .fillColor(COLOR_GRIS)
          .text(`Freelance Estimator · Página ${i + 1} de ${rango.count}`, 50, doc.page.height - 40, {
            align: 'center',
            width: doc.page.width - 100,
          });
      }

      doc.end();
    });
  }
}
