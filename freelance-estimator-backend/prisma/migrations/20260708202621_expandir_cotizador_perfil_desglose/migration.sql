-- AlterTable
ALTER TABLE "Cotizacion" ADD COLUMN     "costo_backend" DOUBLE PRECISION,
ADD COLUMN     "costo_bd" DOUBLE PRECISION,
ADD COLUMN     "costo_diseno" DOUBLE PRECISION,
ADD COLUMN     "costo_frontend" DOUBLE PRECISION,
ADD COLUMN     "margen_aplicado" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "perfil_cliente" TEXT NOT NULL DEFAULT 'emprendedor';
