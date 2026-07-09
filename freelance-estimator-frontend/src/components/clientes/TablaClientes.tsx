import { Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import { ClienteConMetricas, FiltrosClientes, PERFILES_CLIENTE } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface TablaClientesProps {
  clientes: ClienteConMetricas[];
  total: number;
  loading: boolean;
  filtros: FiltrosClientes;
  busquedaInput: string;
  onBusquedaChange: (valor: string) => void;
  onFiltroChange: (cambios: Partial<FiltrosClientes>) => void;
  onOrdenChange: (campo: FiltrosClientes['ordenarPor']) => void;
  onPaginaChange: (pagina: number) => void;
  onSeleccionar: (cliente: ClienteConMetricas) => void;
}

const COLUMNAS_ORDENABLES: { campo: FiltrosClientes['ordenarPor']; label: string }[] = [
  { campo: 'nombre', label: 'Nombre' },
  { campo: 'creado_en', label: 'Creado' },
  { campo: 'valor_total_cotizado', label: 'Valor total' },
  { campo: 'ultima_cotizacion', label: 'Última cotización' },
];

export function TablaClientes({
  clientes,
  total,
  loading,
  filtros,
  busquedaInput,
  onBusquedaChange,
  onFiltroChange,
  onOrdenChange,
  onPaginaChange,
  onSeleccionar,
}: TablaClientesProps) {
  const pagina = filtros.pagina ?? 1;
  const porPagina = filtros.porPagina ?? 10;
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, empresa o correo..."
            value={busquedaInput}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-slate-600 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filtros.tipo_cliente ?? ''}
          onChange={(e) => onFiltroChange({ tipo_cliente: e.target.value || undefined })}
          className="px-4 py-2.5 bg-card border border-slate-600 rounded-lg text-foreground"
        >
          <option value="">Todos los tipos</option>
          {PERFILES_CLIENTE.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <select
          value={filtros.activo ?? ''}
          onChange={(e) => onFiltroChange({ activo: e.target.value || undefined })}
          className="px-4 py-2.5 bg-card border border-slate-600 rounded-lg text-foreground"
        >
          <option value="">Todos los estados</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : clientes.length === 0 ? (
        <p className="text-muted text-center py-20">No hay clientes que coincidan con la búsqueda</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-700/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-card text-muted text-left">
                  {COLUMNAS_ORDENABLES.slice(0, 1).map((col) => (
                    <th
                      key={col.campo}
                      className="px-4 py-3 font-medium cursor-pointer select-none whitespace-nowrap"
                      onClick={() => onOrdenChange(col.campo)}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        {filtros.ordenarPor === col.campo &&
                          (filtros.orden === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Empresa</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Correo</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Teléfono</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Ciudad</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">País</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap text-right">Cotizaciones</th>
                  <th
                    className="px-4 py-3 font-medium cursor-pointer select-none whitespace-nowrap text-right"
                    onClick={() => onOrdenChange('valor_total_cotizado')}
                  >
                    <span className="flex items-center gap-1 justify-end">
                      Valor total
                      {filtros.ordenarPor === 'valor_total_cotizado' &&
                        (filtros.orden === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </span>
                  </th>
                  <th
                    className="px-4 py-3 font-medium cursor-pointer select-none whitespace-nowrap"
                    onClick={() => onOrdenChange('ultima_cotizacion')}
                  >
                    <span className="flex items-center gap-1">
                      Última cotización
                      {filtros.ordenarPor === 'ultima_cotizacion' &&
                        (filtros.orden === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </span>
                  </th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Estado</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onSeleccionar(c)}
                    className="border-t border-slate-700/50 hover:bg-card cursor-pointer transition"
                  >
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{c.nombre} {c.apellido}</td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">{c.empresa || '—'}</td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">{c.correo || '—'}</td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">{c.telefono || '—'}</td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">{c.ciudad || '—'}</td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">{c.pais || '—'}</td>
                    <td className="px-4 py-3 text-foreground text-right whitespace-nowrap">{c.cantidad_cotizaciones}</td>
                    <td className="px-4 py-3 text-primary font-medium text-right whitespace-nowrap">
                      {formatCurrency(c.valor_total_cotizado)}
                    </td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {c.ultima_cotizacion ? new Date(c.ultima_cotizacion).toLocaleDateString('es-CO') : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge label={c.activo ? 'Activo' : 'Inactivo'} variant={c.activo ? 'success' : 'default'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-muted text-xs">
              {total} cliente{total !== 1 ? 's' : ''} · Página {pagina} de {totalPaginas}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPaginaChange(pagina - 1)}
                disabled={pagina <= 1}
                className="p-2 rounded-lg bg-card border border-slate-600 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => onPaginaChange(pagina + 1)}
                disabled={pagina >= totalPaginas}
                className="p-2 rounded-lg bg-card border border-slate-600 text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
