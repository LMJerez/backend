import express from "express";
import { getPlazasDisponibles } from "../controllers/plaza.controller.js";

const router = express.Router();
router.get("/disponibles", getPlazasDisponibles);
export default router;
