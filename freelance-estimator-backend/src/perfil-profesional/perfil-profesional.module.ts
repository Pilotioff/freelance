import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerfilProfesionalController } from './perfil-profesional.controller';
import { PerfilProfesionalService } from './perfil-profesional.service';
import { AuthModule } from '../auth/auth.module';
import { FreelancerExperienceModule } from '../freelancer-experience/freelancer-experience.module';
import { MongoModule } from '../mongo/mongo.module';
import { EvaluacionExperiencia, EvaluacionExperienciaSchema } from '../mongo/schemas/evaluacion-experiencia.schema';

@Module({
  imports: [
    AuthModule,
    FreelancerExperienceModule,
    MongoModule,
    MongooseModule.forFeature([
      { name: EvaluacionExperiencia.name, schema: EvaluacionExperienciaSchema },
    ]),
  ],
  controllers: [PerfilProfesionalController],
  providers: [PerfilProfesionalService],
})
export class PerfilProfesionalModule {}
