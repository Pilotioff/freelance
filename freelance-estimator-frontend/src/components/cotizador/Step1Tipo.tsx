import { Sparkles } from 'lucide-react';
import { TIPOS_PROYECTO, TipoProyecto } from '../../types';

interface Step1TipoProps {
  selected: TipoProyecto | '';
  onSelect: (tipo: TipoProyecto) => void;
  sugeridoPorIA?: boolean;
  error?: string;
}

export function Step1Tipo({ selected, onSelect, sugeridoPorIA, error }: Step1TipoProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-foreground font-semibold text-lg">Tipo de proyecto</h3>
        {sugeridoPorIA && (
          <span className="flex items-center gap-1 text-ia text-xs">
            <Sparkles size={14} /> Sugerido por IA
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {TIPOS_PROYECTO.map((tipo) => (
          <button
            key={tipo.value}
            onClick={() => onSelect(tipo.value)}
            className={`p-5 rounded-xl border-2 text-left transition ${
              selected === tipo.value
                ? 'border-primary bg-primary/10'
                : error
                  ? 'border-danger/50 hover:border-danger bg-card'
                  : 'border-slate-600 hover:border-slate-500 bg-card'
            }`}
          >
            <span className="text-2xl">{tipo.icon}</span>
            <p className="text-foreground font-medium mt-2 text-sm">{tipo.label}</p>
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-danger mt-3">{error}</p>}
    </div>
  );
}
