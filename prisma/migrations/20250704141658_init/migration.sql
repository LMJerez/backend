-- CreateTable
CREATE TABLE "tipo_vehiculo" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "valorMinuto" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "tipo_vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plazas" (
    "id" SERIAL NOT NULL,
    "tipoVehiculoId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "ocupada" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "plazas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parqueo" (
    "id" SERIAL NOT NULL,
    "plazaId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "placa" TEXT NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaFin" TIMESTAMP(3),
    "valorMinuto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorParqueo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "descuento" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPagar" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pagado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "parqueo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vista_plazas_disponibles" (
    "id_plaza" INTEGER NOT NULL,
    "tipo_vehiculo" TEXT NOT NULL,
    "nombre_plaza" TEXT NOT NULL,
    "descripcion_plaza" TEXT,
    "plaza_ocupada" BOOLEAN NOT NULL,

    CONSTRAINT "vista_plazas_disponibles_pkey" PRIMARY KEY ("id_plaza")
);

-- CreateTable
CREATE TABLE "vista_resumen_ocupacion" (
    "tipo_vehiculo" TEXT NOT NULL,
    "total_plazas" INTEGER NOT NULL,
    "plazas_ocupadas" INTEGER NOT NULL,
    "plazas_libres" INTEGER NOT NULL,

    CONSTRAINT "vista_resumen_ocupacion_pkey" PRIMARY KEY ("tipo_vehiculo")
);

-- CreateIndex
CREATE UNIQUE INDEX "tipo_vehiculo_tipo_key" ON "tipo_vehiculo"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "plazas_nombre_key" ON "plazas"("nombre");

-- CreateIndex
CREATE INDEX "plazas_nombre_idx" ON "plazas"("nombre");

-- CreateIndex
CREATE INDEX "parqueo_fecha_idx" ON "parqueo"("fecha");

-- CreateIndex
CREATE INDEX "parqueo_placa_fecha_idx" ON "parqueo"("placa", "fecha");

-- AddForeignKey
ALTER TABLE "plazas" ADD CONSTRAINT "plazas_tipoVehiculoId_fkey" FOREIGN KEY ("tipoVehiculoId") REFERENCES "tipo_vehiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parqueo" ADD CONSTRAINT "parqueo_plazaId_fkey" FOREIGN KEY ("plazaId") REFERENCES "plazas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
