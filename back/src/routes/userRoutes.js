import express from 'express';
import verificarToken from '../middlewares/userMiddleware.js';
import {
  cadastroVerificacaoEmail,
  login,
  perfil,
  redefinirSenha,
  resetConfirmar,
  usuarioExiste,
  excluirConta,
  editarPerfil,
  confirmarNovoEmail,
  solicitarResetSenha,
  verificarEmail
} from '../controllers/userController.js';


const userRoutes = express.Router();


// público / auxiliares
userRoutes.get('/usuario-existe', usuarioExiste);
userRoutes.post('/cadastro', cadastroVerificacaoEmail);
userRoutes.post('/login', login);


// e-mail de cadastro
userRoutes.get('/verificar-email', verificarEmail);
 // Se não for usar mais, pode ser removido






// reset de senha
userRoutes.post('/senha/reset-solicitar', solicitarResetSenha);
userRoutes.get('/senha/reset-confirmar', resetConfirmar);
userRoutes.post('/senha/reset', redefinirSenha);




// PERFIL autenticado (todas sob /usuarios)
userRoutes.get('/me', verificarToken, perfil);          // era /perfil
userRoutes.put('/me', verificarToken, editarPerfil);    // era /perfil (sem auth)
userRoutes.delete('/me', verificarToken, excluirConta); // já estava /usuarios/me


// Troca a senha usando token


userRoutes.get('/perfil', verificarToken, perfil);
userRoutes.put('/perfil', verificarToken, editarPerfil);
userRoutes.delete('/perfil', verificarToken, excluirConta);


// confirmar novo e-mail (fluxo de edição)
userRoutes.get('/confirmar-email', confirmarNovoEmail);


export default userRoutes;

