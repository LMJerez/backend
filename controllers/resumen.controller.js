import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getResumenOcupacion = async (req, res) => {
  try {
    const resumen = await prisma.vistaResumenOcupacion.findMany({
      orderBy: { tipo_vehiculo: "asc" },
    });
    res.json(resumen);
  } catch (error) {
    console.error("Error en getResumenOcupacion:", error);
    res.status(500).json({ error: "Error al obtener resumen de ocupación" });
  }
};
