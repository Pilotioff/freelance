export const DOCUMENTO_PROMPT = `Analiza este documento técnico con historias de usuario y especificaciones
de software. Responde ÚNICAMENTE con JSON válido, sin texto adicional,
sin markdown, sin bloques de código.
JSON requerido: { "tipo_proyecto", "cantidad_paginas", "nivel_disenio",
"tecnologias", "cantidad_desarrolladores", "tiempo_entrega", "hosting",
"complejidad_detectada", "funcionalidades_clave", "supuestos",
"confianza_estimacion" (puede llegar a 0.95) }
Reglas: usa valor más conservador si hay incertidumbre. supuestos lista
todo lo asumido. No inventes tecnologías no explícitas ni fuertemente implícitas.`;

export const DOCUMENTO_PROMPT_STRICT = `${DOCUMENTO_PROMPT}

IMPORTANTE: Responde SOLO con el objeto JSON. Sin explicaciones. Sin markdown. Sin backticks.`;

export function buildDocumentoPrompt(texto: string): string {
  return `${DOCUMENTO_PROMPT}\n\nDocumento:\n${texto}`;
}

export function buildDocumentoPromptStrict(texto: string): string {
  return `${DOCUMENTO_PROMPT_STRICT}\n\nDocumento:\n${texto}`;
}
