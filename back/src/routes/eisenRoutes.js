import express from 'express';
import { adicionarAtividade, listarAtividadesNaMatriz, listarAtividadesPorClassificacao, atualizarMatriz, deletarAtividadeDeMatriz, contaPorClassificacao} from '../controllers/eisenhowerController.js';
import verificarToken from "../middlewares/userMiddleware.js";


const router = express.Router();

router.post("/", verificarToken, adicionarAtividade);
router.get("/", verificarToken, listarAtividadesNaMatriz);
router.get("/contagem/:classificacao", verificarToken, listarAtividadesPorClassificacao);
router.get("/contagem/:classificacao/:dataAlteracao", verificarToken, contaPorClassificacao);
router.put("/:id/:classificacao/:dataAlteracao", verificarToken, atualizarMatriz);
router.delete("/:id", verificarToken, deletarAtividadeDeMatriz);

export default router;