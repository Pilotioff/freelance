interface ModeSelectorProps {
  onSelect: (mode: 'manual' | 'ia') => void;
}

export function ModeSelector({ onSelect }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      <button
        onClick={() => onSelect('manual')}
        className="bg-card border-2 border-slate-600 hover:border-primary rounded-2xl p-8 text-left transition group"
      >
        <span className="text-4xl">📝</span>
        <h3 className="text-foreground font-semibold text-lg mt-4 group-hover:text-primary transition">
          Manual
        </h3>
        <p className="text-muted text-sm mt-2">
          Ingresa los parámetros del proyecto paso a paso
        </p>
      </button>

      <button
        onClick={() => onSelect('ia')}
        className="bg-card border-2 border-ia/50 hover:border-ia rounded-2xl p-8 text-left transition group"
      >
        <span className="text-4xl">✨</span>
        <h3 className="text-ia font-semibold text-lg mt-4">
          Analizar con IA
        </h3>
        <p className="text-muted text-sm mt-2">
          Sube un mockup o PDF y la IA pre-llena el formulario
        </p>
      </button>
    </div>
  );
}
