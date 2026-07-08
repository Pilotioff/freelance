export type TipoProyecto = 'landing' | 'ecommerce' | 'webapp' | 'mobile' | 'api' | 'dashboard';
export type NivelDisenio = 'basico' | 'intermedio' | 'premium' | 'animado';
export type TiempoEntrega = '1semana' | '2semanas' | '1mes' | 'mas1mes';
export type Hosting = 'ninguno' | 'basico' | 'vps' | 'cloud';
export type Complejidad = 'baja' | 'media' | 'alta';

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

const TIPOS_PROYECTO: TipoProyecto[] = ['landing', 'ecommerce', 'webapp', 'mobile', 'api', 'dashboard'];
const NIVELES_DISENIO: NivelDisenio[] = ['basico', 'intermedio', 'premium', 'animado'];
const TIEMPOS_ENTREGA: TiempoEntrega[] = ['1semana', '2semanas', '1mes', 'mas1mes'];
const HOSTING_OPTIONS: Hosting[] = ['ninguno', 'basico', 'vps', 'cloud'];
const COMPLEJIDADES: Complejidad[] = ['baja', 'media', 'alta'];

function isStringArray(value: unknown, maxLength?: number): value is string[] {
  if (!Array.isArray(value)) return false;
  if (!value.every((v) => typeof v === 'string')) return false;
  if (maxLength !== undefined && value.length > maxLength) return false;
  return true;
}

function isInList<T extends string>(value: unknown, list: T[]): value is T {
  return typeof value === 'string' && (list as string[]).includes(value);
}

export function validateResultadoIA(data: unknown, esMockup = false): ResultadoIA {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Resultado IA inválido: no es un objeto');
  }

  const obj = data as Record<string, unknown>;

  if (!isInList(obj.tipo_proyecto, TIPOS_PROYECTO)) {
    throw new Error('tipo_proyecto inválido');
  }
  if (typeof obj.cantidad_paginas !== 'number' || obj.cantidad_paginas < 1 || obj.cantidad_paginas > 50) {
    throw new Error('cantidad_paginas inválida');
  }
  if (!isInList(obj.nivel_disenio, NIVELES_DISENIO)) {
    throw new Error('nivel_disenio inválido');
  }
  if (!isStringArray(obj.tecnologias)) {
    throw new Error('tecnologias inválidas');
  }
  if (typeof obj.cantidad_desarrolladores !== 'number' || obj.cantidad_desarrolladores < 1 || obj.cantidad_desarrolladores > 10) {
    throw new Error('cantidad_desarrolladores inválida');
  }
  if (!isInList(obj.tiempo_entrega, TIEMPOS_ENTREGA)) {
    throw new Error('tiempo_entrega inválido');
  }
  if (!isInList(obj.hosting, HOSTING_OPTIONS)) {
    throw new Error('hosting inválido');
  }
  if (!isInList(obj.complejidad_detectada, COMPLEJIDADES)) {
    throw new Error('complejidad_detectada inválida');
  }
  if (!isStringArray(obj.funcionalidades_clave, 5)) {
    throw new Error('funcionalidades_clave inválidas');
  }
  if (!isStringArray(obj.supuestos) || obj.supuestos.length === 0) {
    throw new Error('supuestos no puede estar vacío');
  }
  if (typeof obj.confianza_estimacion !== 'number' || obj.confianza_estimacion < 0 || obj.confianza_estimacion > 1) {
    throw new Error('confianza_estimacion inválida');
  }
  if (esMockup && obj.confianza_estimacion > 0.65) {
    throw new Error('confianza_estimacion excede 0.65 para mockups');
  }

  let rango_estimado: RangoEstimado | undefined;
  if (obj.rango_estimado !== undefined) {
    const rango = obj.rango_estimado as Record<string, unknown>;
    if (
      typeof rango.minimo_cop !== 'number' ||
      typeof rango.maximo_cop !== 'number' ||
      rango.minimo_cop > rango.maximo_cop
    ) {
      throw new Error('rango_estimado inválido');
    }
    rango_estimado = { minimo_cop: rango.minimo_cop, maximo_cop: rango.maximo_cop };
  }

  return {
    tipo_proyecto: obj.tipo_proyecto,
    cantidad_paginas: obj.cantidad_paginas,
    nivel_disenio: obj.nivel_disenio,
    tecnologias: obj.tecnologias,
    cantidad_desarrolladores: obj.cantidad_desarrolladores,
    tiempo_entrega: obj.tiempo_entrega,
    hosting: obj.hosting,
    complejidad_detectada: obj.complejidad_detectada,
    funcionalidades_clave: obj.funcionalidades_clave,
    supuestos: obj.supuestos,
    confianza_estimacion: obj.confianza_estimacion,
    rango_estimado,
  };
}

export function mapMockupResponse(raw: Record<string, unknown>): Record<string, unknown> {
  const cantidadPaginas =
    typeof raw.cantidad_paginas === 'number' && raw.cantidad_paginas > 0
      ? raw.cantidad_paginas
      : raw.pantallas_detectadas;

  return {
    tipo_proyecto: raw.tipo_proyecto,
    cantidad_paginas: cantidadPaginas,
    nivel_disenio: raw.nivel_disenio,
    tecnologias: raw.tecnologias ?? raw.tecnologias_sugeridas ?? [],
    cantidad_desarrolladores: raw.cantidad_desarrolladores,
    tiempo_entrega: raw.tiempo_entrega,
    hosting: raw.hosting,
    complejidad_detectada: raw.complejidad_detectada ?? 'media',
    funcionalidades_clave: raw.funcionalidades_clave ?? raw.funcionalidades_visibles ?? [],
    supuestos: raw.supuestos,
    confianza_estimacion: raw.confianza_estimacion,
    rango_estimado: raw.rango_estimado,
  };
}

