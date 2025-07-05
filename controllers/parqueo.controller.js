import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// >>> Registrar ingreso de vehículo
export const registrarIngreso = async (req, res) => {
  const { plazaId, placa } = req.body;

  if (!plazaId || !placa) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    const plaza = await prisma.plaza.findUnique({ where: { id: plazaId } });

    if (!plaza || plaza.ocupada) {
      return res
        .status(400)
        .json({ error: "La plaza no existe o ya está ocupada" });
    }

    const tipo = await prisma.tipoVehiculo.findUnique({
      where: { id: plaza.tipoVehiculoId },
    });

    const nuevoParqueo = await prisma.parqueo.create({
      data: {
        plazaId,
        placa,
        valorMinuto: tipo.valorMinuto,
      },
    });

    await prisma.plaza.update({
      where: { id: plazaId },
      data: { ocupada: true },
    });

    res.status(201).json(nuevoParqueo);
  } catch (error) {
    console.error("Error al registrar ingreso:", error);
    res.status(500).json({ error: "Error interno al registrar ingreso" });
  }
};

// >>> Registrar salida de vehículo
export const registrarSalida = async (req, res) => {
  const { parqueoId, descuento = 0 } = req.body;

  if (!parqueoId) {
    return res.status(400).json({ error: "Falta el ID del parqueo" });
  }

  try {
    const parqueo = await prisma.parqueo.findUnique({
      where: { id: parqueoId },
    });

    if (!parqueo || parqueo.horaFin) {
      return res
        .status(400)
        .json({ error: "El parqueo no existe o ya fue cerrado" });
    }

    const horaFin = new Date();
    const minutosTranscurridos = Math.ceil(
      (horaFin - parqueo.horaInicio) / 60000
    );

    const valorParqueo = parqueo.valorMinuto * minutosTranscurridos;
    const totalPagar = valorParqueo - descuento;

    const parqueoActualizado = await prisma.parqueo.update({
      where: { id: parqueoId },
      data: {
        horaFin,
        valorParqueo,
        descuento,
        totalPagar,
        pagado: true,
      },
    });

    await prisma.plaza.update({
      where: { id: parqueo.plazaId },
      data: { ocupada: false },
    });

    res.json({ parqueo: parqueoActualizado, minutosTranscurridos });
  } catch (error) {
    console.error("Error al registrar salida:", error);
    res.status(500).json({ error: "Error interno al registrar salida" });
  }
};

// >>> Inicializar datos: tipos de vehículo y plazas
export const inicializarDatos = async (req, res) => {
  try {
    const tiposExistentes = await prisma.tipoVehiculo.findMany();

    if (tiposExistentes.length > 0) {
      return res
        .status(200)
        .json({ mensaje: "Los datos ya fueron inicializados." });
    }

    const tipoCarro = await prisma.tipoVehiculo.create({
      data: { nombre: "CARRO", valorMinuto: 100 },
    });

    const tipoMoto = await prisma.tipoVehiculo.create({
      data: { nombre: "MOTO", valorMinuto: 50 },
    });

    await prisma.plaza.createMany({
      data: [
        { nombre: "A1", tipoVehiculoId: tipoCarro.id },
        { nombre: "A2", tipoVehiculoId: tipoCarro.id },
        { nombre: "M1", tipoVehiculoId: tipoMoto.id },
        { nombre: "M2", tipoVehiculoId: tipoMoto.id },
      ],
    });

    res.status(201).json({ mensaje: "Tipos y plazas creados exitosamente." });
  } catch (error) {
    console.error("Error al inicializar datos:", error);
    res.status(500).json({ error: "Error interno al inicializar datos." });
  }
};
