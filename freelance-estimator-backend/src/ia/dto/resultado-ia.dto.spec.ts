import { validateResultadoIA } from './resultado-ia.dto';

describe('validateResultadoIA', () => {
  const valido = {
    tipo_proyecto: 'webapp',
    cantidad_paginas: 10,
    nivel_disenio: 'intermedio',
    tecnologias: ['React'],
    cantidad_desarrolladores: 2,
    tiempo_entrega: '1mes',
    hosting: 'vps',
    complejidad_detectada: 'media',
    funcionalidades_clave: ['Login'],
    supuestos: ['Sin integraciones externas'],
    confianza_estimacion: 0.8,
  };

  it('debe validar resultado correcto', () => {
    const result = validateResultadoIA(valido);
    expect(result.tipo_proyecto).toBe('webapp');
    expect(result.supuestos.length).toBeGreaterThan(0);
  });

  it('debe rechazar supuestos vacíos', () => {
    expect(() =>
      validateResultadoIA({ ...valido, supuestos: [] }),
    ).toThrow('supuestos no puede estar vacío');
  });

  it('debe limitar confianza a 0.65 para mockups', () => {
    expect(() =>
      validateResultadoIA({ ...valido, confianza_estimacion: 0.9 }, true),
    ).toThrow('confianza_estimacion excede 0.65');
  });
});