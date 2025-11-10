import express from "express";
import multer from "multer";
import { registerDonation, baixarDoacao, buscarProdutosController } from "../controllers/donationController.js";

const router = express.Router();
const upload = multer();

router.post("/cadastro", upload.none(), registerDonation);
router.post("/baixa/:id", upload.none(), baixarDoacao);
router.get("/produtos", buscarProdutosController);

export default router;