import express from "express";
import {
  registrarIngreso,
  registrarSalida,
  inicializarDatos, // ✅ nuevo controlador
} from "../controllers/parqueo.controller.js";

const router = express.Router();

router.post("/ingreso", registrarIngreso);
router.post("/salida", registrarSalida);

// ✅ Ruta para inicializar datos (tipos y plazas)
router.post("/inicializar", inicializarDatos);

export default router;
