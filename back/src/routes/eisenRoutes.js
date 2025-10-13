import express from 'express';
import { adicionarAtividade, listarAtividadesNaMatriz, listarAtividadesPorClassificacao, atualizarMatriz, deletarAtividadeDeMatriz } from '../controllers/eisenhowerController.js';
import verificarToken from "../middlewares/userMiddleware.js";


const router = express.Router();

router.post("/", verificarToken, adicionarAtividade);
router.get("/idAtividadeEisenhower", verificarToken, listarAtividadesNaMatriz);
router.get("/:idAtividadeEisenhower/:classificacao", verificarToken, listarAtividadesPorClassificacao);
router.put("/", verificarToken, atualizarMatriz);
router.delete("/", verificarToken, deletarAtividadeDeMatriz);

export default router;