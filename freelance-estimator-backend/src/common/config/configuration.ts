export default (): Record<string, string | number> => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  databaseUrl: process.env.DATABASE_URL ?? '',
  mongodbUri: process.env.MONGODB_URI ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpira: process.env.JWT_EXPIRA ?? '7d',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  ollamaUrl: process.env.OLLAMA_URL ?? 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL ?? 'llama3.2',
  ollamaModelVision: process.env.OLLAMA_MODEL_VISION ?? 'llava',
  adminEmailRespaldo: process.env.ADMIN_EMAIL_RESPALDO ?? 'admin@sistema.co',
  adminPasswordRespaldo: process.env.ADMIN_PASSWORD_RESPALDO ?? 'admin_respaldo_123',
  tarifaHoraDefault: parseInt(process.env.TARIFA_HORA_DEFAULT ?? '150000', 10),
});

export function validateConfig(): void {
  const required = ['DATABASE_URL', 'MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Variables de entorno requeridas faltantes: ${missing.join(', ')}`);
  }
}
