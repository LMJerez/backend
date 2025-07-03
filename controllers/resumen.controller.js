import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getResumenOcupacion = async (req, res) => {
  try {
    const resumen = await prisma.vistaResumenOcupacion.findMany();
    res.json(resumen);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener resumen de ocupación" });
  }
};
