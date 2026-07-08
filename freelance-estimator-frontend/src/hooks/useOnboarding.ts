import { useState, useCallback, useMemo } from 'react';
import { TECNOLOGIAS_EVALUABLES } from '../utils/tecnologiasEvaluacion';
import { freelancerExperienceApi } from '../api/freelancer-experience.api';
import { ResultadoEvaluacion } from '../types';

export function useOnboarding() {
  const [puntajes, setPuntajes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoEvaluacion | null>(null);

  const calificar = useCallback((tecnologia: string, estrellas: number) => {
    setPuntajes((prev) => ({ ...prev, [tecnologia]: estrellas }));
  }, []);

  const completadas = useMemo(() => Object.keys(puntajes).length, [puntajes]);
  const totalTecnologias = TECNOLOGIAS_EVALUABLES.length;
  const listoParaEnviar = completadas === totalTecnologias;

  const enviar = useCallback(async () => {
    if (!listoParaEnviar) return;
    setLoading(true);
    setError(null);
    try {
      const payload = Object.entries(puntajes).map(([tecnologia, estrellas]) => ({
        tecnologia,
        estrellas,
      }));
      const res = await freelancerExperienceApi.evaluar(payload);
      setResultado(res);
    } catch {
      setError('No se pudo procesar la evaluación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [puntajes, listoParaEnviar]);

  return {
    puntajes,
    calificar,
    completadas,
    totalTecnologias,
    listoParaEnviar,
    enviar,
    loading,
    error,
    resultado,
  };
}
