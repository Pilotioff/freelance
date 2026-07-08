import { CotizacionFormState } from '../types';

interface ReglaRecomendacion {
  aplica: (form: CotizacionFormState) => boolean;
  mensaje: string;
}

const REGLAS: ReglaRecomendacion[] = [
  {
    aplica: (f) =>
      f.tecnologias.includes('React') &&
      f.tecnologias.includes('Node.js') &&
      f.tecnologias.includes('PostgreSQL'),
    mensaje: 'Excelente stack para aplicaciones escalables.',
  },
  {
    aplica: (f) => f.tecnologias.includes('Flutter') && f.tecnologias.includes('Django'),
    mensaje: 'Buena combinación para aplicaciones móviles.',
  },
  {
    aplica: (f) =>
      f.tiempo_entrega === '1semana' &&
      ['erp', 'saas', 'marketplace', 'crm'].includes(f.tipo_proyecto as string),
    mensaje: 'El tiempo seleccionado podría requerir más desarrolladores.',
  },
  {
    aplica: (f) => f.tecnologias.includes('MongoDB') && f.tecnologias.includes('PostgreSQL'),
    mensaje: 'Usar dos bases de datos distintas añade complejidad de mantenimiento; confirma que sea necesario.',
  },
  {
    aplica: (f) => f.tipo_proyecto === 'ecommerce' && f.hosting === 'ninguno',
    mensaje: 'Un e-commerce sin hosting propio puede limitar el control sobre pagos y disponibilidad.',
  },
  {
    aplica: (f) => f.cantidad_desarrolladores === 1 && f.tiempo_entrega === '1semana',
    mensaje: 'Un solo desarrollador con entrega en 1 semana es un riesgo alto de cronograma.',
  },
  {
    aplica: (f) => f.tecnologias.includes('Next.js') && f.tipo_proyecto === 'landing',
    mensaje: 'Next.js es una excelente opción para landings con buen SEO.',
  },
];

export function obtenerRecomendaciones(form: CotizacionFormState): string[] {
  return REGLAS.filter((regla) => regla.aplica(form)).map((regla) => regla.mensaje);
}
