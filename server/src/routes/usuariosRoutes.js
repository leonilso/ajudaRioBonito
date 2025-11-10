import express from "express";
import { cadastrarUsuario, consultarUsuarios  } from "../controllers/usuariosController.js";

const router = express.Router();
router.post("/cadastrarUsuario", cadastrarUsuario);
router.get("/", consultarUsuarios);

export default router;
