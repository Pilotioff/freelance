export type Arquetipo = 'contenido' | 'backend_heavy' | 'fullstack';

export const ARQUETIPO_POR_TIPO: Record<string, Arquetipo> = {
  landing: 'contenido',
  blog: 'contenido',
  portafolio: 'contenido',

  api: 'backend_heavy',
  erp: 'backend_heavy',
  microservicios: 'backend_heavy',
  sistema_interno: 'backend_heavy',
  sistema_administrativo: 'backend_heavy',
  automatizacion: 'backend_heavy',
  ia: 'backend_heavy',

  ecommerce: 'fullstack',
  webapp: 'fullstack',
  mobile: 'fullstack',
  dashboard: 'fullstack',
  crm: 'fullstack',
  marketplace: 'fullstack',
  saas: 'fullstack',
  chat: 'fullstack',
  pos: 'fullstack',
  lms: 'fullstack',
};

export function obtenerArquetipo(tipoProyecto: string): Arquetipo {
  return ARQUETIPO_POR_TIPO[tipoProyecto] ?? 'fullstack';
}
