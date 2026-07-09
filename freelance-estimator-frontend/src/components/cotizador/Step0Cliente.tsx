import { useState, useEffect } from 'react';
import { Search, UserPlus, Check, X } from 'lucide-react';
import { clientesApi } from '../../api/clientes.api';
import { Cliente, ClienteConMetricas, PERFILES_CLIENTE } from '../../types';
import { FormularioClienteModal } from '../clientes/FormularioClienteModal';

interface Step0ClienteProps {
  clienteId?: string;
  clienteNombre?: string;
  onSeleccionar: (cliente: Cliente | null) => void;
}

export function Step0Cliente({ clienteId, clienteNombre, onSeleccionar }: Step0ClienteProps) {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<ClienteConMetricas[]>([]);
  const [loading, setLoading] = useState(false);
  const [formularioAbierto, setFormularioAbierto] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      clientesApi
        .listar({ busqueda, activo: 'true', porPagina: 8 })
        .then((res) => setResultados(res.clientes))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [busqueda]);

  const handleClienteCreado = (cliente: Cliente) => {
    onSeleccionar(cliente);
  };

  if (clienteId) {
    const tipoLabel = PERFILES_CLIENTE.find((p) => p.value === resultados.find((r) => r.id === clienteId)?.tipo_cliente)?.label;
    return (
      <div>
        <h3 className="text-foreground font-semibold text-lg mb-4">Cliente</h3>
        <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/30 rounded-xl">
          <div className="flex items-center gap-2">
            <Check size={18} className="text-primary" />
            <div>
              <p className="text-foreground font-medium">{clienteNombre}</p>
              {tipoLabel && <p className="text-muted text-xs">{tipoLabel}</p>}
            </div>
          </div>
          <button
            onClick={() => onSeleccionar(null)}
            className="text-muted hover:text-danger transition"
            aria-label="Quitar cliente seleccionado"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-muted text-xs mt-3">
          El margen de precio se calculará automáticamente según el tipo de este cliente.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-foreground font-semibold text-lg mb-1">Cliente</h3>
      <p className="text-muted text-sm mb-4">
        Selecciona un cliente existente o continúa sin asignar uno (opcional).
      </p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
        <input
          type="text"
          placeholder="Buscar cliente por nombre, empresa o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-background border border-slate-600 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        onClick={() => setFormularioAbierto(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-4 rounded-lg border-2 border-dashed border-slate-600 text-muted hover:text-primary hover:border-primary transition text-sm"
      >
        <UserPlus size={16} /> Crear cliente nuevo
      </button>

      {loading ? (
        <p className="text-muted text-sm text-center py-4">Buscando...</p>
      ) : resultados.length === 0 ? (
        <p className="text-muted text-sm text-center py-4">
          {busqueda ? 'No se encontraron clientes.' : 'No tienes clientes registrados aún.'}
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {resultados.map((c) => (
            <button
              key={c.id}
              onClick={() => onSeleccionar(c)}
              className="w-full flex items-center justify-between p-3 bg-card border border-slate-700/50 rounded-lg hover:border-primary/50 transition text-left"
            >
              <div>
                <p className="text-foreground text-sm font-medium">{c.nombre} {c.apellido}</p>
                <p className="text-muted text-xs">{c.empresa || c.correo || 'Sin datos adicionales'}</p>
              </div>
              <span className="text-muted text-xs">{c.cantidad_cotizaciones} cotizaciones</span>
            </button>
          ))}
        </div>
      )}

      <FormularioClienteModal
        open={formularioAbierto}
        onClose={() => setFormularioAbierto(false)}
        onGuardado={handleClienteCreado}
        clienteEditar={null}
      />
    </div>
  );
}
