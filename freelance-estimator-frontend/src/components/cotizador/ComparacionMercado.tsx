import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Cotizacion } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { compararConMercado, EstadoComparacion } from '../../utils/compararConMercado';
import { marketComparisonApi, PromedioMercado } from '../../api/market-comparison.api';
import { freelancerExperienceApi } from '../../api/freelancer-experience.api';

interface ComparacionMercadoProps {
  resultado: Cotizacion;
  cantidadDesarrolladores: number;
}

const ICONO_ESTADO: Record<EstadoComparacion, React.ReactNode> = {
  dentro: <Minus size={16} className="text-muted" />,
  por_encima: <TrendingUp size={16} className="text-success" />,
  por_debajo: <TrendingDown size={16} className="text-warning" />,
};

export function ComparacionMercado({ resultado, cantidadDesarrolladores }: ComparacionMercadoProps) {
  const [mercado, setMercado] = useState<PromedioMercado | null>(null);
  const [nivel, setNivel] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      marketComparisonApi.obtenerPromedio(resultado.tipo_proyecto),
      freelancerExperienceApi.miEvaluacion(),
    ])
      .then(([promedio, evaluacion]) => {
        setMercado(promedio);
        setNivel(evaluacion?.nivel_detectado ?? null);
      })
      .finally(() => setCargando(false));
  }, [resultado.tipo_proyecto]);

  if (cargando) {
    return (
      <div className="h-32 bg-slate-700/30 rounded-xl animate-pulse mt-6" />
    );
  }

  if (!mercado) return null;

  const costoDesarrollo =
    (resultado.costo_diseno ?? 0) +
    (resultado.costo_frontend ?? 0) +
    (resultado.costo_backend ?? 0) +
    (resultado.costo_bd ?? 0);
  const valorHoraUsuario =
    resultado.horas_estimadas > 0 && cantidadDesarrolladores > 0
      ? costoDesarrollo / resultado.horas_estimadas / cantidadDesarrolladores
      : 0;
  const valorTotalPromedioMercado = mercado.valor_hora_promedio * resultado.horas_estimadas;

  const comparacion = compararConMercado(valorHoraUsuario, mercado.valor_hora_promedio);

  return (
    <div className="mt-6">
      <h4 className="text-foreground font-semibold mb-4">Comparación con el mercado</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <p className="text-primary text-xs font-medium mb-3">Tu cotización</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Valor por hora</dt>
              <dd className="text-foreground">{formatCurrency(valorHoraUsuario)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Valor total</dt>
              <dd className="text-foreground">{formatCurrency(resultado.precio_final)}</dd>
            </div>
            {nivel && (
              <div className="flex justify-between">
                <dt className="text-muted">Nivel</dt>
                <dd className="text-foreground">{nivel}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Complejidad</dt>
              <dd className="text-foreground capitalize">{resultado.complejidad}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <p className="text-muted text-xs font-medium mb-3">Promedio del mercado</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Valor promedio por hora</dt>
              <dd className="text-foreground">{formatCurrency(mercado.valor_hora_promedio)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Valor promedio total</dt>
              <dd className="text-foreground">{formatCurrency(valorTotalPromedioMercado)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Rango habitual</dt>
              <dd className="text-foreground text-right">
                {formatCurrency(mercado.rango_hora_min)} – {formatCurrency(mercado.rango_hora_max)}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="flex items-center gap-2 mt-4 px-4 py-3 bg-card rounded-lg">
        {ICONO_ESTADO[comparacion.estado]}
        <p className="text-foreground text-sm">{comparacion.mensaje}</p>
      </div>
    </div>
  );
}
