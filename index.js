// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import plazaRoutes from "./routes/plaza.routes.js";
import resumenRoutes from "./routes/resumen.routes.js";
import parqueoRoutes from "./routes/parqueo.routes.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("🚗 API Parqueadero activa y funcionando");
});

// Rutas API
app.use("/api/plazas", plazaRoutes);
app.use("/api/resumen", resumenRoutes);
app.use("/api/parqueo", parqueoRoutes);

// Middleware para errores
app.use((err, req, res, next) => {
  console.error("⚠️ Error no manejado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Inicio del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
