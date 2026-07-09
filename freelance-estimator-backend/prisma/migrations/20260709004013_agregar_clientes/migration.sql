-- AlterTable
ALTER TABLE "Cotizacion" ADD COLUMN     "cliente_id" TEXT;

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "empresa" TEXT,
    "correo" TEXT,
    "telefono" TEXT,
    "ciudad" TEXT,
    "pais" TEXT,
    "sitio_web" TEXT,
    "linkedin" TEXT,
    "tipo_cliente" TEXT NOT NULL,
    "observaciones" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cotizacion" ADD CONSTRAINT "Cotizacion_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
