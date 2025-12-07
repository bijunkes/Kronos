import express from "express";
import {
  listarLembretes,
  excluirLembretes,
  excluirLembrete,
  gerarLembretesAtividadesProximas,
  gerarLembretesExpirados,
  detalhesLembrete
} from "../controllers/lembretesController.js";

import verificarToken from "../middlewares/userMiddleware.js";
import { eventosLembretes } from "../controllers/eventosController.js";
import { autenticarSSE } from "../middlewares/authSSE.js";

const router = express.Router();

router.get("/eventos", autenticarSSE, eventosLembretes);

router.get("/", verificarToken, listarLembretes);

router.post("/gerar-proximas", async (req, res) => {
  try {
    await gerarLembretesAtividadesProximas();
    res
      .status(200)
      .json({ message: "Lembretes de atividades próximas gerados com sucesso!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao gerar lembretes de atividades próximas." });
  }
});

router.post("/gerar-expirados", async (req, res) => {
  try {
    await gerarLembretesExpirados();
    res
      .status(200)
      .json({ message: "Lembretes de atividades expiradas gerados com sucesso!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erro ao gerar lembretes de atividades expiradas." });
  }
});

router.delete("/", verificarToken, excluirLembretes);

router.delete("/:id", verificarToken, excluirLembrete);

router.get("/:id", verificarToken, detalhesLembrete);

export default router;
