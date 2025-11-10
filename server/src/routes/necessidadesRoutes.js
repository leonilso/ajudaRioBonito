import express from "express";
import {
  cadastrarNecessidades,
  consultarNecessidades,
  editarNecessidade,
  removerNecessidade,
} from "../controllers/necessidadesController.js";

const router = express.Router();

router.post("/cadastrarNecessidades", cadastrarNecessidades);
router.get("/consultar/:cpf", consultarNecessidades);
router.put("/atualizar/:id", editarNecessidade);
router.delete("/excluir/:id", removerNecessidade);

export default router;
