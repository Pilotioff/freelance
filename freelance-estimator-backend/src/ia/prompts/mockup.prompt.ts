export const MOCKUP_PROMPT = `Analiza el mockup o prototipo de interfaz de software que se te proporciona en la imagen.

Extrae los parámetros de desarrollo y responde ÚNICAMENTE con un objeto JSON válido.
Sin texto adicional, sin markdown, sin bloques de código, sin explicaciones.

El JSON debe tener exactamente esta estructura:
{
  "tipo_proyecto": "landing|ecommerce|webapp|mobile|api|dashboard",
  "pantallas_detectadas": <número entero de pantallas visibles>,
  "cantidad_paginas": <estimado total del proyecto como entero>,
  "nivel_disenio": "basico|intermedio|premium|animado",
  "tecnologias_sugeridas": ["array", "de", "strings"],
  "funcionalidades_visibles": ["array", "de", "strings"],
  "cantidad_desarrolladores": <entero entre 1 y 10>,
  "tiempo_entrega": "1semana|2semanas|1mes|mas1mes",
  "hosting": "ninguno|basico|vps|cloud",
  "funcionalidades_clave": ["máximo 5 items"],
  "supuestos": ["nunca vacío, lista lo que asumiste"],
  "confianza_estimacion": <número entre 0 y 0.65>,
  "rango_estimado": {
    "minimo_cop": <número>,
    "maximo_cop": <número>
  }
}

Reglas estrictas:
- confianza_estimacion nunca supera 0.65 para análisis de imagen
- supuestos es obligatorio y nunca puede ser un array vacío
- No asumas autenticación, pagos ni integraciones externas si no son visibles
- rango_estimado debe reflejar la incertidumbre real con un rango amplio`;

export const MOCKUP_PROMPT_STRICT = `Analiza el mockup en la imagen y responde SOLO con JSON válido, sin ningún texto adicional.

Estructura requerida:
{
  "tipo_proyecto": "landing|ecommerce|webapp|mobile|api|dashboard",
  "pantallas_detectadas": 0,
  "cantidad_paginas": 0,
  "nivel_disenio": "basico|intermedio|premium|animado",
  "tecnologias_sugeridas": [],
  "funcionalidades_visibles": [],
  "cantidad_desarrolladores": 1,
  "tiempo_entrega": "1mes",
  "hosting": "ninguno",
  "funcionalidades_clave": [],
  "supuestos": ["Análisis basado en imagen con información limitada"],
  "confianza_estimacion": 0.3,
  "rango_estimado": { "minimo_cop": 0, "maximo_cop": 0 }
}

Responde ÚNICAMENTE con el JSON. Cero texto adicional.`;

// Sin parámetros — la imagen va en el campo images del body de Ollama, no en el prompt
export function buildMockupPrompt(): string {
  return MOCKUP_PROMPT;
}

export function buildMockupPromptStrict(): string {
  return MOCKUP_PROMPT_STRICT;
}