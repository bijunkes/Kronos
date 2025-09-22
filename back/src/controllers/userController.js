import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import pool from '../db.js';

const SALT_ROUND = 10;
const EMAIL_VERIFY_EXP_MIN = Number(process.env.EMAIL_VERIFY_EXP_MIN || 60);
const RESET_EXP_MIN = Number(process.env.RESET_EXP_MIN || 30);
const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000';
const APP_BASE = process.env.APP_BASE_URL || 'http://localhost:5173';

// Configuração do Nodemailer (Gmail com senha de app)


// FUNÇÕES AUXILIARES 

// CADASTRO COM VERIFICAÇÃO POR EMAIL 
export const cadastroVerificacaoEmail = async (req, res) => {
  try {
    const { username, nome, email, senha, icon } = req.body ?? {};

    const usernameStr = typeof username === 'string' ? username.trim() : '';
    const nomeStr     = typeof nome     === 'string' ? nome.trim()     : '';
    const emailStr    = typeof email    === 'string' ? email.trim()    : '';
    const senhaStr    = String(senha ?? '').trim(); // <- garante string

    if (!usernameStr || usernameStr.length < 4) {
      return res.status(400).json({ error: 'O username deve ter no mínimo 4 caracteres.' });
    }

    if (!nomeStr) {
      return res.status(400).json({ error: 'Informe o nome.' });
    }

    if (nomeStr.length > 15) {
      return res.status(400).json({ error: 'O nome deve ter no máximo 15 carcteres' });
    }

    if (!emailStr) {
      return res.status(400).json({ error: 'Informe o e-mail.' });
    }

    if (senhaStr.length < 5 || senhaStr.length > 20) {
      return res.status(400).json({ error: 'A senha deve ter entre 5 e 20 caracteres.' });
    }

    const regexEspecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'"\/~]/;
    if (!regexEspecial.test(senhaStr)) {
      return res.status(400).json({ error: 'A senha deve conter pelo menos um caractere especial.' });
    }

    const [uRows] = await pool.query('SELECT 1 FROM usuarios WHERE username = ? LIMIT 1', [usernameStr]);
    if (uRows.length) return res.status(400).json({ error: 'Username já cadastrado' });

    const [eRows] = await pool.query('SELECT 1 FROM usuarios WHERE email = ? LIMIT 1', [emailStr]);
    if (eRows.length) return res.status(400).json({ error: 'Email já cadastrado' });

    const senhaCriptografada = await bcrypt.hash(senhaStr, SALT_ROUND);

    await pool.query(
  'INSERT INTO usuarios (username, nome, email, senha, dataCriacao, icon) VALUES (?, ?, ?, ?, ?, ?)',
  [usernameStr, nomeStr, emailStr, senhaCriptografada, new Date(), JSON.stringify(icon ?? null)]
);

return res.status(200).json({ message: 'Cadastro realizado com sucesso!' });

    
  } catch (err) {
    console.error('Erro ao cadastrar usuário ou enviar e-mail de verificação:', err);
    return res.status(500).json({ error: 'Não foi possível processar a solicitação.' });
  }
};


// LOGIN 
export const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (!usuarios.length) return res.status(401).json({ error: 'Usuário não encontrado' });

    const usuario = usuarios[0];
    const senhaValida = bcrypt.compareSync(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ username: usuario.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ auth: true, token });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
};

// PERFIL 
export const perfil = async (req, res) => {
  const usuarioUsername = req.usuarioUsername;
  try {
    const [usuarios] = await pool.query(
      'SELECT username, nome, email, senha, dataCriacao, icon FROM usuarios WHERE username = ?',
      [usuarioUsername]
    );
    if (!usuarios.length) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.json(usuarios[0]);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

// RESET DE SENHA 
export const solicitarResetSenha = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Informe o e-mail.' });

  try {
    const [rows] = await pool.query('SELECT username, email FROM usuarios WHERE email = ? LIMIT 1', [email]);
    if (!rows.length) return res.json({ message: 'Se o e-mail existir, enviaremos um link de redefinição.' });

    const user = rows[0];
    const token = jwt.sign({ email: user.email, username: user.username }, process.env.RESET_SECRET, { expiresIn: `${RESET_EXP_MIN}m` });

    const link = `${API_BASE}/senha/reset-confirmar?token=${encodeURIComponent(token)}`;
    await mailer.sendMail({
      from: `"Kronos" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: 'Redefinir senha - Kronos',
      html: `
        <h2>Redefinição de senha</h2>
        <p>Clique no botão abaixo para definir uma nova senha (expira em ${RESET_EXP_MIN} minutos):</p>
        <p>
          <a href="${link}" style="padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:6px;display:inline-block">
            Redefinir minha senha
          </a>
        </p>
      `,
    });

    return res.json({ message: 'Se o e-mail existir, enviaremos um link de redefinição.' });
  } catch (err) {
    console.error('Erro em solicitarResetSenha:', err);
    return res.status(500).json({ error: 'Não foi possível processar a solicitação.' });
  }
};

export const redefinirSenha = async (req, res) => {
  const { token, novaSenha } = req.body;
  if (!token || !novaSenha) return res.status(400).json({ error: 'Dados incompletos.' });

  const regexEspecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'/~]/;
  if (!regexEspecial.test(novaSenha)) return res.status(400).json({ error: 'A senha deve conter pelo menos um caractere especial.' });

  if (!senha || senha.length < 5 || senha.length > 20) {
    return res.status(400).json({
      error: 'A senha deve ter entre 5 e 20 caracteres.'
    });
  }

  try {
    const payload = jwt.verify(token, process.env.RESET_SECRET);
    const senhaHash = await bcrypt.hash(novaSenha, SALT_ROUND);

    const [result] = await pool.query('UPDATE usuarios SET senha = ? WHERE email = ? LIMIT 1', [senhaHash, payload.email]);
    if (result.affectedRows === 0) return res.status(400).json({ error: 'Usuário não encontrado.' });

    return res.json({ message: 'Senha redefinida com sucesso. Agora você já pode fazer login.' });
  } catch (err) {
    console.error('Erro em redefinirSenha:', err);
    if (err.name === 'TokenExpiredError') return res.status(400).json({ error: 'Token expirado. Solicite uma nova redefinição.' });
    return res.status(400).json({ error: 'Token inválido.' });
  }
};

// CONFIRMAÇÃO DE RESET (redireciona para front) 
export const resetConfirmar = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Token ausente.');

  const url = `${APP_BASE}/resetar-senha?token=${encodeURIComponent(token)}`;

  res.status(303).location(url);
  return res.send(`
    <!doctype html>
    <meta charset="utf-8" />
    <title>Redirecionando…</title>
    <meta http-equiv="refresh" content="0;url='${url}'" />
    <script>window.location.replace(${JSON.stringify(url)});</script>
    <p>Redirecionando para <a href="${url}">redefinição</a>…</p>
  `);
};

// VERIFICA SE USUÁRIO EXISTE 
export const usuarioExiste = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ exists: false });

  try {
    const [[row]] = await pool.query('SELECT 1 FROM usuarios WHERE email = ? LIMIT 1', [email]);
    return res.json({ exists: !!row });
  } catch (err) {
    console.error('Erro ao verificar existencia de usuario:', err);
    return res.status(500).json({ exists: false });
  }
};

