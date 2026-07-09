import { Card } from '../ui/Card';
import { EstadisticasPerfil } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface EstadisticasCardProps {
  estadisticas: EstadisticasPerfil;
}

export function EstadisticasCard({ estadisticas }: EstadisticasCardProps) {
  return (
    <Card>
      <h3 className="text-foreground font-semibold mb-4">Estadísticas</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-muted text-xs">Cotizaciones realizadas</p>
          <p className="text-foreground text-lg font-bold">{estadisticas.cotizaciones_realizadas}</p>
        </div>
        <div>
          <p className="text-muted text-xs">Valor promedio</p>
          <p className="text-foreground text-lg font-bold">{formatCurrency(estadisticas.valor_promedio)}</p>
        </div>
        <div>
          <p className="text-muted text-xs">Clientes</p>
          <p className="text-foreground text-lg font-bold">{estadisticas.cantidad_clientes}</p>
        </div>
        <div>
          <p className="text-muted text-xs">Proyecto más costoso</p>
          <p className="text-foreground text-sm font-bold truncate">
            {estadisticas.proyecto_mas_costoso
              ? formatCurrency(estadisticas.proyecto_mas_costoso.precio_final)
              : '—'}
          </p>
          {estadisticas.proyecto_mas_costoso && (
            <p className="text-muted text-xs truncate">{estadisticas.proyecto_mas_costoso.nombre_proyecto}</p>
          )}
        </div>
      </div>

      {estadisticas.tecnologias_mas_usadas.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <p className="text-muted text-xs mb-2">Tecnologías más utilizadas</p>
          <div className="flex flex-wrap gap-1.5">
            {estadisticas.tecnologias_mas_usadas.map((t) => (
              <span key={t.tecnologia} className="text-xs bg-background text-foreground px-2 py-1 rounded-full">
                {t.tecnologia} ({t.cantidad})
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
