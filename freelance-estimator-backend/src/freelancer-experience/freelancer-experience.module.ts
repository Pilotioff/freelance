import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FreelancerExperienceController } from './freelancer-experience.controller';
import { FreelancerExperienceService } from './freelancer-experience.service';
import {
  EvaluacionExperiencia,
  EvaluacionExperienciaSchema,
} from '../mongo/schemas/evaluacion-experiencia.schema';
import { MongoModule } from '../mongo/mongo.module';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([
      { name: EvaluacionExperiencia.name, schema: EvaluacionExperienciaSchema },
    ]),
  ],
  controllers: [FreelancerExperienceController],
  providers: [FreelancerExperienceService],
  exports: [FreelancerExperienceService],
})
export class FreelancerExperienceModule {}
