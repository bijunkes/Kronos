import express from 'express';
import verificarToken from '../middlewares/userMiddleware.js';
import {
  cadastroVerificacaoEmail,
  verificarEmail,
  login,
  perfil,
  solicitarResetSenha,
  redefinirSenha,
  resetConfirmar,
  usuarioExiste
} from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.get('/usuario-existe', usuarioExiste);
userRoutes.post('/cadastro', cadastroVerificacaoEmail);
userRoutes.post('/login', login);

userRoutes.get('/verificar-email', verificarEmail);

userRoutes.post('/senha/reset-solicitar', solicitarResetSenha);
userRoutes.get('/senha/reset-confirmar', resetConfirmar);
userRoutes.post('/senha/reset', redefinirSenha);

userRoutes.get('/perfil', verificarToken, perfil);

export default userRoutes;
