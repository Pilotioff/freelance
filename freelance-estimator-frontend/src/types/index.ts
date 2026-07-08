export type TipoProyecto =
  | 'landing' | 'ecommerce' | 'webapp' | 'mobile' | 'api' | 'dashboard'
  | 'crm' | 'erp' | 'marketplace' | 'saas' | 'sistema_interno' | 'blog'
  | 'portafolio' | 'chat' | 'automatizacion' | 'pos' | 'lms' | 'ia'
  | 'microservicios' | 'sistema_administrativo';
export type NivelDisenio = 'basico' | 'intermedio' | 'premium' | 'animado';
export type TiempoEntrega = '1semana' | '2semanas' | '1mes' | 'mas1mes';
export type Hosting = 'ninguno' | 'basico' | 'vps' | 'cloud';
export type Complejidad = 'baja' | 'media' | 'alta';
export type Rol = 'USER' | 'ADMIN';
export type Moneda = 'COP' | 'USD' | 'EUR' | 'GBP' | 'JPY';
export type PerfilCliente =
  | 'estudiante' | 'freelancer' | 'emprendedor' | 'startup'
  | 'empresa_pequena' | 'empresa_mediana' | 'empresa_grande' | 'gobierno' | 'ong';
export type TarifaPreferida = 'manual' | 'sugerida';

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
  onboarding_completado: boolean;
  tarifa_hora_sugerida?: number;
  tarifa_preferida?: TarifaPreferida;
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
  moneda_seleccionada: string;
  precio_convertido?: number | null;
  tasa_cambio_usada?: number | null;
  perfil_cliente: string;
  margen_aplicado: number;
  costo_diseno?: number | null;
  costo_frontend?: number | null;
  costo_backend?: number | null;
  costo_bd?: number | null;
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
  moneda_seleccionada?: Moneda;
  perfil_cliente: PerfilCliente;
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
  tiempo_entrega: TiempoEntrega | '';
  hosting: Hosting | '';
  generado_por_ia: boolean;
  confianza_ia?: number;
  rango_estimado?: RangoEstimado;
  supuestos: string[];
  esMockup: boolean;
  moneda_seleccionada: Moneda;
  perfil_cliente: PerfilCliente | '';
}

export const TIPOS_PROYECTO: { value: TipoProyecto; label: string; icon: string }[] = [
  { value: 'landing', label: 'Landing Page', icon: '🌐' },
  { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
  { value: 'webapp', label: 'Web App', icon: '💻' },
  { value: 'mobile', label: 'Mobile App', icon: '📱' },
  { value: 'api', label: 'API / Backend', icon: '⚙️' },
  { value: 'dashboard', label: 'Dashboard', icon: '📊' },
  { value: 'crm', label: 'CRM', icon: '🤝' },
  { value: 'erp', label: 'ERP', icon: '🏭' },
  { value: 'marketplace', label: 'Marketplace', icon: '🛍️' },
  { value: 'saas', label: 'SaaS', icon: '☁️' },
  { value: 'sistema_interno', label: 'Sistema interno', icon: '🗂️' },
  { value: 'blog', label: 'Blog', icon: '📝' },
  { value: 'portafolio', label: 'Portafolio', icon: '🎨' },
  { value: 'chat', label: 'Chat', icon: '💬' },
  { value: 'automatizacion', label: 'Automatización', icon: '🤖' },
  { value: 'pos', label: 'POS', icon: '🧾' },
  { value: 'lms', label: 'LMS', icon: '🎓' },
  { value: 'ia', label: 'IA', icon: '🧠' },
  { value: 'microservicios', label: 'Microservicios', icon: '🧩' },
  { value: 'sistema_administrativo', label: 'Sistema administrativo', icon: '📋' },
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

export const MONEDAS_DISPONIBLES: { value: Moneda; label: string; simbolo: string }[] = [
  { value: 'COP', label: 'Peso Colombiano', simbolo: '$' },
  { value: 'USD', label: 'Dólar Americano', simbolo: '$' },
  { value: 'EUR', label: 'Euro', simbolo: '€' },
  { value: 'GBP', label: 'Libra Esterlina', simbolo: '£' },
  { value: 'JPY', label: 'Yen Japonés', simbolo: '¥' },
];

export const PERFILES_CLIENTE: { value: PerfilCliente; label: string }[] = [
  { value: 'estudiante', label: 'Estudiante' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'emprendedor', label: 'Emprendedor' },
  { value: 'startup', label: 'Startup' },
  { value: 'empresa_pequena', label: 'Empresa pequeña' },
  { value: 'empresa_mediana', label: 'Empresa mediana' },
  { value: 'empresa_grande', label: 'Empresa grande' },
  { value: 'gobierno', label: 'Gobierno' },
  { value: 'ong', label: 'ONG' },
];

export interface ResultadoEvaluacion {
  nivel_detectado: string;
  promedio_general: number;
  promedio_por_categoria: Record<string, number>;
  tarifa_sugerida_cop: number;
  fortalezas: string[];
  areas_mejora: string[];
  confianza: number;
}
