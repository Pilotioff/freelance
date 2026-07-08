import { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { dashboardApi } from '../api/dashboard.api';
import { divisasApi } from '../api/divisas.api';
import { DashboardResumen } from '../types';
import { formatCurrency } from '../utils/formatCurrency';

export function Dashboard() {
  const [resumen, setResumen] = useState<DashboardResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [valorConvertir, setValorConvertir] = useState('1000000');
  const [monedaDestino, setMonedaDestino] = useState('USD');
  const [resultadoConversion, setResultadoConversion] = useState<number | null>(null);
  const [convirtiendo, setConvirtiendo] = useState(false);

  useEffect(() => {
    dashboardApi
      .resumen()
      .then(setResumen)
      .catch(() => setError('Error al cargar el dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const convertir = useCallback(async (valor: string, destino: string) => {
    const num = parseFloat(valor);
    if (isNaN(num) || num <= 0) {
      setResultadoConversion(null);
      return;
    }
    setConvirtiendo(true);
    try {
      const res = await divisasApi.convertir(num, 'COP', destino);
      setResultadoConversion(res.resultado);
    } catch {
      setResultadoConversion(null);
    } finally {
      setConvirtiendo(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      convertir(valorConvertir, monedaDestino);
    }, 400);
    return () => clearTimeout(timer);
  }, [valorConvertir, monedaDestino, convertir]);

  if (loading) {
    return (
      <AppLayout title="Dashboard">
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (error || !resumen) {
    return (
      <AppLayout title="Dashboard">
        <p className="text-danger">{error ?? 'Sin datos'}</p>
      </AppLayout>
    );
  }

  const metricas = [
    { label: 'Total cotizaciones', value: resumen.total_cotizaciones.toString() },
    { label: 'Precio promedio', value: formatCurrency(resumen.precio_promedio) },
    { label: 'Horas totales', value: `${resumen.horas_totales}h` },
    { label: 'Proyectos este mes', value: resumen.proyectos_mes.toString() },
  ];

  return (
    <AppLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {metricas.map((m) => (
          <Card key={m.label}>
            <p className="text-muted text-sm">{m.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{m.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-foreground font-semibold mb-4">Cotizaciones por mes</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={resumen.cotizaciones_por_mes}>
              <XAxis dataKey="mes" tick={{ fill: '#A1A1AA', fontSize: 12 }} />
              <YAxis tick={{ fill: '#A1A1AA', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#18181B', border: '1px solid #3F3F46', borderRadius: 8 }}
                labelStyle={{ color: '#FFFFFF' }}
                cursor={{ fill: 'rgba(245, 183, 0, 0.1)' }}
              />
              <Bar dataKey="cantidad" fill="#F5B700" radius={[4, 4, 0, 0]} activeBar={{ fill: '#FB923C' }} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-foreground font-semibold mb-4">Conversor de divisas</h3>
          <div className="space-y-4">
            <Input
              label="Valor en COP"
              type="number"
              value={valorConvertir}
              onChange={(e) => setValorConvertir(e.target.value)}
            />
            <div>
              <label className="text-sm font-medium text-muted">Convertir a</label>
              <select
                value={monedaDestino}
                onChange={(e) => setMonedaDestino(e.target.value)}
                className="w-full mt-1.5 px-4 py-2.5 bg-background border border-slate-600 rounded-lg text-foreground"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
            {convirtiendo ? (
              <Spinner size="sm" />
            ) : resultadoConversion !== null ? (
              <p className="text-ia text-2xl font-bold">
                {formatCurrency(resultadoConversion, monedaDestino)}
              </p>
            ) : null}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
