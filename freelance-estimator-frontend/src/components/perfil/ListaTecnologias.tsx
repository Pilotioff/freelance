import { Star } from 'lucide-react';
import { Card } from '../ui/Card';
import { TecnologiaEvaluadaPerfil } from '../../types';
import { NIVELES_ESTRELLA } from '../../utils/tecnologiasEvaluacion';

interface ListaTecnologiasProps {
  tecnologias: TecnologiaEvaluadaPerfil[];
}

export function ListaTecnologias({ tecnologias }: ListaTecnologiasProps) {
  if (tecnologias.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-foreground font-semibold mb-4">Tecnologías evaluadas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tecnologias.map((t) => (
          <div key={t.tecnologia} className="flex items-center justify-between bg-background rounded-lg px-3 py-2.5">
            <div>
              <p className="text-foreground text-sm font-medium">{t.label}</p>
              <p className="text-muted text-xs">{NIVELES_ESTRELLA[t.estrellas]}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={13}
                    className={n <= t.estrellas ? 'fill-primary text-primary' : 'fill-transparent text-slate-600'}
                  />
                ))}
              </div>
              <span className="text-muted text-xs w-6 text-right">{t.estrellas}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
