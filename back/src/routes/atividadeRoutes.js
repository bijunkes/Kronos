import express from 'express';
import { criarAtividade, listarAtividades, listarAtividadesPorLista, atualizarAtividade, deletarAtividade } from '../controllers/atividadeController.js';
import verificarToken from "../middlewares/userMiddleware.js";

const router = express.Router();

router.post("/", verificarToken, criarAtividade);
router.get("/", verificarToken, listarAtividades);
router.get("/lista/:listaId", verificarToken, listarAtividadesPorLista);
router.put("/:id", verificarToken, atualizarAtividade);
router.delete("/:id", verificarToken, deletarAtividade);

export default router;