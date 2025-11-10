import express from "express";
import multer from "multer";
import { registerVolunteer, loginVolunteer, consultarVoluntarios } from "../controllers/volunteerController.js";

const router = express.Router();
const upload = multer();

router.post("/cadastro", upload.none(), registerVolunteer);
router.post("/login", upload.none(), loginVolunteer);
router.get("/voluntarios", consultarVoluntarios);

export default router;