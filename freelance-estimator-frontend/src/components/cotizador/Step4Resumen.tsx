import { Card } from '../ui/Card';
import { Badge, complejidadVariant } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { Cotizacion, CotizacionFormState, Moneda } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { TIPOS_PROYECTO, HOSTING_OPTIONS, TIEMPOS_ENTREGA, MONEDAS_DISPONIBLES } from '../../types';
import { EstimacionCalculada } from '../../api/cotizaciones.api';
import { ComparacionMercado } from './ComparacionMercado';
import { BotonExportar } from './BotonExportar';
import { DesgloseTabla } from './DesgloseTabla';

interface Step4ResumenProps {
  form: CotizacionFormState;
  resultado: Cotizacion | null;
  loading: boolean;
  error: string | null;
  estimacion: EstimacionCalculada | null;
  onConfirmar: () => void;
  onNueva: () => void;
  onChangeMoneda: (moneda: Moneda) => void;
}

export function Step4Resumen({
  form,
  resultado,
  loading,
  error,
  estimacion,
  onConfirmar,
  onNueva,
  onChangeMoneda,
}: Step4ResumenProps) {
  const tipoLabel = TIPOS_PROYECTO.find((t) => t.value === form.tipo_proyecto)?.label ?? form.tipo_proyecto;
  const hostingLabel = HOSTING_OPTIONS.find((h) => h.value === form.hosting)?.label ?? form.hosting;
  const tiempoLabel = TIEMPOS_ENTREGA.find((t) => t.value === form.tiempo_entrega)?.label ?? form.tiempo_entrega;

  const desglose = resultado
    ? {
        diseno: resultado.costo_diseno ?? 0,
        frontend: resultado.costo_frontend ?? 0,
        backend: resultado.costo_backend ?? 0,
        bd: resultado.costo_bd ?? 0,
        infra: resultado.costo_infraestructura,
        margen: resultado.margen_aplicado,
        total: resultado.precio_final,
      }
    : estimacion
      ? {
          diseno: estimacion.costoDiseno,
          frontend: estimacion.costoFrontend,
          backend: estimacion.costoBackend,
          bd: estimacion.costoBd,
          infra: estimacion.costoInfra,
          margen: estimacion.margenPerfil,
          total: estimacion.precioFinal,
        }
      : null;

  if (resultado) {
    const hayConversion = resultado.moneda_seleccionada !== 'COP' && resultado.precio_convertido != null;

    return (
      <div className="text-center space-y-6">
        <div className="text-success text-5xl">✓</div>
        <h3 className="text-foreground text-2xl font-bold">¡Cotización creada!</h3>
        <p className="text-ia text-4xl font-bold">
          {form.esMockup && form.rango_estimado
            ? `${formatCurrency(form.rango_estimado.minimo_cop)} – ${formatCurrency(form.rango_estimado.maximo_cop)}`
            : hayConversion
              ? formatCurrency(resultado.precio_convertido as number, resultado.moneda_seleccionada)
              : formatCurrency(resultado.precio_final)}
        </p>
        {hayConversion && (
          <p className="text-muted text-sm">
            Equivale a {formatCurrency(resultado.precio_final)} (tasa usada: {resultado.tasa_cambio_usada})
          </p>
        )}
        {form.esMockup && form.rango_estimado && (
          <p className="text-muted text-sm">Rango estimado por IA (mockup)</p>
        )}
        <Badge label={resultado.complejidad} variant={complejidadVariant(resultado.complejidad)} />

        {desglose && (
          <div className="text-left max-w-sm mx-auto pt-4 border-t border-slate-700/50">
            <h4 className="text-muted text-sm font-medium mb-3">Desglose del costo</h4>
            <DesgloseTabla desglose={desglose} />
          </div>
        )}

        <div className="text-left">
          <ComparacionMercado resultado={resultado} cantidadDesarrolladores={form.cantidad_desarrolladores} />
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button onClick={onNueva} variant="secondary">Nueva cotización</Button>
          <BotonExportar cotizacionId={resultado.id} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-foreground font-semibold text-lg mb-6">Resumen de cotización</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-muted text-sm font-medium mb-4">Proyecto</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Nombre</dt>
              <dd className="text-foreground">{form.nombre_proyecto || 'Sin nombre'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Tipo</dt>
              <dd className="text-foreground">{tipoLabel}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Páginas</dt>
              <dd className="text-foreground">{form.cantidad_paginas}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Diseño</dt>
              <dd className="text-foreground capitalize">{form.nivel_disenio}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Tecnologías</dt>
              <dd className="text-foreground text-right">{form.tecnologias.join(', ') || '—'}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h4 className="text-muted text-sm font-medium mb-4">Infraestructura</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Hosting</dt>
              <dd className="text-foreground">{hostingLabel}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Entrega</dt>
              <dd className="text-foreground">{tiempoLabel}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Desarrolladores</dt>
              <dd className="text-foreground">{form.cantidad_desarrolladores}</dd>
            </div>
            {form.generado_por_ia && (
              <div className="flex justify-between">
                <dt className="text-muted">Generado por IA</dt>
                <dd className="text-ia">✨ Sí</dd>
              </div>
            )}
          </dl>
        </Card>
      </div>

      {desglose && (
        <Card className="mt-6">
          <h4 className="text-muted text-sm font-medium mb-4">Desglose completo del costo</h4>
          <DesgloseTabla desglose={desglose} />
        </Card>
      )}

      <div className="mt-6">
        <label className="text-sm font-medium text-muted mb-2 block">Moneda del presupuesto</label>
        <select
          value={form.moneda_seleccionada}
          onChange={(e) => onChangeMoneda(e.target.value as Moneda)}
          className="w-full px-4 py-2.5 bg-background border border-slate-600 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {MONEDAS_DISPONIBLES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.simbolo} {m.value} — {m.label}
            </option>
          ))}
        </select>
      </div>

      {form.esMockup && form.rango_estimado && (
        <div className="mt-6 text-center">
          <p className="text-muted text-sm mb-2">Rango estimado (mockup)</p>
          <p className="text-ia text-3xl font-bold">
            {formatCurrency(form.rango_estimado.minimo_cop)} – {formatCurrency(form.rango_estimado.maximo_cop)}
          </p>
        </div>
      )}

      {error && <p className="text-danger text-sm mt-4 text-center">{error}</p>}

      <div className="mt-8 flex justify-center">
        <Button onClick={onConfirmar} loading={loading} className="px-8">
          {loading ? <Spinner size="sm" /> : 'Generar cotización'}
        </Button>
      </div>
    </div>
  );
}
