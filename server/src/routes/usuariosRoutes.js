import express from "express";
import multer from "multer";
import { cadastrarUsuario, consultarUsuarios  } from "../controllers/usuariosController.js";

const router = express.Router();
const upload = multer();
router.post("/cadastrarUsuario", upload.none(), cadastrarUsuario);
router.get("/", consultarUsuarios);

export default router;
