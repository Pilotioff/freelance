-- CreateTable
CREATE TABLE "Cotizacion" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nombre_proyecto" TEXT NOT NULL,
    "tipo_proyecto" TEXT NOT NULL,
    "cantidad_paginas" INTEGER NOT NULL,
    "nivel_disenio" TEXT NOT NULL,
    "hosting" TEXT NOT NULL,
    "tiempo_entrega" TEXT NOT NULL,
    "cantidad_desarrolladores" INTEGER NOT NULL,
    "horas_estimadas" DOUBLE PRECISION NOT NULL,
    "costo_infraestructura" DOUBLE PRECISION NOT NULL,
    "precio_final" DOUBLE PRECISION NOT NULL,
    "complejidad" TEXT NOT NULL,
    "generado_por_ia" BOOLEAN NOT NULL DEFAULT false,
    "confianza_ia" DOUBLE PRECISION,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cotizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CotizacionTecnologia" (
    "id" TEXT NOT NULL,
    "cotizacion_id" TEXT NOT NULL,
    "tecnologia" TEXT NOT NULL,

    CONSTRAINT "CotizacionTecnologia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PesoSistema" (
    "id" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "etiqueta" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "categoria" TEXT NOT NULL,

    CONSTRAINT "PesoSistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistorialCambiosPesos" (
    "id" TEXT NOT NULL,
    "peso_id" TEXT NOT NULL,
    "valor_anterior" DOUBLE PRECISION NOT NULL,
    "valor_nuevo" DOUBLE PRECISION NOT NULL,
    "modificado_por" TEXT NOT NULL,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistorialCambiosPesos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenRefresco" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expira_en" TIMESTAMP(3) NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenRefresco_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PesoSistema_clave_key" ON "PesoSistema"("clave");

-- CreateIndex
CREATE UNIQUE INDEX "TokenRefresco_token_key" ON "TokenRefresco"("token");

-- AddForeignKey
ALTER TABLE "CotizacionTecnologia" ADD CONSTRAINT "CotizacionTecnologia_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "Cotizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialCambiosPesos" ADD CONSTRAINT "HistorialCambiosPesos_peso_id_fkey" FOREIGN KEY ("peso_id") REFERENCES "PesoSistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