/**
 * Los modelos de IA (sobre todo modelos de visión pequeños como llava) no
 * siempre respetan los valores exactos de un enum, aunque el prompt lo pida
 * explícitamente. En vez de rechazar la respuesta de una vez, normalizamos
 * las variaciones más comunes (inglés, plurales, unidades distintas, números
 * fuera de rango) hacia el valor válido más cercano. Si de verdad no se
 * puede interpretar, se cae a un valor conservador por defecto en lugar de
 * fallar toda la cotización.
 */
function extraerNumero(texto: string): number | null {
  const match = texto.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  return parseFloat(match[1].replace(',', '.'));
}

function normalizarTiempoEntrega(valor: unknown): TiempoEntrega {
  if (isInList(valor, TIEMPOS_ENTREGA)) return valor;
  if (typeof valor !== 'string') return '1mes';

  const v = valor.toLowerCase().trim();
  const numero = extraerNumero(v);

  if (v.includes('semana') || v.includes('week')) {
    return numero !== null && numero >= 2 ? '2semanas' : '1semana';
  }
  if (v.includes('mes') || v.includes('month')) {
    return numero !== null && numero > 1 ? 'mas1mes' : '1mes';
  }
  if (v.includes('dia') || v.includes('día') || v.includes('day')) {
    if (numero === null) return '1mes';
    if (numero <= 7) return '1semana';
    if (numero <= 14) return '2semanas';
    if (numero <= 31) return '1mes';
    return 'mas1mes';
  }
  return '1mes';
}

function normalizarPorAlias(
  valor: unknown,
  lista: string[],
  alias: Record<string, string>,
): string | null {
  if (typeof valor !== 'string') return null;
  const v = valor.toLowerCase().trim();
  if ((lista as string[]).includes(v)) return v;
  for (const [clave, destino] of Object.entries(alias)) {
    if (v.includes(clave)) return destino;
  }
  return null;
}

function clamp(valor: unknown, min: number, max: number, porDefecto: number): number {
  const num = typeof valor === 'number' ? valor : extraerNumero(String(valor ?? ''));
  if (num === null || Number.isNaN(num)) return porDefecto;
  return Math.min(max, Math.max(min, Math.round(num)));
}

const ALIAS_TIPO_PROYECTO: Record<string, string> = {
  'landing page': 'landing',
  website: 'landing',
  'sitio web': 'landing',
  'e-commerce': 'ecommerce',
  'tienda en línea': 'ecommerce',
  tienda: 'ecommerce',
  'web app': 'webapp',
  aplicación: 'webapp',
  application: 'webapp',
  app: 'mobile',
  móvil: 'mobile',
  backend: 'api',
  panel: 'dashboard',
  admin: 'dashboard',
};

const ALIAS_NIVEL_DISENIO: Record<string, string> = {
  basic: 'basico',
  simple: 'basico',
  intermediate: 'intermedio',
  medio: 'intermedio',
  premium: 'premium',
  avanzado: 'premium',
  animated: 'animado',
  animación: 'animado',
};

const ALIAS_HOSTING: Record<string, string> = {
  none: 'ninguno',
  no: 'ninguno',
  basic: 'basico',
  shared: 'basico',
  vps: 'vps',
  cloud: 'cloud',
  nube: 'cloud',
};

/**
 * Aplica correcciones de formato antes de la validación estricta.
 * No inventa datos: solo reinterpreta lo que la IA ya devolvió en un
 * formato distinto al esperado.
 */
export function normalizarResultadoIA(
  data: Record<string, unknown>,
  esMockup: boolean,
): Record<string, unknown> {
  const tipoProyecto =
    (isInList(data.tipo_proyecto, TIPOS_PROYECTO) && data.tipo_proyecto) ||
    normalizarPorAlias(data.tipo_proyecto, TIPOS_PROYECTO, ALIAS_TIPO_PROYECTO) ||
    'webapp';

  const nivelDisenio =
    (isInList(data.nivel_disenio, NIVELES_DISENIO) && data.nivel_disenio) ||
    normalizarPorAlias(data.nivel_disenio, NIVELES_DISENIO, ALIAS_NIVEL_DISENIO) ||
    'basico';

  const hosting =
    (isInList(data.hosting, HOSTING_OPTIONS) && data.hosting) ||
    normalizarPorAlias(data.hosting, HOSTING_OPTIONS, ALIAS_HOSTING) ||
    'ninguno';

  const confianzaMax = esMockup ? 0.65 : 1;

  return {
    ...data,
    tipo_proyecto: tipoProyecto,
    nivel_disenio: nivelDisenio,
    hosting,
    tiempo_entrega: normalizarTiempoEntrega(data.tiempo_entrega),
    cantidad_paginas: clamp(data.cantidad_paginas, 1, 50, 1),
    cantidad_desarrolladores: clamp(data.cantidad_desarrolladores, 1, 10, 1),
    confianza_estimacion: Math.min(
      confianzaMax,
      Math.max(0, typeof data.confianza_estimacion === 'number' ? data.confianza_estimacion : 0.3),
    ),
    complejidad_detectada: isInList(data.complejidad_detectada, COMPLEJIDADES)
      ? data.complejidad_detectada
      : 'media',
    tecnologias: isStringArray(data.tecnologias) ? data.tecnologias : [],
    funcionalidades_clave: isStringArray(data.funcionalidades_clave)
      ? data.funcionalidades_clave.slice(0, 5)
      : [],
    supuestos:
      isStringArray(data.supuestos) && data.supuestos.length > 0
        ? data.supuestos
        : ['Análisis generado automáticamente con información limitada'],
  };
}