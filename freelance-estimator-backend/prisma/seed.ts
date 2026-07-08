import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PesoSeed {
  clave: string;
  etiqueta: string;
  valor: number;
  categoria: string;
}

const pesos: PesoSeed[] = [
  { clave: 'landing_base_hours', etiqueta: 'Landing - Horas base', valor: 40, categoria: 'proyecto' },
  { clave: 'ecommerce_base_hours', etiqueta: 'E-commerce - Horas base', valor: 200, categoria: 'proyecto' },
  { clave: 'webapp_base_hours', etiqueta: 'Web App - Horas base', valor: 160, categoria: 'proyecto' },
  { clave: 'mobile_base_hours', etiqueta: 'Mobile - Horas base', valor: 240, categoria: 'proyecto' },
  { clave: 'api_base_hours', etiqueta: 'API - Horas base', valor: 80, categoria: 'proyecto' },
  { clave: 'dashboard_base_hours', etiqueta: 'Dashboard - Horas base', valor: 120, categoria: 'proyecto' },
  { clave: 'design_basico', etiqueta: 'Diseño básico', valor: 1, categoria: 'diseno' },
  { clave: 'design_intermedio', etiqueta: 'Diseño intermedio', valor: 1.3, categoria: 'diseno' },
  { clave: 'design_premium', etiqueta: 'Diseño premium', valor: 1.6, categoria: 'diseno' },
  { clave: 'design_animado', etiqueta: 'Diseño animado', valor: 2, categoria: 'diseno' },
  { clave: 'delivery_1semana', etiqueta: 'Entrega 1 semana', valor: 1.5, categoria: 'tiempo' },
  { clave: 'delivery_2semanas', etiqueta: 'Entrega 2 semanas', valor: 1.2, categoria: 'tiempo' },
  { clave: 'delivery_1mes', etiqueta: 'Entrega 1 mes', valor: 1, categoria: 'tiempo' },
  { clave: 'delivery_mas1mes', etiqueta: 'Entrega más de 1 mes', valor: 0.9, categoria: 'tiempo' },
  { clave: 'hosting_ninguno', etiqueta: 'Sin hosting', valor: 0, categoria: 'infraestructura' },
  { clave: 'hosting_basico', etiqueta: 'Hosting básico', valor: 500000, categoria: 'infraestructura' },
  { clave: 'hosting_vps', etiqueta: 'Hosting VPS', valor: 1500000, categoria: 'infraestructura' },
  { clave: 'hosting_cloud', etiqueta: 'Hosting cloud', valor: 3000000, categoria: 'infraestructura' },
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
