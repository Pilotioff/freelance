import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Pencil, Download } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { TarjetaPrincipal } from '../components/perfil/TarjetaPrincipal';
import { ResumenHabilidades } from '../components/perfil/ResumenHabilidades';
import { ListaTecnologias } from '../components/perfil/ListaTecnologias';
import { RecomendacionesPerfil } from '../components/perfil/RecomendacionesPerfil';
import { EstadisticasCard } from '../components/perfil/EstadisticasCard';
import { EditarTarifaModal } from '../components/perfil/EditarTarifaModal';
import { ActualizarEvaluacionModal } from '../components/perfil/ActualizarEvaluacionModal';
import { perfilProfesionalApi } from '../api/perfil-profesional.api';
import { PerfilProfesional as PerfilProfesionalType } from '../types';

export function PerfilProfesional() {
  const [perfil, setPerfil] = useState<PerfilProfesionalType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editarTarifaAbierto, setEditarTarifaAbierto] = useState(false);
  const [actualizarEvaluacionAbierto, setActualizarEvaluacionAbierto] = useState(false);

  const cargar = useCallback(() => {
    setLoading(true);
    perfilProfesionalApi
      .obtener()
      .then(setPerfil)
      .catch(() => setError('Error al cargar el perfil profesional'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <AppLayout
      title="Perfil Profesional"
      navbarExtra={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setActualizarEvaluacionAbierto(true)}>
            <RefreshCw size={14} /> Actualizar evaluación
          </Button>
          <Button variant="secondary" onClick={() => setEditarTarifaAbierto(true)}>
            <Pencil size={14} /> Editar valor por hora
          </Button>
          <Button variant="secondary" disabled title="Próximamente">
            <Download size={14} /> Exportar perfil
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error || !perfil ? (
        <p className="text-danger">{error ?? 'Sin datos'}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TarjetaPrincipal perfil={perfil} />
            <ResumenHabilidades categorias={perfil.promedio_por_categoria} />
            <ListaTecnologias tecnologias={perfil.tecnologias_evaluadas} />
          </div>
          <div className="space-y-6">
            <RecomendacionesPerfil recomendaciones={perfil.recomendaciones} />
            <EstadisticasCard estadisticas={perfil.estadisticas} />
          </div>
        </div>
      )}

      {perfil && (
        <>
          <EditarTarifaModal
            open={editarTarifaAbierto}
            onClose={() => setEditarTarifaAbierto(false)}
            perfil={perfil}
            onActualizado={cargar}
          />
          <ActualizarEvaluacionModal
            open={actualizarEvaluacionAbierto}
            onClose={() => setActualizarEvaluacionAbierto(false)}
            onActualizado={cargar}
          />
        </>
      )}
    </AppLayout>
  );
}
