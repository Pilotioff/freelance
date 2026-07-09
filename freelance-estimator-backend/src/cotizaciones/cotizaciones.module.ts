import { Module } from '@nestjs/common';
import { CotizacionesController } from './cotizaciones.controller';
import { CotizacionesService } from './cotizaciones.service';
import { AuthModule } from '../auth/auth.module';
import { DivisasModule } from '../divisas/divisas.module';
import { ClientesModule } from '../clientes/clientes.module';

@Module({
  imports: [AuthModule, DivisasModule, ClientesModule],
  controllers: [CotizacionesController],
  providers: [CotizacionesService],
  exports: [CotizacionesService],
})
export class CotizacionesModule {}
