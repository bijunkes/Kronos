import express from "express";
import { salvarAtividadesSessao, listarAtividadesSessao } from "../controllers/pomodoroController.js";

const router = express.Router();

router.post("/:id/atividades", salvarAtividadesSessao);
router.get("/:id/atividades", listarAtividadesSessao);

export default router;
