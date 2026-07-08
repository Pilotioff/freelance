import { useEffect, useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { adminApi } from '../api/admin.api';
import { PesosAgrupados, PesoSistema } from '../types';

export function Admin() {
  const [pesos, setPesos] = useState<PesosAgrupados | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState<PesoSistema | null>(null);
  const [nuevoValor, setNuevoValor] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [resaltado, setResaltado] = useState<string | null>(null);

  const cargar = () => {
    setLoading(true);
    adminApi
      .pesos()
      .then(setPesos)
      .catch(() => setError('Error al cargar pesos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const handleGuardar = async () => {
    if (!editando) return;
    const valor = parseFloat(nuevoValor);
    if (isNaN(valor)) return;

    setGuardando(true);
    try {
      await adminApi.actualizarPeso(editando.clave, valor);
      setResaltado(editando.clave);
      setTimeout(() => setResaltado(null), 2000);
      setEditando(null);
      cargar();
    } catch {
      setError('Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Administración">
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Administración">
      {error && <p className="text-danger mb-4">{error}</p>}

      {pesos && Object.entries(pesos).map(([categoria, items]) => (
        <Card key={categoria} className="mb-6">
          <h3 className="text-foreground font-semibold text-lg mb-4 capitalize">{categoria}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted border-b border-slate-700">
                  <th className="text-left py-3 pr-4">Clave</th>
                  <th className="text-left py-3 pr-4">Etiqueta</th>
                  <th className="text-right py-3 pr-4">Valor</th>
                  <th className="text-right py-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.map((peso) => (
                  <tr
                    key={peso.id}
                    className={`border-b border-slate-700/50 transition ${
                      resaltado === peso.clave ? 'bg-ia/10' : ''
                    }`}
                  >
                    <td className="py-3 pr-4 text-muted font-mono text-xs">{peso.clave}</td>
                    <td className="py-3 pr-4 text-foreground">{peso.etiqueta}</td>
                    <td className="py-3 pr-4 text-right text-foreground font-medium">{peso.valor}</td>
                    <td className="py-3 text-right">
                      <Button
                        variant="secondary"
                        className="text-xs py-1.5 px-3"
                        onClick={() => { setEditando(peso); setNuevoValor(String(peso.valor)); }}
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}

      <Modal
        open={!!editando}
        onClose={() => setEditando(null)}
        title={`Editar: ${editando?.etiqueta ?? ''}`}
      >
        <div className="space-y-4">
          <p className="text-muted text-sm font-mono">{editando?.clave}</p>
          <Input
            label="Nuevo valor"
            type="number"
            step="any"
            value={nuevoValor}
            onChange={(e) => setNuevoValor(e.target.value)}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setEditando(null)}>Cancelar</Button>
            <Button onClick={handleGuardar} loading={guardando}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
