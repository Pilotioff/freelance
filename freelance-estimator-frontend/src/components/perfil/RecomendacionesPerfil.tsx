import { Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';

interface RecomendacionesPerfilProps {
  recomendaciones: string[];
}

export function RecomendacionesPerfil({ recomendaciones }: RecomendacionesPerfilProps) {
  if (recomendaciones.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-ia font-semibold mb-4 flex items-center gap-2">
        <Sparkles size={16} /> Recomendaciones
      </h3>
      <ul className="space-y-2">
        {recomendaciones.map((r) => (
          <li key={r} className="text-foreground text-sm bg-background rounded-lg p-3">
            {r}
          </li>
        ))}
      </ul>
    </Card>
  );
}
