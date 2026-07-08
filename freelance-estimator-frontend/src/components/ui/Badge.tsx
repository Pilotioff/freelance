import { Complejidad } from '../../types';
import { NivelComplejidad } from '../../utils/calcularComplejidad';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'ia';
  className?: string;
}

const variants = {
  default: 'bg-slate-700 text-foreground',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  danger: 'bg-danger/20 text-danger',
  ia: 'bg-ia/20 text-ia',
};

export function Badge({ label, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {label}
    </span>
  );
}

export function complejidadVariant(complejidad: Complejidad): BadgeProps['variant'] {
  const map: Record<Complejidad, BadgeProps['variant']> = {
    baja: 'success',
    media: 'warning',
    alta: 'danger',
  };
  return map[complejidad];
}

export function nivelComplejidadVariant(nivel: NivelComplejidad): BadgeProps['variant'] {
  const map: Record<NivelComplejidad, BadgeProps['variant']> = {
    baja: 'success',
    media: 'warning',
    alta: 'danger',
    muy_alta: 'danger',
    extrema: 'danger',
  };
  return map[nivel];
}
