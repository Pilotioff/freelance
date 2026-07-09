import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { FreelancerExperienceService } from './freelancer-experience.service';
import { EvaluacionExperiencia } from '../mongo/schemas/evaluacion-experiencia.schema';
import { Usuario } from '../mongo/schemas/usuario.schema';
import { TECNOLOGIAS_EVALUABLES } from './tecnologias';

function construirPuntajes(estrellas: number) {
  return TECNOLOGIAS_EVALUABLES.map((tecnologia) => ({ tecnologia, estrellas }));
}

describe('FreelancerExperienceService', () => {
  let service: FreelancerExperienceService;
  let evaluacionModelMock: { create: jest.Mock };
  let usuarioModelMock: { findByIdAndUpdate: jest.Mock };

  beforeEach(async () => {
    evaluacionModelMock = { create: jest.fn().mockResolvedValue({}) };
    usuarioModelMock = { findByIdAndUpdate: jest.fn().mockResolvedValue({}) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreelancerExperienceService,
        { provide: getModelToken(EvaluacionExperiencia.name), useValue: evaluacionModelMock },
        { provide: getModelToken(Usuario.name), useValue: usuarioModelMock },
      ],
    }).compile();

    service = module.get(FreelancerExperienceService);
  });

  it('debe detectar nivel Junior con puntajes bajos y tarifa cercana al minimo', async () => {
    const resultado = await service.evaluar('user-1', { puntajes: construirPuntajes(1) });

    expect(resultado.nivel_detectado).toBe('Junior');
    expect(resultado.tarifa_sugerida_cop).toBeGreaterThanOrEqual(35000);
    expect(resultado.tarifa_sugerida_cop).toBeLessThan(45000);
    expect(resultado.confianza).toBe(0);
  });

  it('debe detectar nivel Senior / Lead con puntajes altos y confianza 100%', async () => {
    const resultado = await service.evaluar('user-1', { puntajes: construirPuntajes(5) });

    expect(resultado.nivel_detectado).toBe('Senior / Lead');
    expect(resultado.tarifa_sugerida_cop).toBeGreaterThanOrEqual(200000);
    expect(resultado.confianza).toBe(100);
    expect(evaluacionModelMock.create).toHaveBeenCalled();
    expect(usuarioModelMock.findByIdAndUpdate).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ onboarding_completado: true }),
    );
  });

  it('debe lanzar error si faltan tecnologias por calificar', async () => {
    const incompleto = construirPuntajes(3).slice(0, 5);
    await expect(service.evaluar('user-1', { puntajes: incompleto })).rejects.toThrow(BadRequestException);
  });
});
