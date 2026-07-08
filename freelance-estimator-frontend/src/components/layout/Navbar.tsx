import { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  title: string;
  children?: ReactNode;
}

export function Navbar({ title, children }: NavbarProps) {
  const { usuario } = useAuth();

  return (
    <header className="h-16 border-b border-slate-700/50 bg-card/50 backdrop-blur flex items-center justify-between px-8">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="flex items-center gap-4">
        {children}
        {usuario && (
          <div className="text-sm text-muted">
            {usuario.tarifa_hora_cop
              ? `$${usuario.tarifa_hora_cop.toLocaleString('es-CO')}/hr`
              : ''}
          </div>
        )}
      </div>
    </header>
  );
}
