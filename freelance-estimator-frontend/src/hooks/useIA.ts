import { useState, useCallback } from 'react';
import { ResultadoIA } from '../types';
import { iaApi } from '../api/ia.api';

export function useIA() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoIA | null>(null);

  const analizarDocumento = useCallback(async (file: File): Promise<ResultadoIA | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await iaApi.analizarDocumento(file);
      setResultado(res);
      return res;
    } catch {
      setError('No se pudo analizar el documento. Intenta de nuevo.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const analizarMockup = useCallback(async (file: File): Promise<ResultadoIA | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await iaApi.analizarMockup(file);
      setResultado(res);
      return res;
    } catch {
      setError('No se pudo analizar el mockup. Intenta de nuevo.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResultado(null);
    setError(null);
  }, []);

  return { loading, error, resultado, analizarDocumento, analizarMockup, reset };
}
