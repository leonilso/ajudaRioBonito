import express from "express";
import { registerDonation, baixarDoacao, buscarProdutosController } from "../controllers/donationController.js";

const router = express.Router();

router.post("/cadastro", registerDonation);
router.post("/baixa/:id", baixarDoacao);
router.get("/produtos", buscarProdutosController);

export default router;