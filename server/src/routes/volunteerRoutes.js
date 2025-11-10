import express from "express";
import { registerVolunteer, loginVolunteer, consultarVoluntarios } from "../controllers/volunteerController.js";

const router = express.Router();

router.post("/cadastro", registerVolunteer);
router.post("/login", loginVolunteer);
router.get("/voluntarios", consultarVoluntarios);

export default router;