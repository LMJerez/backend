// controllers/plaza.controller.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPlazasDisponibles = async (req, res) => {
  try {
    const plazas = await prisma.vistaPlazasDisponibles.findMany();
    res.json(plazas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener plazas disponibles" });
  }
};

export const getPlazasConEstado = async (req, res) => {
  try {
    const plazas = await prisma.plaza.findMany({
      include: {
        tipoVehiculo: true,
        parqueos: {
          where: { horaFin: null },
          orderBy: { horaInicio: "desc" },
          take: 1,
        },
      },
      orderBy: [{ tipoVehiculoId: "asc" }, { nombre: "asc" }],
    });

    const plazasConEstado = plazas.map((plaza) => {
      const parqueoActivo = plaza.parqueos[0] || null;
      return {
        id: plaza.id,
        nombre: plaza.nombre,
        descripcion: plaza.descripcion,
        ocupada: plaza.ocupada,
        tipoVehiculo: plaza.tipoVehiculo.tipo,
        tipoVehiculoId: plaza.tipoVehiculo.id,
        valorMinuto: plaza.tipoVehiculo.valorMinuto,
        parqueoActivo: parqueoActivo && {
          id: parqueoActivo.id,
          placa: parqueoActivo.placa,
          horaInicio: parqueoActivo.horaInicio,
        },
      };
    });

    res.json(plazasConEstado);
  } catch (error) {
    console.error("Error al obtener plazas con estado:", error);
    res.status(500).json({ error: "Error al obtener plazas con estado" });
  }
};
