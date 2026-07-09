import { useState, useEffect, useCallback } from 'react';
import { clientesApi } from '../api/clientes.api';
import { ClienteConMetricas, FiltrosClientes } from '../types';

const INITIAL_FILTROS: FiltrosClientes = {
  busqueda: '',
  tipo_cliente: undefined,
  activo: undefined,
  ordenarPor: 'creado_en',
  orden: 'desc',
  pagina: 1,
  porPagina: 10,
};

export function useClientes() {
  const [filtros, setFiltros] = useState<FiltrosClientes>(INITIAL_FILTROS);
  const [busquedaInput, setBusquedaInput] = useState('');
  const [clientes, setClientes] = useState<ClienteConMetricas[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientesApi.listar(filtros);
      setClientes(res.clientes);
      setTotal(res.total);
    } catch {
      setError('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltros((prev) => ({ ...prev, busqueda: busquedaInput, pagina: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [busquedaInput]);

  const cambiarFiltro = useCallback((cambios: Partial<FiltrosClientes>) => {
    setFiltros((prev) => ({ ...prev, ...cambios, pagina: cambios.pagina ?? 1 }));
  }, []);

  const cambiarOrden = useCallback((campo: FiltrosClientes['ordenarPor']) => {
    setFiltros((prev) => ({
      ...prev,
      ordenarPor: campo,
      orden: prev.ordenarPor === campo && prev.orden === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const irAPagina = useCallback((pagina: number) => {
    setFiltros((prev) => ({ ...prev, pagina }));
  }, []);

  return {
    clientes,
    total,
    loading,
    error,
    filtros,
    busquedaInput,
    setBusquedaInput,
    cambiarFiltro,
    cambiarOrden,
    irAPagina,
    recargar: cargar,
  };
}
