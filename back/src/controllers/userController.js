
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import pool from '../db.js';

const SALT_ROUND = 10;

// Gmail com senha de app
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const EMAIL_VERIFY_EXP_MIN = Number(process.env.EMAIL_VERIFY_EXP_MIN || 60);

function assinarTokenVerificacao(payload) {
  return jwt.sign(payload, process.env.EMAIL_VERIFY_SECRET, {
    expiresIn: `${EMAIL_VERIFY_EXP_MIN}m`,
  });
}
function verificarTokenVerificacao(token) {
  return jwt.verify(token, process.env.EMAIL_VERIFY_SECRET);
}

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000';   
const APP_BASE = process.env.APP_BASE_URL || 'http://localhost:5173';   

const RESET_EXP_MIN = Number(process.env.RESET_EXP_MIN || 30);
const RESET_SECRET  = process.env.RESET_SECRET;

//  CADASTRO + VERIFICAÇÃO POR E-MAIL 

export const cadastroVerificacaoEmail = async (req, res) => {
  const { username, nome, email, senha, icon } = req.body;

  if (!username || username.length < 4) {
    return res.status(400).json({ error: 'O username deve ter no mínimo 4 caracteres.' });
  }
  const regexEspecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'/`~]/;
  if (!senha || !regexEspecial.test(senha)) {
    return res.status(400).json({ error: 'A senha deve conter pelo menos um caractere especial.' });
  }

  try {
    const [uRows] = await pool.query('SELECT 1 FROM usuarios WHERE username = ? LIMIT 1', [username]);
    if (uRows.length) return res.status(400).json({ error: 'Username já cadastrado' });

    const [eRows] = await pool.query('SELECT 1 FROM usuarios WHERE email = ? LIMIT 1', [email]);
    if (eRows.length) return res.status(400).json({ error: 'Email já cadastrado' });

    const senhaCriptografada = await bcrypt.hash(senha, SALT_ROUND);

    const token = assinarTokenVerificacao({
      username,
      nome,
      email,
      senhaHash: senhaCriptografada,
      icon: icon ?? null,
      iat_ms: Date.now(),
    });

    const verifyUrl = `${API_BASE}/verificar-email?token=${encodeURIComponent(token)}`;

    await mailer.sendMail({
      from: `"Kronos" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Confirme seu cadastro - Kronos',
      html: `
        <h2>Olá, ${nome || username}!</h2>
        <p>Para concluir seu cadastro no <b>Kronos</b>, confirme seu e-mail clicando no botão abaixo:</p>
        <p>
          <a href="${verifyUrl}"
             style="padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:6px;display:inline-block">
             Confirmar meu e-mail
          </a>
        </p>
        <p style="color:#666">Este link expira em ${EMAIL_VERIFY_EXP_MIN} minutos.</p>
      `,
    });

    return res.status(200).json({
      message: 'Enviamos um link de confirmação para seu e-mail. Conclua por lá para ativar sua conta.',
    });
  } catch (err) {
    console.error('Erro ao iniciar verificação por e-mail:', err);
    return res.status(500).json({ error: 'Não foi possível enviar o e-mail de verificação.' });
  }
};

export const verificarEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Token ausente.');

  try {
    const { username, nome, email, senhaHash, icon } = verificarTokenVerificacao(token);

    const [[u]] = await pool.query('SELECT 1 FROM usuarios WHERE username = ? LIMIT 1', [username]);
    if (u) return res.status(400).send('Username já cadastrado.');

    const [[e]] = await pool.query('SELECT 1 FROM usuarios WHERE email = ? LIMIT 1', [email]);
    if (e) return res.status(400).send('Email já cadastrado.');

    const dataCriacao = new Date();
    const iconString = JSON.stringify(icon ?? null);

    await pool.query(
      'INSERT INTO usuarios (username, nome, email, senha, dataCriacao, icon) VALUES (?, ?, ?, ?, ?, ?)',
      [username, nome, email, senhaHash, dataCriacao, iconString]
    );

    await pool.query(
      'INSERT INTO ListaAtividades (nomeLista, Usuarios_username) VALUES (?, ?)',
      ['Atividades', username]
    );

    const loginUrl = `${APP_BASE}/login`;

    res.status(303).location(loginUrl);
    return res.send(`<!doctype html>
      <meta charset="utf-8" />
      <title>Redirecionando…</title>
      <meta http-equiv="refresh" content="0;url='${loginUrl}'" />
      <script>window.location.replace(${JSON.stringify(loginUrl)});</script>
      <p>Redirecionando para <a href="${loginUrl}">login</a>…</p>
    `);
  } catch (err) {
    console.error('Erro ao verificar e-mail:', err.code || err.message || err);
    if (err && (err.code === 'ER_DUP_ENTRY' || err.errno === 1062)) {
      return res.status(400).send('Conta já confirmada ou dados já utilizados.');
    }
    return res.status(400).send('Token inválido ou expirado.');
  }
};

// LOGIN / PERFIL 

export const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    const usuario = usuarios[0];

    const senhaValida = bcrypt.compareSync(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ username: usuario.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ auth: true, token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

export const perfil = async (req, res) => {
  const usuarioUsername = req.usuarioUsername;

  try {
    const [usuarios] = await pool.query(
      'SELECT username, nome, email, senha, dataCriacao, icon FROM usuarios WHERE username = ?',
      [usuarioUsername]
    );
    if (usuarios.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(usuarios[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

// se o email for confirmado, a tela do nevegador vai redirecionar para o login (tipo oq o google faz)

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

//  RESET DE SENHA 

export const solicitarResetSenha = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Informe o e-mail.' });

  try {
    const [rows] = await pool.query('SELECT username, email FROM usuarios WHERE email = ? LIMIT 1', [email]);
    if (!rows.length) {
      return res.json({ message: 'Se o e-mail existir, enviaremos um link de redefinição.' });
    }
    const user = rows[0];

    const token = jwt.sign(
      { email: user.email, username: user.username },
      RESET_SECRET,
      { expiresIn: `${RESET_EXP_MIN}m` }
    );

    const link = `${API_BASE}/senha/reset-confirmar?token=${encodeURIComponent(token)}`;

    await mailer.sendMail({
      from: `"Kronos" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: 'Redefinir senha - Kronos',
      html: `
        <h2>Redefinição de senha</h2>
        <p>Clique no botão abaixo para definir uma nova senha (expira em ${RESET_EXP_MIN} minutos):</p>
        <p>
          <a href="${link}"
             style="padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:6px;display:inline-block">
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

// GET /senha/reset-confirmar?token=...  -> redireciona ao front com ?token=...
export const resetConfirmar = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Token ausente.');

  const url = `${APP_BASE}/resetar-senha?token=${encodeURIComponent(token)}`;

  res.status(303).location(url);
  return res.send(`<!doctype html>
    <meta charset="utf-8" />
    <title>Redirecionando…</title>
    <meta http-equiv="refresh" content="0;url='${url}'" />
    <script>window.location.replace(${JSON.stringify(url)});</script>
    <p>Redirecionando para <a href="${url}">redefinição</a>…</p>
  `);
};

// POST /senha/reset  { token, novaSenha }
export const redefinirSenha = async (req, res) => {
  const { token, novaSenha } = req.body;
  if (!token || !novaSenha) return res.status(400).json({ error: 'Dados incompletos.' });

  const regexEspecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'/`~]/;
  if (!regexEspecial.test(novaSenha)) {
    return res.status(400).json({ error: 'A senha deve conter pelo menos um caractere especial.' });
  }

  try {
    const payload = jwt.verify(token, RESET_SECRET);
    const { email } = payload;

    const senhaHash = await bcrypt.hash(novaSenha, SALT_ROUND);
    const [result] = await pool.query('UPDATE usuarios SET senha = ? WHERE email = ? LIMIT 1', [senhaHash, email]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }
    return res.json({ message: 'Senha redefinida com sucesso. Agora você já pode fazer login.' });
  } catch (err) {
    console.error('Erro em redefinirSenha:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Token expirado. Solicite uma nova redefinição.' });
    }
    return res.status(400).json({ error: 'Token inválido.' });
  }
};
