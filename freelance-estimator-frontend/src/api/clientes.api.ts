import api, { unwrapData } from './axios';
import {
  Cliente,
  ClienteConMetricas,
  DetalleCliente,
  ListadoClientes,
  CrearClientePayload,
  FiltrosClientes,
} from '../types';

export const clientesApi = {
  crear: async (payload: CrearClientePayload): Promise<Cliente> => {
    const res = await api.post<{ data: Cliente }>('/clientes', payload);
    return unwrapData(res);
  },

  listar: async (filtros: FiltrosClientes): Promise<ListadoClientes> => {
    const res = await api.get<{ data: ListadoClientes }>('/clientes', { params: filtros });
    return unwrapData(res);
  },

  obtenerPorId: async (id: string): Promise<DetalleCliente> => {
    const res = await api.get<{ data: DetalleCliente }>(`/clientes/${id}`);
    return unwrapData(res);
  },

  actualizar: async (id: string, payload: Partial<CrearClientePayload>): Promise<ClienteConMetricas> => {
    const res = await api.patch<{ data: ClienteConMetricas }>(`/clientes/${id}`, payload);
    return unwrapData(res);
  },
};
