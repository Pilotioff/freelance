import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { EvaluacionEstrella } from '../onboarding/EvaluacionEstrella';
import { ResumenNivelDetectado } from '../onboarding/ResumenNivelDetectado';
import { useOnboarding } from '../../hooks/useOnboarding';
import {
  TECNOLOGIAS_EVALUACION,
  CATEGORIA_LABEL,
  Categoria,
} from '../../utils/tecnologiasEvaluacion';

interface ActualizarEvaluacionModalProps {
  open: boolean;
  onClose: () => void;
  onActualizado: () => void;
}

const CATEGORIAS_ORDEN: Categoria[] = ['frontend', 'backend', 'bd', 'devops', 'cloud', 'herramientas'];

export function ActualizarEvaluacionModal({ open, onClose, onActualizado }: ActualizarEvaluacionModalProps) {
  const {
    puntajes,
    calificar,
    completadas,
    totalTecnologias,
    listoParaEnviar,
    enviar,
    loading,
    error,
    resultado,
  } = useOnboarding();

  const handleContinuar = () => {
    onActualizado();
    onClose();
  };

  if (resultado) {
    return (
      <Modal open={open} onClose={handleContinuar} title="Evaluación actualizada" size="lg">
        <ResumenNivelDetectado resultado={resultado} onContinuar={handleContinuar} />
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Actualizar evaluación de experiencia" size="lg">
      <div className="flex justify-between items-center mb-4">
        <span className="text-muted text-xs">{completadas} de {totalTecnologias} calificadas</span>
        <div className="flex-1 mx-4 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(completadas / totalTecnologias) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-6">
        {CATEGORIAS_ORDEN.map((categoria) => (
          <div key={categoria}>
            <h4 className="text-primary text-sm font-semibold mb-1">{CATEGORIA_LABEL[categoria]}</h4>
            <div>
              {TECNOLOGIAS_EVALUACION.filter((t) => t.categoria === categoria).map((tec) => (
                <EvaluacionEstrella
                  key={tec.clave}
                  label={tec.label}
                  valor={puntajes[tec.clave]}
                  onChange={(valor) => calificar(tec.clave, valor)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-danger text-sm mt-4 text-center">{error}</p>}

      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <Button onClick={enviar} disabled={!listoParaEnviar} loading={loading} className="w-full">
          {listoParaEnviar ? 'Guardar evaluación actualizada' : `Faltan ${totalTecnologias - completadas} tecnologías`}
        </Button>
      </div>
    </Modal>
  );
}
