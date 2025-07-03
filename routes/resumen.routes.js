import express from "express";
import { getResumenOcupacion } from "../controllers/resumen.controller.js";

const router = express.Router();
router.get("/", getResumenOcupacion);
export default router;
