import { CotizacionFormState } from '../types';

export interface ErroresPaso {
  tipo_proyecto?: string;
  nombre_proyecto?: string;
  hosting?: string;
  tiempo_entrega?: string;
}

export function validarPaso(paso: number, form: CotizacionFormState): ErroresPaso {
  const errores: ErroresPaso = {};

  if (paso === 2) {
    if (!form.tipo_proyecto) {
      errores.tipo_proyecto = 'Selecciona un tipo de proyecto';
    }
  }

  if (paso === 3) {
    if (!form.nombre_proyecto || !form.nombre_proyecto.trim()) {
      errores.nombre_proyecto = 'El nombre del proyecto es obligatorio';
    }
  }

  if (paso === 4) {
    if (!form.hosting) {
      errores.hosting = 'Selecciona una opción de hosting';
    }
    if (!form.tiempo_entrega) {
      errores.tiempo_entrega = 'Selecciona un tiempo de entrega';
    }
  }

  return errores;
}
