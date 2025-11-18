import express from "express";
import { criarSessaoPomodoro, salvarAtividadesSessao, listarAtividadesSessao, registrarTempoPomodoro, finalizarSessaoPomodoro, iniciarSessaoPomodoro, obterUltimaSessaoPomodoro, atualizarParcial } from "../controllers/pomodoroController.js";

import verificarToken from "../middlewares/userMiddleware.js";

const router = express.Router();

router.post("/", verificarToken, criarSessaoPomodoro);
router.post("/:id/atividades", salvarAtividadesSessao);
router.get("/:id/atividades", listarAtividadesSessao);
router.put("/:id/tempo", registrarTempoPomodoro);
router.patch("/:id/finalizar", finalizarSessaoPomodoro);
router.patch("/:id/iniciar", iniciarSessaoPomodoro);
// router.post("/pomodoro/:id/atividades", verificarToken, adicionarAtividadeSessao);
router.get("/ultima", verificarToken, obterUltimaSessaoPomodoro);
router.patch("/:id/atualizar-parcial", atualizarParcial);



export default router;
