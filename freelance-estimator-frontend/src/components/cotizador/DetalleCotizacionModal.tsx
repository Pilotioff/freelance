import { Modal } from '../ui/Modal';
import { Badge, complejidadVariant } from '../ui/Badge';
import { Cotizacion, TIPOS_PROYECTO, HOSTING_OPTIONS, TIEMPOS_ENTREGA } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { DesgloseTabla } from './DesgloseTabla';
import { ComparacionMercado } from './ComparacionMercado';
import { BotonExportar } from './BotonExportar';

interface DetalleCotizacionModalProps {
  cotizacion: Cotizacion | null;
  onClose: () => void;
}

export function DetalleCotizacionModal({ cotizacion, onClose }: DetalleCotizacionModalProps) {
  if (!cotizacion) return null;

  const tipoLabel = TIPOS_PROYECTO.find((t) => t.value === cotizacion.tipo_proyecto)?.label ?? cotizacion.tipo_proyecto;
  const hostingLabel = HOSTING_OPTIONS.find((h) => h.value === cotizacion.hosting)?.label ?? cotizacion.hosting;
  const tiempoLabel = TIEMPOS_ENTREGA.find((t) => t.value === cotizacion.tiempo_entrega)?.label ?? cotizacion.tiempo_entrega;
  const hayConversion = cotizacion.moneda_seleccionada !== 'COP' && cotizacion.precio_convertido != null;

  const desglose = {
    diseno: cotizacion.costo_diseno ?? 0,
    frontend: cotizacion.costo_frontend ?? 0,
    backend: cotizacion.costo_backend ?? 0,
    bd: cotizacion.costo_bd ?? 0,
    infra: cotizacion.costo_infraestructura,
    margen: cotizacion.margen_aplicado,
    total: cotizacion.precio_final,
  };

  return (
    <Modal open={!!cotizacion} onClose={onClose} title={cotizacion.nombre_proyecto}>
      <div className="max-h-[70vh] overflow-y-auto space-y-6 pr-1">
        <div className="text-center">
          <p className="text-ia text-3xl font-bold">
            {hayConversion
              ? formatCurrency(cotizacion.precio_convertido as number, cotizacion.moneda_seleccionada)
              : formatCurrency(cotizacion.precio_final)}
          </p>
          {hayConversion && (
            <p className="text-muted text-xs mt-1">
              Equivale a {formatCurrency(cotizacion.precio_final)} COP
            </p>
          )}
          <div className="flex justify-center gap-2 mt-2">
            <Badge label={cotizacion.complejidad} variant={complejidadVariant(cotizacion.complejidad)} />
            {cotizacion.generado_por_ia && <Badge label="✨ Generado por IA" variant="ia" />}
          </div>
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Tipo de proyecto</dt>
            <dd className="text-foreground">{tipoLabel}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Hosting</dt>
            <dd className="text-foreground">{hostingLabel}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Tiempo de entrega</dt>
            <dd className="text-foreground">{tiempoLabel}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Horas estimadas</dt>
            <dd className="text-foreground">{cotizacion.horas_estimadas}h</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Desarrolladores</dt>
            <dd className="text-foreground">{cotizacion.cantidad_desarrolladores}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Fecha</dt>
            <dd className="text-foreground">{new Date(cotizacion.creado_en).toLocaleDateString('es-CO')}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Tecnologías</dt>
            <dd className="text-foreground text-right">
              {cotizacion.tecnologias.map((t) => t.tecnologia).join(', ') || '—'}
            </dd>
          </div>
        </dl>

        <div>
          <h4 className="text-muted text-sm font-medium mb-3">Desglose del costo</h4>
          <DesgloseTabla desglose={desglose} />
        </div>

        <ComparacionMercado resultado={cotizacion} cantidadDesarrolladores={cotizacion.cantidad_desarrolladores} />

        <div className="flex justify-center pt-2 border-t border-slate-700/50">
          <BotonExportar cotizacionId={cotizacion.id} />
        </div>
      </div>
    </Modal>
  );
}
