import express from "express";
import multer from "multer";
import {
  cadastrarNecessidades,
  consultarNecessidades,
  editarNecessidade,
  removerNecessidade,
} from "../controllers/necessidadesController.js";

const router = express.Router();
const upload = multer();

router.post("/cadastrarNecessidades", upload.none(), cadastrarNecessidades);
router.get("/consultar/:cpf", consultarNecessidades);
router.put("/atualizar/:id", upload.none(), editarNecessidade);
router.delete("/excluir/:id", removerNecessidade);

export default router;
