import { HOSTING_OPTIONS, TIEMPOS_ENTREGA, Hosting, TiempoEntrega } from '../../types';

interface Step3InfraestructuraProps {
  hosting: Hosting;
  tiempoEntrega: TiempoEntrega;
  cantidadDesarrolladores: number;
  onChange: (data: {
    hosting?: Hosting;
    tiempo_entrega?: TiempoEntrega;
    cantidad_desarrolladores?: number;
  }) => void;
}

export function Step3Infraestructura({
  hosting,
  tiempoEntrega,
  cantidadDesarrolladores,
  onChange,
}: Step3InfraestructuraProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-foreground font-semibold text-lg mb-4">Hosting</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {HOSTING_OPTIONS.map((h) => (
            <button
              key={h.value}
              onClick={() => onChange({ hosting: h.value })}
              className={`p-4 rounded-xl border-2 text-left transition ${
                hosting === h.value
                  ? 'border-primary bg-primary/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <p className="text-foreground font-medium text-sm">{h.label}</p>
              <p className="text-muted text-xs mt-1">{h.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-foreground font-semibold text-lg mb-4">Tiempo de entrega</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TIEMPOS_ENTREGA.map((t) => (
            <button
              key={t.value}
              onClick={() => onChange({ tiempo_entrega: t.value })}
              className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition ${
                tiempoEntrega === t.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-slate-600 text-muted hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-foreground font-semibold text-lg mb-4">Desarrolladores</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onChange({ cantidad_desarrolladores: Math.max(1, cantidadDesarrolladores - 1) })}
            className="w-10 h-10 rounded-lg bg-card border border-slate-600 text-foreground text-xl hover:bg-slate-700 transition"
          >
            −
          </button>
          <span className="text-3xl font-bold text-foreground w-12 text-center">
            {cantidadDesarrolladores}
          </span>
          <button
            onClick={() => onChange({ cantidad_desarrolladores: Math.min(10, cantidadDesarrolladores + 1) })}
            className="w-10 h-10 rounded-lg bg-card border border-slate-600 text-foreground text-xl hover:bg-slate-700 transition"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
