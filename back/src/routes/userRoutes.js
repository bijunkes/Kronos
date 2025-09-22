import express from 'express';
import verificarToken from '../middlewares/userMiddleware.js';
import {
  cadastroVerificacaoEmail,
  login,
  perfil,
  redefinirSenha,
  resetConfirmar,
  usuarioExiste
} from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.get('/usuario-existe', usuarioExiste);
userRoutes.post('/cadastro', cadastroVerificacaoEmail);
userRoutes.post('/login', login);

 // Se não for usar mais, pode ser removido

// Troca a senha usando token

userRoutes.get('/perfil', verificarToken, perfil);

export default userRoutes;