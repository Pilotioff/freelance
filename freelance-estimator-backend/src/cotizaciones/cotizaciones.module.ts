import { Module } from '@nestjs/common';
import { CotizacionesController } from './cotizaciones.controller';
import { CotizacionesService } from './cotizaciones.service';
import { AuthModule } from '../auth/auth.module';
import { DivisasModule } from '../divisas/divisas.module';

@Module({
  imports: [AuthModule, DivisasModule],
  controllers: [CotizacionesController],
  providers: [CotizacionesService],
  exports: [CotizacionesService],
})
export class CotizacionesModule {}
