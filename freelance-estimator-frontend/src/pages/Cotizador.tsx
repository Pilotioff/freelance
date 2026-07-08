import { useState } from 'react';
import { Layers, FileText, Server, CheckCircle2 } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ModeSelector } from '../components/cotizador/ModeSelector';
import { IAUploader } from '../components/cotizador/IAUploader';
import { Step1Tipo } from '../components/cotizador/Step1Tipo';
import { Step2Detalles } from '../components/cotizador/Step2Detalles';
import { Step3Infraestructura } from '../components/cotizador/Step3Infraestructura';
import { Step4Resumen } from '../components/cotizador/Step4Resumen';
import { Stepper } from '../components/cotizador/Stepper';
import { PanelResumenVivo } from '../components/cotizador/PanelResumenVivo';
import { useCotizacion } from '../hooks/useCotizacion';
import { useIA } from '../hooks/useIA';
import { useEstimacionViva } from '../hooks/useEstimacionViva';
import { validarPaso } from '../utils/validarCotizador';

type Modo = 'seleccion' | 'manual' | 'ia';
type Paso = 0 | 1 | 2 | 3 | 4;

const STEPPER_ITEMS = [
  { label: 'Tipo', icon: <Layers size={16} /> },
  { label: 'Detalles', icon: <FileText size={16} /> },
  { label: 'Infra', icon: <Server size={16} /> },
  { label: 'Resumen', icon: <CheckCircle2 size={16} /> },
];

export function Cotizador() {
  const [modo, setModo] = useState<Modo>('seleccion');
  const [paso, setPaso] = useState<Paso>(0);
  const { form, updateForm, resetForm, crearCotizacion, loading, error, resultado } = useCotizacion();
  const ia = useIA();
  const { estimacion, loading: estimando } = useEstimacionViva(form);

  const errores = validarPaso(paso, form);
  const pasoInvalido = Object.keys(errores).length > 0;

  const handleModeSelect = (mode: 'manual' | 'ia') => {
    setModo(mode);
    if (mode === 'manual') {
      setPaso(1);
    } else {
      setPaso(0);
    }
  };

  const handleAnalizar = async (file: File, tipo: 'documento' | 'mockup') => {
    const res = tipo === 'documento'
      ? await ia.analizarDocumento(file)
      : await ia.analizarMockup(file);

    if (res) {
      updateForm({
        tipo_proyecto: res.tipo_proyecto,
        cantidad_paginas: res.cantidad_paginas,
        nivel_disenio: res.nivel_disenio,
        tecnologias: res.tecnologias,
        cantidad_desarrolladores: res.cantidad_desarrolladores,
        tiempo_entrega: res.tiempo_entrega,
        hosting: res.hosting,
        generado_por_ia: true,
        confianza_ia: res.confianza_estimacion,
        supuestos: res.supuestos,
        rango_estimado: res.rango_estimado,
        esMockup: tipo === 'mockup',
      });
      setPaso(1);
    }
  };

  const mostrarPanel = modo !== 'seleccion' && !(modo === 'ia' && paso === 0);

  return (
    <AppLayout title="Cotizador">
      {modo !== 'seleccion' && !(modo === 'ia' && paso === 0) && paso >= 1 && (
        <div className="mb-8">
          <Stepper items={STEPPER_ITEMS} pasoActual={paso - 1} />
        </div>
      )}

      <div className={mostrarPanel ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}>
        <div className={mostrarPanel ? 'lg:col-span-2' : ''}>
          <Card className={mostrarPanel ? '' : 'max-w-3xl mx-auto'}>
            {modo === 'seleccion' && <ModeSelector onSelect={handleModeSelect} />}

            {modo === 'ia' && paso === 0 && (
              <IAUploader
                onAnalizar={handleAnalizar}
                loading={ia.loading}
                error={ia.error}
                resultado={ia.resultado}
              />
            )}

            {paso === 1 && (
              <Step1Tipo
                selected={form.tipo_proyecto}
                onSelect={(tipo) => updateForm({ tipo_proyecto: tipo })}
                sugeridoPorIA={form.generado_por_ia}
                error={errores.tipo_proyecto}
              />
            )}

            {paso === 2 && (
              <Step2Detalles
                nombreProyecto={form.nombre_proyecto}
                cantidadPaginas={form.cantidad_paginas}
                nivelDisenio={form.nivel_disenio}
                tecnologias={form.tecnologias}
                onChange={(data) => updateForm(data)}
                sugeridoPorIA={form.generado_por_ia}
                error={errores.nombre_proyecto}
              />
            )}

            {paso === 3 && (
              <Step3Infraestructura
                hosting={form.hosting}
                tiempoEntrega={form.tiempo_entrega}
                cantidadDesarrolladores={form.cantidad_desarrolladores}
                onChange={(data) => updateForm(data)}
                errores={{ hosting: errores.hosting, tiempo_entrega: errores.tiempo_entrega }}
              />
            )}

            {paso === 4 && (
              <Step4Resumen
                form={form}
                resultado={resultado}
                loading={loading}
                error={error}
                estimacion={estimacion}
                onConfirmar={crearCotizacion}
                onNueva={() => { resetForm(); ia.reset(); setModo('seleccion'); setPaso(0); }}
                onChangeMoneda={(moneda) => updateForm({ moneda_seleccionada: moneda })}
              />
            )}

            {modo !== 'seleccion' && paso < 4 && !(modo === 'ia' && paso === 0) && (
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (paso === 1) { setModo('seleccion'); setPaso(0); }
                    else setPaso((p) => (p - 1) as Paso);
                  }}
                >
                  Atrás
                </Button>
                <Button
                  onClick={() => setPaso((p) => (p + 1) as Paso)}
                  disabled={pasoInvalido}
                >
                  Siguiente
                </Button>
              </div>
            )}

            {modo === 'ia' && paso === 0 && ia.resultado && (
              <div className="flex justify-end mt-6 pt-6 border-t border-slate-700">
                <Button onClick={() => setPaso(1)}>Continuar con sugerencias</Button>
              </div>
            )}
          </Card>
        </div>

        {mostrarPanel && (
          <div>
            <PanelResumenVivo form={form} estimacion={estimacion} loading={estimando} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
