import { Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { ResultadoEvaluacion } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface ResumenNivelDetectadoProps {
  resultado: ResultadoEvaluacion;
  onContinuar: () => void;
}

export function ResumenNivelDetectado({ resultado, onContinuar }: ResumenNivelDetectadoProps) {
  return (
    <div className="text-center space-y-6">
      <div className="text-primary text-5xl">
        <Sparkles className="mx-auto" size={48} />
      </div>
      <div>
        <p className="text-muted text-sm">Tu nivel detectado</p>
        <h2 className="text-foreground text-3xl font-bold mt-1">{resultado.nivel_detectado}</h2>
      </div>

      <div className="bg-card rounded-xl p-4">
        <p className="text-muted text-xs">Tarifa por hora sugerida</p>
        <p className="text-primary text-2xl font-bold mt-1">
          {formatCurrency(resultado.tarifa_sugerida_cop)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-left">
        <div>
          <p className="text-success text-xs font-medium mb-2 flex items-center gap-1">
            <TrendingUp size={14} /> Fortalezas
          </p>
          <ul className="space-y-1">
            {resultado.fortalezas.map((f) => (
              <li key={f} className="text-foreground text-sm">• {f}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-warning text-xs font-medium mb-2 flex items-center gap-1">
            <TrendingDown size={14} /> Áreas de mejora
          </p>
          <ul className="space-y-1">
            {resultado.areas_mejora.map((a) => (
              <li key={a} className="text-foreground text-sm">• {a}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted">Nivel de confianza del análisis</span>
          <span className="text-foreground font-semibold">{resultado.confianza}%</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-ia transition-all duration-500"
            style={{ width: `${resultado.confianza}%` }}
          />
        </div>
      </div>

      <Button onClick={onContinuar} className="w-full">
        Continuar al Dashboard
      </Button>
    </div>
  );
}
