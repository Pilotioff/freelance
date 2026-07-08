export type TipoProyecto = 'landing' | 'ecommerce' | 'webapp' | 'mobile' | 'api' | 'dashboard';
export type NivelDisenio = 'basico' | 'intermedio' | 'premium' | 'animado';
export type TiempoEntrega = '1semana' | '2semanas' | '1mes' | 'mas1mes';
export type Hosting = 'ninguno' | 'basico' | 'vps' | 'cloud';
export type Complejidad = 'baja' | 'media' | 'alta';
export type Rol = 'USER' | 'ADMIN';

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  empresa?: string;
  telefono?: string;
  tarifa_hora_cop?: number;
  avatar_url?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface RangoEstimado {
  minimo_cop: number;
  maximo_cop: number;
}

export interface ResultadoIA {
  tipo_proyecto: TipoProyecto;
  cantidad_paginas: number;
  nivel_disenio: NivelDisenio;
  tecnologias: string[];
  cantidad_desarrolladores: number;
  tiempo_entrega: TiempoEntrega;
  hosting: Hosting;
  complejidad_detectada: Complejidad;
  funcionalidades_clave: string[];
  supuestos: string[];
  confianza_estimacion: number;
  rango_estimado?: RangoEstimado;
}

export interface Cotizacion {
  id: string;
  usuario_id: string;
  nombre_proyecto: string;
  tipo_proyecto: string;
  cantidad_paginas: number;
  nivel_disenio: string;
  hosting: string;
  tiempo_entrega: string;
  cantidad_desarrolladores: number;
  horas_estimadas: number;
  costo_infraestructura: number;
  precio_final: number;
  complejidad: Complejidad;
  generado_por_ia: boolean;
  confianza_ia?: number;
  creado_en: string;
  tecnologias: { id: string; tecnologia: string }[];
}

export interface CrearCotizacionPayload {
  nombre_proyecto: string;
  tipo_proyecto: TipoProyecto;
  cantidad_paginas: number;
  nivel_disenio: NivelDisenio;
  tecnologias: string[];
  cantidad_desarrolladores: number;
  tiempo_entrega: TiempoEntrega;
  hosting: Hosting;
  generado_por_ia?: boolean;
  confianza_ia?: number;
}

export interface DashboardResumen {
  total_cotizaciones: number;
  precio_promedio: number;
  horas_totales: number;
  proyectos_mes: number;
  cotizaciones_por_mes: {
    mes: string;
    cantidad: number;
    total_precio: number;
  }[];
}

export interface TasasCambio {
  USD: number;
  EUR: number;
  GBP: number;
  JPY: number;
}

export interface ResultadoConversion {
  valor: number;
  monedaOrigen: string;
  monedaDestino: string;
  resultado: number;
  tasa: number;
}

export interface PesoSistema {
  id: string;
  clave: string;
  etiqueta: string;
  valor: number;
  categoria: string;
}

export type PesosAgrupados = Record<string, PesoSistema[]>;

export interface CotizacionFormState {
  nombre_proyecto: string;
  tipo_proyecto: TipoProyecto | '';
  cantidad_paginas: number;
  nivel_disenio: NivelDisenio;
  tecnologias: string[];
  cantidad_desarrolladores: number;
  tiempo_entrega: TiempoEntrega;
  hosting: Hosting;
  generado_por_ia: boolean;
  confianza_ia?: number;
  rango_estimado?: RangoEstimado;
  supuestos: string[];
  esMockup: boolean;
}

export const TIPOS_PROYECTO: { value: TipoProyecto; label: string; icon: string }[] = [
  { value: 'landing', label: 'Landing Page', icon: '🌐' },
  { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
  { value: 'webapp', label: 'Web App', icon: '💻' },
  { value: 'mobile', label: 'Mobile App', icon: '📱' },
  { value: 'api', label: 'API / Backend', icon: '⚙️' },
  { value: 'dashboard', label: 'Dashboard', icon: '📊' },
];

export const NIVELES_DISENIO: { value: NivelDisenio; label: string }[] = [
  { value: 'basico', label: 'Básico' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'premium', label: 'Premium' },
  { value: 'animado', label: 'Animado' },
];

export const HOSTING_OPTIONS: { value: Hosting; label: string; desc: string }[] = [
  { value: 'ninguno', label: 'Sin hosting', desc: 'Cliente provee infraestructura' },
  { value: 'basico', label: 'Básico', desc: 'Shared hosting' },
  { value: 'vps', label: 'VPS', desc: 'Servidor virtual dedicado' },
  { value: 'cloud', label: 'Cloud', desc: 'AWS / GCP / Azure' },
];

export const TIEMPOS_ENTREGA: { value: TiempoEntrega; label: string }[] = [
  { value: '1semana', label: '1 semana' },
  { value: '2semanas', label: '2 semanas' },
  { value: '1mes', label: '1 mes' },
  { value: 'mas1mes', label: 'Más de 1 mes' },
];

export const TECNOLOGIAS_SUGERIDAS = [
  'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Python', 'Django',
  'PostgreSQL', 'MongoDB', 'TypeScript', 'Tailwind', 'Flutter', 'React Native',
];
