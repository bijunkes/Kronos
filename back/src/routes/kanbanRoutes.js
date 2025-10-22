import express from 'express';
import { adicionarAtividade, listarAtividadesNoKanban, listarAtividadesPorClassificacao, atualizarKanban, deletarAtividadeDeKanban } from '../controllers/kanbanController.js';
import verificarToken from "../middlewares/userMiddleware.js";


const router = express.Router();

router.post("/", verificarToken, adicionarAtividade);
router.get("/idAtividadeKanban", verificarToken, listarAtividadesNoKanban);
router.get("/:idAtividadeKanban/:classificacao", verificarToken, listarAtividadesPorClassificacao);
router.put("/:id/:classificacao", verificarToken, atualizarKanban);
router.delete("/:id", verificarToken, deletarAtividadeDeKanban);

export default router;