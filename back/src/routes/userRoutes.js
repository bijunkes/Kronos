import express from 'express';
import verificarToken from '../middlewares/userMiddleware.js';
import {cadastro, login, perfil} from '../controllers/userController.js';

const router = express.Router();

router.post('/cadastro', cadastro);
router.post('/login', login);
router.get('/perfil', verificarToken, perfil);

export default router;
