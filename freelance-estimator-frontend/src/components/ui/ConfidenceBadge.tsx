interface ConfidenceBadgeProps {
  confianza: number;
}

export function ConfidenceBadge({ confianza }: ConfidenceBadgeProps) {
  const porcentaje = Math.round(confianza * 100);
  const color =
    confianza >= 0.7 ? 'text-success' : confianza >= 0.4 ? 'text-warning' : 'text-danger';

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ia/10 border border-ia/30 rounded-lg">
      <span className="text-ia text-sm font-medium">✨ IA</span>
      <span className={`text-sm font-semibold ${color}`}>{porcentaje}% confianza</span>
    </div>
  );
}
