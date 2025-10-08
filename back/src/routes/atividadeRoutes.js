import express from 'express';
<<<<<<< HEAD
import { criarAtividade, listarAtividades, listarAtividadesPorLista, atualizarAtividade, deletarAtividade, listarTodasAtividades } from '../controllers/atividadeController.js';
=======
import { criarAtividade, listarAtividades, listarAtividadesPorLista, atualizarAtividade, deletarAtividade, atualizarIdEisenAtividade } from '../controllers/atividadeController.js';
>>>>>>> semEmail
import verificarToken from "../middlewares/userMiddleware.js";

const router = express.Router();

router.post("/", verificarToken, criarAtividade);
router.get("/", verificarToken, listarAtividades);
router.get("/lista/:listaId", verificarToken, listarAtividadesPorLista);
router.put("/:id", verificarToken, atualizarAtividade);
router.put("/eisenhower/:id", verificarToken, atualizarIdEisenAtividade);
router.delete("/:id", verificarToken, deletarAtividade);
router.get("/", verificarToken, listarTodasAtividades);

export default router;