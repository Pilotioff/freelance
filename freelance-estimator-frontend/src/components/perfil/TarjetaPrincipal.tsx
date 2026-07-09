import { User, Star, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PerfilProfesional } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface TarjetaPrincipalProps {
  perfil: PerfilProfesional;
}

export function TarjetaPrincipal({ perfil }: TarjetaPrincipalProps) {
  const usaSugerida = perfil.tarifa_preferida === 'sugerida';

  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {perfil.avatar_url ? (
            <img src={perfil.avatar_url} alt={perfil.nombre} className="w-full h-full object-cover" />
          ) : (
            <User size={28} className="text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-foreground text-xl font-bold truncate">{perfil.nombre}</h2>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {perfil.nivel_detectado && <Badge label={perfil.nivel_detectado} variant="ia" />}
            {perfil.especialidad && <Badge label={perfil.especialidad} variant="default" />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="bg-background rounded-lg p-4">
          <p className="text-muted text-xs">Valor por hora recomendado</p>
          <p className="text-primary text-xl font-bold mt-1">
            {perfil.valor_hora_recomendado ? formatCurrency(perfil.valor_hora_recomendado) : '—'}
          </p>
          {usaSugerida && <p className="text-ia text-xs mt-1">✓ Usando este valor</p>}
        </div>
        <div className="bg-background rounded-lg p-4">
          <p className="text-muted text-xs">Valor por hora personalizado</p>
          <p className="text-foreground text-xl font-bold mt-1">
            {perfil.valor_hora_personalizado ? formatCurrency(perfil.valor_hora_personalizado) : '—'}
          </p>
          {!usaSugerida && <p className="text-ia text-xs mt-1">✓ Usando este valor</p>}
        </div>
      </div>

      {perfil.confianza !== null && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted flex items-center gap-1"><Star size={12} /> Confianza del análisis</span>
            <span className="text-foreground font-semibold">{perfil.confianza}%</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-ia transition-all duration-300" style={{ width: `${perfil.confianza}%` }} />
          </div>
        </div>
      )}

      {perfil.fecha_ultima_evaluacion && (
        <p className="text-muted text-xs mt-4 flex items-center gap-1">
          <Calendar size={12} />
          Última evaluación: {new Date(perfil.fecha_ultima_evaluacion).toLocaleDateString('es-CO')}
        </p>
      )}
    </Card>
  );
}
