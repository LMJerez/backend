import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPlazasDisponibles = async (req, res) => {
  try {
    const plazas = await prisma.vistaPlazasDisponibles.findMany({
      orderBy: [{ tipo_vehiculo: "asc" }, { nombre_plaza: "asc" }],
    });
    res.json(plazas);
  } catch (error) {
    console.error("Error en getPlazasDisponibles:", error);
    res.status(500).json({ error: "Error al obtener plazas disponibles" });
  }
};
