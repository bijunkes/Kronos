import express from 'express';
import { criarAtividade, listarAtividades, listarAtividadesPorLista, atualizarAtividade, deletarAtividade, listarTodasAtividades, atualizarIdEisenAtividade, atualizarIdKanbanAtividade } from '../controllers/atividadeController.js';
import verificarToken from "../middlewares/userMiddleware.js";

const router = express.Router();

router.post("/", verificarToken, criarAtividade);
router.get("/", verificarToken, listarAtividades);
router.get("/lista/:listaId", verificarToken, listarAtividadesPorLista);
router.put("/:id", verificarToken, atualizarAtividade);
router.delete("/:id", verificarToken, deletarAtividade);
router.get("/", verificarToken, listarTodasAtividades);
router.put("/eisenhower/:id", verificarToken, atualizarIdEisenAtividade);
router.put("/kanban/:id", verificarToken, atualizarIdKanbanAtividade);

export default router;