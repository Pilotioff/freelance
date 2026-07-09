import { useEffect, useState } from 'react';
import { Pencil, Trash2, Building2, Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { clientesApi } from '../../api/clientes.api';
import { DetalleCliente, PERFILES_CLIENTE } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface PerfilClienteModalProps {
  clienteId: string | null;
  onClose: () => void;
  onEditar: (cliente: DetalleCliente) => void;
  onEliminado: () => void;
}

export function PerfilClienteModal({ clienteId, onClose, onEditar, onEliminado }: PerfilClienteModalProps) {
  const [detalle, setDetalle] = useState<DetalleCliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    if (!clienteId) {
      setDetalle(null);
      setConfirmandoEliminar(false);
      return;
    }
    setLoading(true);
    clientesApi
      .obtenerPorId(clienteId)
      .then(setDetalle)
      .finally(() => setLoading(false));
  }, [clienteId]);

  const handleEliminar = async () => {
    if (!clienteId) return;
    setEliminando(true);
    try {
      await clientesApi.eliminar(clienteId);
      onEliminado();
      onClose();
    } finally {
      setEliminando(false);
    }
  };

  const tipoLabel = detalle
    ? PERFILES_CLIENTE.find((p) => p.value === detalle.tipo_cliente)?.label ?? detalle.tipo_cliente
    : '';

  return (
    <Modal open={!!clienteId} onClose={onClose} title={detalle ? `${detalle.nombre} ${detalle.apellido}` : 'Cliente'} size="lg">
      {loading || !detalle ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto space-y-6 pr-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2">
              <Badge label={tipoLabel} variant="ia" />
              <Badge label={detalle.activo ? 'Activo' : 'Inactivo'} variant={detalle.activo ? 'success' : 'default'} />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => onEditar(detalle)}>
                <Pencil size={14} /> Editar
              </Button>
              <Button variant="danger" onClick={() => setConfirmandoEliminar(true)}>
                <Trash2 size={14} /> Eliminar
              </Button>
            </div>
          </div>

          {confirmandoEliminar && (
            <div className="bg-danger/10 border border-danger/30 rounded-lg p-4">
              <p className="text-foreground text-sm mb-3">
                ¿Eliminar a <strong>{detalle.nombre} {detalle.apellido}</strong>? Sus cotizaciones ya
                realizadas no se borrarán, solo quedarán sin cliente asociado. Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <Button variant="danger" onClick={handleEliminar} loading={eliminando}>
                  Sí, eliminar
                </Button>
                <Button variant="ghost" onClick={() => setConfirmandoEliminar(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-muted text-sm font-medium mb-3">Información general</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {detalle.empresa && (
                <div className="flex items-center gap-2 text-foreground">
                  <Building2 size={14} className="text-muted" /> {detalle.empresa}
                </div>
              )}
              {detalle.correo && (
                <div className="flex items-center gap-2 text-foreground">
                  <Mail size={14} className="text-muted" /> {detalle.correo}
                </div>
              )}
              {detalle.telefono && (
                <div className="flex items-center gap-2 text-foreground">
                  <Phone size={14} className="text-muted" /> {detalle.telefono}
                </div>
              )}
              {(detalle.ciudad || detalle.pais) && (
                <div className="flex items-center gap-2 text-foreground">
                  <MapPin size={14} className="text-muted" />
                  {[detalle.ciudad, detalle.pais].filter(Boolean).join(', ')}
                </div>
              )}
              {detalle.sitio_web && (
                <a href={detalle.sitio_web} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                  <Globe size={14} /> Sitio web
                </a>
              )}
              {detalle.linkedin && (
                <a href={detalle.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                  <Linkedin size={14} /> LinkedIn
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-background rounded-lg p-3">
              <p className="text-muted text-xs">Cotizaciones</p>
              <p className="text-foreground text-lg font-bold">{detalle.cantidad_cotizaciones}</p>
            </div>
            <div className="bg-background rounded-lg p-3">
              <p className="text-muted text-xs">Valor total</p>
              <p className="text-primary text-lg font-bold">{formatCurrency(detalle.valor_total_cotizado)}</p>
            </div>
            <div className="bg-background rounded-lg p-3">
              <p className="text-muted text-xs">Promedio/proyecto</p>
              <p className="text-foreground text-lg font-bold">{formatCurrency(detalle.promedio_por_proyecto)}</p>
            </div>
            <div className="bg-background rounded-lg p-3">
              <p className="text-muted text-xs">Última actividad</p>
              <p className="text-foreground text-sm font-medium mt-1">
                {detalle.ultima_cotizacion ? new Date(detalle.ultima_cotizacion).toLocaleDateString('es-CO') : '—'}
              </p>
            </div>
          </div>

          {detalle.tecnologias_mas_usadas.length > 0 && (
            <div>
              <h4 className="text-muted text-sm font-medium mb-2">Tecnologías más utilizadas</h4>
              <div className="flex flex-wrap gap-2">
                {detalle.tecnologias_mas_usadas.map((t) => (
                  <Badge key={t.tecnologia} label={`${t.tecnologia} (${t.cantidad})`} variant="default" />
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-muted text-sm font-medium mb-2">Cotizaciones realizadas</h4>
            {detalle.cotizaciones.length === 0 ? (
              <p className="text-muted text-sm">Sin cotizaciones aún.</p>
            ) : (
              <div className="space-y-2">
                {detalle.cotizaciones.map((c) => (
                  <div key={c.id} className="flex justify-between items-center bg-background rounded-lg px-3 py-2 text-sm">
                    <span className="text-foreground">{c.nombre_proyecto}</span>
                    <span className="text-primary font-medium">{formatCurrency(c.precio_final)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {detalle.observaciones && (
            <div>
              <h4 className="text-muted text-sm font-medium mb-2">Notas</h4>
              <p className="text-foreground text-sm bg-background rounded-lg p-3">{detalle.observaciones}</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
