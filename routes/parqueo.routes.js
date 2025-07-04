import express from "express";
import {
  registrarIngreso,
  registrarSalida,
} from "../controllers/parqueo.controller.js";

const router = express.Router();

router.post("/ingreso", registrarIngreso);
router.post("/salida", registrarSalida);

export default router;
