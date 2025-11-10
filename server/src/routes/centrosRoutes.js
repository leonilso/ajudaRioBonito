import express from "express";
import { cadastrarCentro, consultarCentros } from "../controllers/centrosController.js";

const router = express.Router();

router.post("/cadastrarCentro", cadastrarCentro);
router.get("/", consultarCentros);

export default router;
