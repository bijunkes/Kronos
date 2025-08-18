import express from 'express';
import verificarToken from '../middlewares/userMiddleware.js';
import {cadastro, login, perfil} from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.post('/cadastro', cadastro);
userRoutes.post('/login', login);
userRoutes.get('/perfil', verificarToken, perfil);

export default userRoutes;
