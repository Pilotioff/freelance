import api, { unwrapData } from './axios';
import { Usuario } from '../types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegistroPayload extends LoginPayload {
  nombre: string;
  apellido: string;
  empresa?: string;
  telefono?: string;
  tarifa_hora_cop?: number;
}

interface LoginApiResponse {
  exito: boolean;
  mensaje: string;
  usuario: Usuario;
  modoRespaldo?: boolean;
}

interface AuthResponse {
  usuario: Usuario;
  modoRespaldo?: boolean;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<{ data: LoginApiResponse }>('/auth/login', payload);
    const data = unwrapData(res);
    return { usuario: data.usuario, modoRespaldo: data.modoRespaldo };
  },

  registro: async (payload: RegistroPayload): Promise<AuthResponse> => {
    const res = await api.post<{ data: AuthResponse }>('/auth/registro', payload);
    return unwrapData(res);
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  me: async (): Promise<Usuario> => {
    const res = await api.get<{ data: { usuario: Usuario } }>('/auth/me');
    return unwrapData(res).usuario;
  },
};
