// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import plazaRoutes from "./routes/plaza.routes.js";
import resumenRoutes from "./routes/resumen.routes.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/plazas", plazaRoutes);
app.use("/api/resumen", resumenRoutes);

// Inicio del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
