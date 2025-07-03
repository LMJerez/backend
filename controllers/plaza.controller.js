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
