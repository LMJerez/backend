import express from "express";
import { getPlazasConEstado } from "../controllers/plaza.controller.js";

const router = express.Router();
router.get("/completo", getPlazasConEstado); // ✅ Única ruta activa

export default router;
