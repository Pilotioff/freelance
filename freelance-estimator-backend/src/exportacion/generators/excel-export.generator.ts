import { Injectable } from '@nestjs/common';
import ExcelJS from 'exceljs';
import { DatosExportacion, ExportGenerator } from './export-generator.interface';

const COLOR_DORADO = 'F5B700';
const COLOR_NEGRO = '0A0A0A';

function estiloEncabezado(worksheet: ExcelJS.Worksheet, fila: number, ultimaColumna: number): void {
  for (let col = 1; col <= ultimaColumna; col++) {
    const celda = worksheet.getRow(fila).getCell(col);
    celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${COLOR_NEGRO}` } };
    celda.font = { color: { argb: `FF${COLOR_DORADO}` }, bold: true };
    celda.border = {
      top: { style: 'thin' }, bottom: { style: 'thin' },
      left: { style: 'thin' }, right: { style: 'thin' },
    };
  }
  worksheet.getRow(fila).height = 22;
}

function autoajustarColumnas(worksheet: ExcelJS.Worksheet): void {
  worksheet.columns.forEach((columna) => {
    let maxLength = 10;
    columna.eachCell?.({ includeEmpty: true }, (celda) => {
      const valor = celda.value ? String(celda.value) : '';
      maxLength = Math.max(maxLength, valor.length + 2);
    });
    columna.width = Math.min(maxLength, 50);
  });
}

@Injectable()
export class ExcelExportGenerator implements ExportGenerator {
  readonly contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  readonly extension = 'xlsx';

  async generar(datos: DatosExportacion): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Freelance Estimator';
    workbook.created = new Date();

    // Hoja 1: Resumen general
    const hojaResumen = workbook.addWorksheet('Resumen general');
    hojaResumen.addRow(['Campo', 'Valor']);
    hojaResumen.addRows([
      ['Número de cotización', datos.numero_cotizacion],
      ['Fecha', datos.fecha],
      ['Freelancer', datos.freelancer_nombre],
      ['Email', datos.freelancer_email],
      ['Proyecto', datos.nombre_proyecto],
      ['Tipo de proyecto', datos.tipo_proyecto],
      ['Moneda', datos.moneda],
      ['Valor por hora', datos.valor_hora],
      ['Horas estimadas', datos.horas_estimadas],
      ['Tiempo de entrega', datos.tiempo_entrega],
      ['Complejidad', datos.complejidad],
      ['Costo total', datos.costo_total],
    ]);
    hojaResumen.getCell('B8').numFmt = `"${datos.moneda}" #,##0.00`;
    hojaResumen.getCell('B12').numFmt = `"${datos.moneda}" #,##0.00`;
    hojaResumen.getCell('B12').font = { bold: true };
    estiloEncabezado(hojaResumen, 1, 2);
    hojaResumen.views = [{ state: 'frozen', ySplit: 1 }];
    autoajustarColumnas(hojaResumen);

    // Hoja 2: Desglose de costos
    const hojaDesglose = workbook.addWorksheet('Desglose de costos');
    hojaDesglose.addRow(['Concepto', 'Costo']);
    hojaDesglose.addRows([
      ['Diseño', datos.desglose.diseno],
      ['Frontend', datos.desglose.frontend],
      ['Backend', datos.desglose.backend],
      ['Base de datos', datos.desglose.bd],
      ['Infraestructura', datos.desglose.infraestructura],
    ]);
    const filaSubtotal = hojaDesglose.rowCount + 1;
    hojaDesglose.addRow(['Subtotal', { formula: `SUM(B2:B${filaSubtotal - 1})` }]);
    hojaDesglose.addRow(['Margen aplicado', datos.margen_aplicado]);
    const filaTotal = hojaDesglose.rowCount + 1;
    hojaDesglose.addRow(['TOTAL', { formula: `B${filaSubtotal}*B${filaSubtotal + 1}` }]);
    for (let i = 2; i <= filaTotal; i++) {
      if (i !== filaSubtotal + 1) {
        hojaDesglose.getCell(`B${i}`).numFmt = `"${datos.moneda}" #,##0.00`;
      }
    }
    hojaDesglose.getCell(`B${filaTotal}`).font = { bold: true };
    hojaDesglose.getCell(`A${filaTotal}`).font = { bold: true };
    estiloEncabezado(hojaDesglose, 1, 2);
    hojaDesglose.views = [{ state: 'frozen', ySplit: 1 }];
    autoajustarColumnas(hojaDesglose);

    // Hoja 3: Tecnologías
    const hojaTech = workbook.addWorksheet('Tecnologías seleccionadas');
    hojaTech.addRow(['#', 'Tecnología']);
    if (datos.tecnologias.length > 0) {
      datos.tecnologias.forEach((tech, i) => hojaTech.addRow([i + 1, tech]));
    } else {
      hojaTech.addRow(['-', 'No especificadas']);
    }
    estiloEncabezado(hojaTech, 1, 2);
    hojaTech.views = [{ state: 'frozen', ySplit: 1 }];
    autoajustarColumnas(hojaTech);

    // Hoja 4: Infraestructura
    const hojaInfra = workbook.addWorksheet('Infraestructura');
    hojaInfra.addRow(['Campo', 'Valor']);
    hojaInfra.addRows([
      ['Hosting', datos.hosting],
      ['Tiempo de entrega', datos.tiempo_entrega],
      ['Costo de infraestructura', datos.desglose.infraestructura],
    ]);
    hojaInfra.getCell('B4').numFmt = `"${datos.moneda}" #,##0.00`;
    estiloEncabezado(hojaInfra, 1, 2);
    hojaInfra.views = [{ state: 'frozen', ySplit: 1 }];
    autoajustarColumnas(hojaInfra);

    // Hoja 5: Historial de cálculos (trazabilidad de cómo se llegó al total)
    const hojaHistorial = workbook.addWorksheet('Historial de cálculos');
    hojaHistorial.addRow(['Paso', 'Descripción', 'Resultado']);
    hojaHistorial.addRows([
      [1, 'Horas estimadas del proyecto', datos.horas_estimadas],
      [2, 'Valor por hora del freelancer', datos.valor_hora],
      [3, 'Costo de desarrollo (horas × valor hora)', datos.horas_estimadas * datos.valor_hora],
      [4, 'Costo de infraestructura', datos.desglose.infraestructura],
      [5, 'Subtotal antes de margen', datos.horas_estimadas * datos.valor_hora + datos.desglose.infraestructura],
      [6, 'Margen aplicado según perfil de cliente', datos.margen_aplicado],
      [7, 'COSTO TOTAL FINAL', datos.costo_total],
    ]);
    hojaHistorial.getCell('C3').numFmt = `"${datos.moneda}" #,##0.00`;
    hojaHistorial.getCell('C4').numFmt = `"${datos.moneda}" #,##0.00`;
    hojaHistorial.getCell('C5').numFmt = `"${datos.moneda}" #,##0.00`;
    hojaHistorial.getCell('C6').numFmt = `"${datos.moneda}" #,##0.00`;
    hojaHistorial.getCell('C8').numFmt = `"${datos.moneda}" #,##0.00`;
    hojaHistorial.getCell('C8').font = { bold: true };
    estiloEncabezado(hojaHistorial, 1, 3);
    hojaHistorial.views = [{ state: 'frozen', ySplit: 1 }];
    autoajustarColumnas(hojaHistorial);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
