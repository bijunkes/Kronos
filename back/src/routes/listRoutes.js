import { Router } from 'express';
import { criarLista, listarListas, deletarLista } from '../controllers/listController.js';
import verificarToken from '../middlewares/userMiddleware.js';

const listRoutes = Router();

listRoutes.post('/', verificarToken, criarLista);
listRoutes.get('/', verificarToken, listarListas);
listRoutes.delete('/:id', verificarToken, deletarLista);

export default listRoutes;
