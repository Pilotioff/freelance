import { useState } from 'react';
import { Star } from 'lucide-react';
import { NIVELES_ESTRELLA } from '../../utils/tecnologiasEvaluacion';

interface EvaluacionEstrellaProps {
  label: string;
  valor: number | undefined;
  onChange: (valor: number) => void;
}

export function EvaluacionEstrella({ label, valor, onChange }: EvaluacionEstrellaProps) {
  const [hover, setHover] = useState<number | null>(null);
  const mostrado = hover ?? valor ?? 0;

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-700/30 last:border-0">
      <span className="text-foreground text-sm">{label}</span>
      <div className="flex items-center gap-1" title={mostrado > 0 ? NIVELES_ESTRELLA[mostrado] : undefined}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            className="transition-transform hover:scale-125"
            aria-label={`${n} estrellas: ${NIVELES_ESTRELLA[n]}`}
          >
            <Star
              size={20}
              className={`transition-colors ${
                n <= mostrado ? 'fill-primary text-primary' : 'fill-transparent text-slate-600'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
