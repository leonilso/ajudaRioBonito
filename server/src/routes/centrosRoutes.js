import express from "express";
import multer from "multer";
import { cadastrarCentro, consultarCentros } from "../controllers/centrosController.js";

const router = express.Router();
const upload = multer();

router.post("/cadastrarCentro", upload.none(), cadastrarCentro);
router.get("/", consultarCentros);

export default router;
