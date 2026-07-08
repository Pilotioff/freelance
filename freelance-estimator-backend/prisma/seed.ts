import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PesoSeed {
  clave: string;
  etiqueta: string;
  valor: number;
  categoria: string;
}

const pesos: PesoSeed[] = [
  // --- Horas base por tipo de proyecto (existentes) ---
  { clave: 'landing_base_hours', etiqueta: 'Landing - Horas base', valor: 40, categoria: 'proyecto' },
  { clave: 'ecommerce_base_hours', etiqueta: 'E-commerce - Horas base', valor: 200, categoria: 'proyecto' },
  { clave: 'webapp_base_hours', etiqueta: 'Web App - Horas base', valor: 160, categoria: 'proyecto' },
  { clave: 'mobile_base_hours', etiqueta: 'Mobile - Horas base', valor: 240, categoria: 'proyecto' },
  { clave: 'api_base_hours', etiqueta: 'API - Horas base', valor: 80, categoria: 'proyecto' },
  { clave: 'dashboard_base_hours', etiqueta: 'Dashboard - Horas base', valor: 120, categoria: 'proyecto' },

  // --- Horas base por tipo de proyecto (nuevos) ---
  { clave: 'crm_base_hours', etiqueta: 'CRM - Horas base', valor: 220, categoria: 'proyecto' },
  { clave: 'erp_base_hours', etiqueta: 'ERP - Horas base', valor: 320, categoria: 'proyecto' },
  { clave: 'marketplace_base_hours', etiqueta: 'Marketplace - Horas base', valor: 260, categoria: 'proyecto' },
  { clave: 'saas_base_hours', etiqueta: 'SaaS - Horas base', valor: 280, categoria: 'proyecto' },
  { clave: 'sistema_interno_base_hours', etiqueta: 'Sistema interno - Horas base', valor: 180, categoria: 'proyecto' },
  { clave: 'blog_base_hours', etiqueta: 'Blog - Horas base', valor: 60, categoria: 'proyecto' },
  { clave: 'portafolio_base_hours', etiqueta: 'Portafolio - Horas base', valor: 35, categoria: 'proyecto' },
  { clave: 'chat_base_hours', etiqueta: 'Chat - Horas base', valor: 140, categoria: 'proyecto' },
  { clave: 'automatizacion_base_hours', etiqueta: 'Automatización - Horas base', valor: 100, categoria: 'proyecto' },
  { clave: 'pos_base_hours', etiqueta: 'POS - Horas base', valor: 150, categoria: 'proyecto' },
  { clave: 'lms_base_hours', etiqueta: 'LMS - Horas base', valor: 200, categoria: 'proyecto' },
  { clave: 'ia_base_hours', etiqueta: 'IA - Horas base', valor: 240, categoria: 'proyecto' },
  { clave: 'microservicios_base_hours', etiqueta: 'Microservicios - Horas base', valor: 200, categoria: 'proyecto' },
  { clave: 'sistema_administrativo_base_hours', etiqueta: 'Sistema administrativo - Horas base', valor: 190, categoria: 'proyecto' },

  // --- Diseño (existentes) ---
  { clave: 'design_basico', etiqueta: 'Diseño básico', valor: 1, categoria: 'diseno' },
  { clave: 'design_intermedio', etiqueta: 'Diseño intermedio', valor: 1.3, categoria: 'diseno' },
  { clave: 'design_premium', etiqueta: 'Diseño premium', valor: 1.6, categoria: 'diseno' },
  { clave: 'design_animado', etiqueta: 'Diseño animado', valor: 2, categoria: 'diseno' },

  // --- Tiempo de entrega (existentes) ---
  { clave: 'delivery_1semana', etiqueta: 'Entrega 1 semana', valor: 1.5, categoria: 'tiempo' },
  { clave: 'delivery_2semanas', etiqueta: 'Entrega 2 semanas', valor: 1.2, categoria: 'tiempo' },
  { clave: 'delivery_1mes', etiqueta: 'Entrega 1 mes', valor: 1, categoria: 'tiempo' },
  { clave: 'delivery_mas1mes', etiqueta: 'Entrega más de 1 mes', valor: 0.9, categoria: 'tiempo' },

  // --- Hosting (existentes) ---
  { clave: 'hosting_ninguno', etiqueta: 'Sin hosting', valor: 0, categoria: 'infraestructura' },
  { clave: 'hosting_basico', etiqueta: 'Hosting básico', valor: 500000, categoria: 'infraestructura' },
  { clave: 'hosting_vps', etiqueta: 'Hosting VPS', valor: 1500000, categoria: 'infraestructura' },
  { clave: 'hosting_cloud', etiqueta: 'Hosting cloud', valor: 3000000, categoria: 'infraestructura' },

  // --- Desglose de costo por arquetipo (nuevo) ---
  { clave: 'desglose_contenido_diseno', etiqueta: 'Contenido - % Diseño', valor: 0.40, categoria: 'desglose' },
  { clave: 'desglose_contenido_frontend', etiqueta: 'Contenido - % Frontend', valor: 0.40, categoria: 'desglose' },
  { clave: 'desglose_contenido_backend', etiqueta: 'Contenido - % Backend', valor: 0.15, categoria: 'desglose' },
  { clave: 'desglose_contenido_bd', etiqueta: 'Contenido - % Base de datos', valor: 0.05, categoria: 'desglose' },
  { clave: 'desglose_backend_heavy_diseno', etiqueta: 'Backend-heavy - % Diseño', valor: 0.10, categoria: 'desglose' },
  { clave: 'desglose_backend_heavy_frontend', etiqueta: 'Backend-heavy - % Frontend', valor: 0.20, categoria: 'desglose' },
  { clave: 'desglose_backend_heavy_backend', etiqueta: 'Backend-heavy - % Backend', valor: 0.50, categoria: 'desglose' },
  { clave: 'desglose_backend_heavy_bd', etiqueta: 'Backend-heavy - % Base de datos', valor: 0.20, categoria: 'desglose' },
  { clave: 'desglose_fullstack_diseno', etiqueta: 'Full-stack - % Diseño', valor: 0.20, categoria: 'desglose' },
  { clave: 'desglose_fullstack_frontend', etiqueta: 'Full-stack - % Frontend', valor: 0.35, categoria: 'desglose' },
  { clave: 'desglose_fullstack_backend', etiqueta: 'Full-stack - % Backend', valor: 0.35, categoria: 'desglose' },
  { clave: 'desglose_fullstack_bd', etiqueta: 'Full-stack - % Base de datos', valor: 0.10, categoria: 'desglose' },

  // --- Margen por perfil de cliente (nuevo) ---
  { clave: 'margen_estudiante', etiqueta: 'Margen - Estudiante', valor: 0.80, categoria: 'perfil_cliente' },
  { clave: 'margen_freelancer', etiqueta: 'Margen - Freelancer', valor: 0.95, categoria: 'perfil_cliente' },
  { clave: 'margen_emprendedor', etiqueta: 'Margen - Emprendedor', valor: 1.00, categoria: 'perfil_cliente' },
  { clave: 'margen_startup', etiqueta: 'Margen - Startup', valor: 1.10, categoria: 'perfil_cliente' },
  { clave: 'margen_empresa_pequena', etiqueta: 'Margen - Empresa pequeña', valor: 1.15, categoria: 'perfil_cliente' },
  { clave: 'margen_empresa_mediana', etiqueta: 'Margen - Empresa mediana', valor: 1.25, categoria: 'perfil_cliente' },
  { clave: 'margen_empresa_grande', etiqueta: 'Margen - Empresa grande', valor: 1.40, categoria: 'perfil_cliente' },
  { clave: 'margen_gobierno', etiqueta: 'Margen - Gobierno', valor: 1.30, categoria: 'perfil_cliente' },
  { clave: 'margen_ong', etiqueta: 'Margen - ONG', valor: 0.90, categoria: 'perfil_cliente' },
];

async function main(): Promise<void> {
  for (const peso of pesos) {
    await prisma.pesoSistema.upsert({
      where: { clave: peso.clave },
      update: { etiqueta: peso.etiqueta, valor: peso.valor, categoria: peso.categoria },
      create: peso,
    });
  }
  console.log(`Seed completado: ${pesos.length} pesos del sistema`);
}

main()
  .catch((e: Error) => {
    console.error('Error en seed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
