import { Card } from '../ui/Card';
import { PromedioCategoria } from '../../types';

interface ResumenHabilidadesProps {
  categorias: Record<string, PromedioCategoria>;
}

export function ResumenHabilidades({ categorias }: ResumenHabilidadesProps) {
  const entradas = Object.entries(categorias);

  if (entradas.length === 0) {
    return (
      <Card>
        <p className="text-muted text-sm">Aún no tienes una evaluación de experiencia registrada.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-foreground font-semibold mb-4">Resumen de habilidades</h3>
      <div className="space-y-4">
        {entradas.map(([clave, cat]) => (
          <div key={clave}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground">{cat.label}</span>
              <span className="text-muted">{cat.valor.toFixed(1)} / 5</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(cat.valor / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
