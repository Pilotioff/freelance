import { Sparkles } from 'lucide-react';
import { Input } from '../ui/Input';
import { NIVELES_DISENIO, NivelDisenio, TECNOLOGIAS_SUGERIDAS } from '../../types';

interface Step2DetallesProps {
  nombreProyecto: string;
  cantidadPaginas: number;
  nivelDisenio: NivelDisenio;
  tecnologias: string[];
  onChange: (data: {
    nombre_proyecto?: string;
    cantidad_paginas?: number;
    nivel_disenio?: NivelDisenio;
    tecnologias?: string[];
  }) => void;
  sugeridoPorIA?: boolean;
  error?: string;
}

export function Step2Detalles({
  nombreProyecto,
  cantidadPaginas,
  nivelDisenio,
  tecnologias,
  onChange,
  sugeridoPorIA,
  error,
}: Step2DetallesProps) {
  const toggleTecnologia = (tech: string) => {
    const updated = tecnologias.includes(tech)
      ? tecnologias.filter((t) => t !== tech)
      : [...tecnologias, tech];
    onChange({ tecnologias: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-foreground font-semibold text-lg">Detalles del proyecto</h3>
        {sugeridoPorIA && (
          <span className="flex items-center gap-1 text-ia text-xs">
            <Sparkles size={14} /> Sugerido por IA
          </span>
        )}
      </div>

      <Input
        label="Nombre del proyecto"
        value={nombreProyecto}
        onChange={(e) => onChange({ nombre_proyecto: e.target.value })}
        placeholder="Mi proyecto web"
        error={error}
      />

      <div>
        <label className="text-sm font-medium text-muted">
          Cantidad de páginas: <span className="text-foreground font-bold">{cantidadPaginas}</span>
        </label>
        <input
          type="range"
          min={1}
          max={50}
          value={cantidadPaginas}
          onChange={(e) => onChange({ cantidad_paginas: parseInt(e.target.value, 10) })}
          className="w-full mt-2 accent-primary"
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>1</span><span>50</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-muted mb-3 block">Nivel de diseño</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {NIVELES_DISENIO.map((n) => (
            <button
              key={n.value}
              onClick={() => onChange({ nivel_disenio: n.value })}
              className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition ${
                nivelDisenio === n.value
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-slate-600 text-muted hover:text-foreground'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-muted mb-3 block">Tecnologías</label>
        <div className="flex flex-wrap gap-2">
          {TECNOLOGIAS_SUGERIDAS.map((tech) => (
            <button
              key={tech}
              onClick={() => toggleTecnologia(tech)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                tecnologias.includes(tech)
                  ? 'border-ia bg-ia/20 text-ia'
                  : 'border-slate-600 text-muted hover:border-slate-500'
              }`}
            >
              {tecnologias.includes(tech) && sugeridoPorIA && '✨ '}
              {tech}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
