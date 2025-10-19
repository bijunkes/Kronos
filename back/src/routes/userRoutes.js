import express from 'express';
import path from 'path';
import multer from 'multer';
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
  verificarEmail,
  uploadIcon,     // implemente no controller
  removerIcon     // implemente no controller
} from '../controllers/userController.js';

const userRoutes = express.Router();

/* ================== Upload de avatar ================== */
const AVATARS_DIR = path.join(process.cwd(), 'uploads', 'avatars');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATARS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.png';
    cb(null, `${req.usuarioUsername}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    const ok = /image\/(png|jpeg|jpg|webp)/.test(file.mimetype);
    cb(ok ? null : new Error('Formato de imagem inválido (use PNG, JPG ou WEBP)'), ok);
  }
});
/* ===================================================== */

/* -------- Público / auxiliares -------- */
userRoutes.get('/usuario-existe', usuarioExiste);
userRoutes.post('/cadastro', cadastroVerificacaoEmail);
userRoutes.post('/login', login);

/* -------- E-mail de cadastro -------- */
userRoutes.get('/verificar-email', verificarEmail);

/* -------- Reset de senha -------- */
userRoutes.post('/senha/reset-solicitar', solicitarResetSenha);
userRoutes.get('/senha/reset-confirmar', resetConfirmar);
userRoutes.post('/senha/reset', redefinirSenha);

/* =========================================================
   PERFIL autenticado
   Exponha as rotas com e sem prefixo /usuarios para evitar 404
   ========================================================= */

// Sem prefixo (compatibilidade)
userRoutes.get('/me', verificarToken, perfil);
userRoutes.put('/me', verificarToken, editarPerfil);
userRoutes.delete('/me', verificarToken, excluirConta);
userRoutes.put('/me/icon', verificarToken, upload.single('icon'), uploadIcon);
userRoutes.delete('/me/icon', verificarToken, removerIcon);

// Com prefixo /usuarios (para o front atual)
userRoutes.get('/usuarios/me', verificarToken, perfil);
userRoutes.put('/usuarios/me', verificarToken, editarPerfil);
userRoutes.delete('/usuarios/me', verificarToken, excluirConta);
userRoutes.put('/usuarios/me/icon', verificarToken, upload.single('icon'), uploadIcon);
userRoutes.delete('/usuarios/me/icon', verificarToken, removerIcon);

/* -------- Legado opcional -------- */
userRoutes.get('/perfil', verificarToken, perfil);
userRoutes.put('/perfil', verificarToken, editarPerfil);
userRoutes.delete('/perfil', verificarToken, excluirConta);

/* -------- Confirmar novo e-mail -------- */
userRoutes.get('/confirmar-email', confirmarNovoEmail);

export default userRoutes;
