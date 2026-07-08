import { useEffect, useRef, useState } from 'react';
import { Sparkles, Clock, Layers, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge, nivelComplejidadVariant } from '../ui/Badge';
import { CotizacionFormState, TIPOS_PROYECTO, TIEMPOS_ENTREGA } from '../../types';
import { EstimacionCalculada } from '../../api/cotizaciones.api';
import { formatCurrency } from '../../utils/formatCurrency';
import { calcularComplejidad } from '../../utils/calcularComplejidad';
import { calcularConfianza } from '../../utils/calcularConfianza';
import { obtenerRecomendaciones } from '../../utils/obtenerRecomendaciones';

interface PanelResumenVivoProps {
  form: CotizacionFormState;
  estimacion: EstimacionCalculada | null;
  loading: boolean;
}

export function PanelResumenVivo({ form, estimacion, loading }: PanelResumenVivoProps) {
  const [animarPrecio, setAnimarPrecio] = useState(false);
  const precioAnteriorRef = useRef<number | null>(null);

  useEffect(() => {
    if (estimacion && precioAnteriorRef.current !== null && precioAnteriorRef.current !== estimacion.precioFinal) {
      setAnimarPrecio(true);
      const timer = setTimeout(() => setAnimarPrecio(false), 500);
      return () => clearTimeout(timer);
    }
    if (estimacion) {
      precioAnteriorRef.current = estimacion.precioFinal;
    }
  }, [estimacion]);

  const tipoLabel = TIPOS_PROYECTO.find((t) => t.value === form.tipo_proyecto)?.label;
  const tiempoLabel = TIEMPOS_ENTREGA.find((t) => t.value === form.tiempo_entrega)?.label;
  const complejidad = calcularComplejidad(form);
  const confianza = calcularConfianza(form);
  const recomendaciones = obtenerRecomendaciones(form);

  const tarifaHora =
    estimacion && estimacion.horasEstimadas > 0 && form.cantidad_desarrolladores > 0
      ? estimacion.costoDesarrollo / estimacion.horasEstimadas / form.cantidad_desarrolladores
      : null;

  return (
    <Card className="lg:sticky lg:top-6 space-y-5">
      <div className="flex items-center gap-2">
        <TrendingUp size={18} className="text-primary" />
        <h3 className="text-foreground font-semibold">Estimación en vivo</h3>
      </div>

      <div>
        <p className="text-muted text-xs">Valor estimado total</p>
        {loading ? (
          <div className="h-9 w-32 bg-slate-700/50 rounded animate-pulse mt-1" />
        ) : estimacion ? (
          <p
            className={`text-3xl font-bold text-primary mt-1 transition-transform ${
              animarPrecio ? 'scale-110' : 'scale-100'
            }`}
          >
            {formatCurrency(estimacion.precioFinal)}
          </p>
        ) : (
          <p className="text-muted text-sm mt-1">Completa los datos para estimar</p>
        )}
      </div>

      {estimacion && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted text-xs">Valor por hora</p>
            <p className="text-foreground font-medium">
              {tarifaHora ? formatCurrency(tarifaHora) : '—'}
            </p>
          </div>
          <div>
            <p className="text-muted text-xs flex items-center gap-1"><Clock size={12} /> Horas estimadas</p>
            <p className="text-foreground font-medium">{estimacion.horasEstimadas.toFixed(0)}h</p>
          </div>
          <div>
            <p className="text-muted text-xs">Tiempo de entrega</p>
            <p className="text-foreground font-medium">{tiempoLabel ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted text-xs">Tipo de proyecto</p>
            <p className="text-foreground font-medium truncate">{tipoLabel ?? '—'}</p>
          </div>
        </div>
      )}

      <div>
        <p className="text-muted text-xs mb-1.5 flex items-center gap-1"><Layers size={12} /> Nivel de complejidad</p>
        <div className="flex items-center gap-2">
          <Badge label={complejidad.label} variant={nivelComplejidadVariant(complejidad.nivel)} />
          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(100, complejidad.puntaje)}%` }}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="text-muted text-xs">Precisión de la estimación</p>
          <span className="text-foreground text-xs font-semibold">{confianza.porcentaje}%</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-ia transition-all duration-300"
            style={{ width: `${confianza.porcentaje}%` }}
          />
        </div>
        <p className="text-muted text-xs mt-1.5">{confianza.explicacion}</p>
      </div>

      {form.tecnologias.length > 0 && (
        <div>
          <p className="text-muted text-xs mb-1.5">Tecnologías seleccionadas</p>
          <div className="flex flex-wrap gap-1.5">
            {form.tecnologias.map((tech) => (
              <Badge key={tech} label={tech} variant="default" />
            ))}
          </div>
        </div>
      )}

      {recomendaciones.length > 0 && (
        <div className="pt-3 border-t border-slate-700/50">
          <p className="text-ia text-xs font-medium mb-2 flex items-center gap-1">
            <Sparkles size={12} /> Recomendaciones
          </p>
          <ul className="space-y-1.5">
            {recomendaciones.map((rec) => (
              <li key={rec} className="text-muted text-xs leading-relaxed">• {rec}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
