import { formatCurrency } from '../../utils/formatCurrency';

export interface Desglose {
  diseno: number;
  frontend: number;
  backend: number;
  bd: number;
  infra: number;
  margen: number;
  total: number;
}

export function DesgloseTabla({ desglose }: { desglose: Desglose }) {
  const filas: { label: string; valor: number }[] = [
    { label: 'Diseño', valor: desglose.diseno },
    { label: 'Frontend', valor: desglose.frontend },
    { label: 'Backend', valor: desglose.backend },
    { label: 'Base de datos', valor: desglose.bd },
    { label: 'Infraestructura / Hosting', valor: desglose.infra },
  ];

  const subtotal = desglose.diseno + desglose.frontend + desglose.backend + desglose.bd + desglose.infra;

  return (
    <dl className="space-y-2 text-sm">
      {filas.map((f) => (
        <div key={f.label} className="flex justify-between">
          <dt className="text-muted">{f.label}</dt>
          <dd className="text-foreground">{formatCurrency(f.valor)}</dd>
        </div>
      ))}
      <div className="flex justify-between pt-2 border-t border-slate-700/50">
        <dt className="text-muted">Subtotal</dt>
        <dd className="text-foreground">{formatCurrency(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Margen aplicado</dt>
        <dd className="text-foreground">×{desglose.margen.toFixed(2)}</dd>
      </div>
      <div className="flex justify-between pt-2 border-t border-slate-700/50 font-bold">
        <dt className="text-foreground">TOTAL</dt>
        <dd className="text-primary">{formatCurrency(desglose.total)}</dd>
      </div>
    </dl>
  );
}
