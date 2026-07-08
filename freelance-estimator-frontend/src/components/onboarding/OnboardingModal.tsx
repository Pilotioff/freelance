import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { EvaluacionEstrella } from './EvaluacionEstrella';
import { ResumenNivelDetectado } from './ResumenNivelDetectado';
import { useOnboarding } from '../../hooks/useOnboarding';
import {
  TECNOLOGIAS_EVALUACION,
  CATEGORIA_LABEL,
  Categoria,
} from '../../utils/tecnologiasEvaluacion';

interface OnboardingModalProps {
  onCompletado: () => void;
}

const CATEGORIAS_ORDEN: Categoria[] = ['frontend', 'backend', 'bd', 'devops', 'cloud', 'herramientas'];

export function OnboardingModal({ onCompletado }: OnboardingModalProps) {
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

  if (resultado) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center p-4 z-50 overflow-y-auto">
        <Card padding="lg" className="w-full max-w-md my-8">
          <ResumenNivelDetectado resultado={resultado} onContinuar={onCompletado} />
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card padding="lg" className="w-full max-w-2xl my-8">
        <div className="text-center mb-6">
          <h2 className="text-foreground text-2xl font-bold">Cuéntanos sobre tu experiencia</h2>
          <p className="text-muted text-sm mt-2">
            Esta evaluación nos permitirá calcular automáticamente un valor por hora mucho más
            preciso para tus futuras cotizaciones.
          </p>
        </div>

        <div className="flex justify-between items-center mb-4 sticky top-0 bg-card py-2">
          <span className="text-muted text-xs">
            {completadas} de {totalTecnologias} calificadas
          </span>
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
              <h3 className="text-primary text-sm font-semibold mb-1">{CATEGORIA_LABEL[categoria]}</h3>
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
          <Button
            onClick={enviar}
            disabled={!listoParaEnviar}
            loading={loading}
            className="w-full"
          >
            {listoParaEnviar ? 'Finalizar evaluación' : `Faltan ${totalTecnologias - completadas} tecnologías`}
          </Button>
        </div>
      </Card>
    </div>
  );
}
