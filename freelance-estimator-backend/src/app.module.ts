import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import configuration, { validateConfig } from './common/config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { MongoModule } from './mongo/mongo.module';
import { AuthModule } from './auth/auth.module';
import { CotizacionesModule } from './cotizaciones/cotizaciones.module';
import { IaModule } from './ia/ia.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DivisasModule } from './divisas/divisas.module';
import { AdminModule } from './admin/admin.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    MongoModule,
    AuthModule,
    CotizacionesModule,
    IaModule,
    DashboardModule,
    DivisasModule,
    AdminModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {
  constructor() {
    validateConfig();
  }
}
