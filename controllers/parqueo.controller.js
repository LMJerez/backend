import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// >>> Registrar ingreso de vehículo
export const registrarIngreso = async (req, res) => {
  const { plazaId, placa } = req.body;

  if (!plazaId || !placa) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }

  try {
    // Verificar si la plaza está ocupada
    const plaza = await prisma.plaza.findUnique({ where: { id: plazaId } });

    if (!plaza || plaza.ocupada) {
      return res
        .status(400)
        .json({ error: "La plaza no existe o ya está ocupada" });
    }

    // Obtener valor por minuto desde el tipo de vehículo
    const tipo = await prisma.tipoVehiculo.findUnique({
      where: { id: plaza.tipoVehiculoId },
    });

    // Crear registro de parqueo
    const nuevoParqueo = await prisma.parqueo.create({
      data: {
        plazaId,
        placa,
        valorMinuto: tipo.valorMinuto,
      },
    });

    // Marcar la plaza como ocupada
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
    // Obtener el parqueo activo
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
    ); // ms → minutos

    const valorParqueo = parqueo.valorMinuto * minutosTranscurridos;
    const totalPagar = valorParqueo - descuento;

    // Actualizar registro de parqueo
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

    // Liberar la plaza
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
