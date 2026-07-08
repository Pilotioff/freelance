-- AlterTable
ALTER TABLE "Cotizacion" ADD COLUMN     "moneda_seleccionada" TEXT NOT NULL DEFAULT 'COP',
ADD COLUMN     "precio_convertido" DOUBLE PRECISION,
ADD COLUMN     "tasa_cambio_usada" DOUBLE PRECISION;
