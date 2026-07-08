import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Usuario } from '../types';
import { authApi } from '../api/auth.api';

interface AuthContextValue {
  usuario: Usuario | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  registro: (data: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    empresa?: string;
    telefono?: string;
    tarifa_hora_cop?: number;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refrescarUsuario: () => Promise<void>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const user = await authApi.me();
      setUsuario(user);
    } catch {
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      const { usuario: user } = await authApi.login({ email, password });
      setUsuario(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registro = async (data: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    empresa?: string;
    telefono?: string;
    tarifa_hora_cop?: number;
  }): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      const { usuario: user } = await authApi.registro(data);
      setUsuario(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await authApi.logout();
    setUsuario(null);
  };

  const refrescarUsuario = async (): Promise<void> => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        loading,
        error,
        login,
        registro,
        logout,
        refrescarUsuario,
        isAdmin: usuario?.rol === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
