import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ModeSelector } from '../components/cotizador/ModeSelector';
import { IAUploader } from '../components/cotizador/IAUploader';
import { Step1Tipo } from '../components/cotizador/Step1Tipo';
import { Step2Detalles } from '../components/cotizador/Step2Detalles';
import { Step3Infraestructura } from '../components/cotizador/Step3Infraestructura';
import { Step4Resumen } from '../components/cotizador/Step4Resumen';
import { useCotizacion } from '../hooks/useCotizacion';
import { useIA } from '../hooks/useIA';
import { validarPaso } from '../utils/validarCotizador';

type Modo = 'seleccion' | 'manual' | 'ia';
type Paso = 0 | 1 | 2 | 3 | 4;

const PASOS_LABELS = ['Modo', 'Tipo', 'Detalles', 'Infra', 'Resumen'];

export function Cotizador() {
  const [modo, setModo] = useState<Modo>('seleccion');
  const [paso, setPaso] = useState<Paso>(0);
  const { form, updateForm, resetForm, crearCotizacion, loading, error, resultado } = useCotizacion();
  const ia = useIA();

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

  const pasoActual = modo === 'ia' && paso === 0 ? 0 : paso;
  const totalPasos = modo === 'ia' ? 5 : 4;
  const progreso = modo === 'seleccion' ? 0 : ((pasoActual) / (totalPasos - 1)) * 100;

  return (
    <AppLayout title="Cotizador">
      {modo !== 'seleccion' && (
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted mb-2">
            {PASOS_LABELS.slice(modo === 'ia' ? 0 : 1, modo === 'ia' ? 5 : 5).map((l, i) => (
              <span key={l} className={pasoActual >= (modo === 'ia' ? i : i + 1) ? 'text-primary' : ''}>
                {l}
              </span>
            ))}
          </div>
          <div className="h-1.5 bg-card rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>
      )}

      <Card className="max-w-3xl mx-auto">
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
    </AppLayout>
  );
}
