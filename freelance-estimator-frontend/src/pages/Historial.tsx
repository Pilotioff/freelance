import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Badge, complejidadVariant } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { cotizacionesApi } from '../api/cotizaciones.api';
import { Cotizacion, Complejidad } from '../types';
import { formatCurrency } from '../utils/formatCurrency';

export function Historial() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroComplejidad, setFiltroComplejidad] = useState<Complejidad | ''>('');

  useEffect(() => {
    cotizacionesApi
      .listar(filtroComplejidad ? { complejidad: filtroComplejidad } : undefined)
      .then(setCotizaciones)
      .catch(() => setError('Error al cargar historial'))
      .finally(() => setLoading(false));
  }, [filtroComplejidad]);

  const filtradas = cotizaciones.filter((c) =>
    c.nombre_proyecto.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.tipo_proyecto.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <AppLayout title="Historial">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o tipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-slate-600 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filtroComplejidad}
          onChange={(e) => setFiltroComplejidad(e.target.value as Complejidad | '')}
          className="px-4 py-2.5 bg-card border border-slate-600 rounded-lg text-foreground"
        >
          <option value="">Todas las complejidades</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : filtradas.length === 0 ? (
        <p className="text-muted text-center py-20">No hay cotizaciones aún</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtradas.map((c) => (
            <Card key={c.id} className="hover:border-primary/50 transition">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-foreground font-semibold truncate flex-1">{c.nombre_proyecto}</h3>
                <Badge label={c.complejidad} variant={complejidadVariant(c.complejidad)} />
              </div>
              <p className="text-muted text-sm capitalize">{c.tipo_proyecto}</p>
              <p className="text-ia text-xl font-bold mt-3">{formatCurrency(c.precio_final)}</p>
              <div className="flex justify-between text-xs text-muted mt-3 pt-3 border-t border-slate-700">
                <span>{c.horas_estimadas}h estimadas</span>
                <span>{new Date(c.creado_en).toLocaleDateString('es-CO')}</span>
              </div>
              {c.generado_por_ia && (
                <span className="text-ia text-xs mt-2 block">✨ Generado por IA</span>
              )}
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
