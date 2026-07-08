import { Module } from '@nestjs/common';
import { ExportacionController } from './exportacion.controller';
import { ExportacionService } from './exportacion.service';
import { PdfExportGenerator } from './generators/pdf-export.generator';
import { WordExportGenerator } from './generators/word-export.generator';
import { ExcelExportGenerator } from './generators/excel-export.generator';
import { CotizacionesModule } from '../cotizaciones/cotizaciones.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CotizacionesModule, AuthModule],
  controllers: [ExportacionController],
  providers: [ExportacionService, PdfExportGenerator, WordExportGenerator, ExcelExportGenerator],
})
export class ExportacionModule {}
