import express from "express";
import multer from "multer";
import { consultarInfos } from "../controllers/infosController.js";

const router = express.Router();

router.get("/", consultarInfos);

export default router;
