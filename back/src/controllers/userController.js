import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import pool from '../db.js';
import fs from 'fs';
import path from 'path';

const SALT_ROUND = Number(process.env.SALT_ROUNDS || 10);
const EMAIL_VERIFY_EXP_MIN = Number(process.env.EMAIL_VERIFY_EXP_MIN || 60);
const RESET_EXP_MIN = Number(process.env.RESET_EXP_MIN || 30);
const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000';
const APP_BASE = process.env.APP_BASE_URL || 'http://localhost:5173';

// Configuração do Nodemailer (Gmail com senha de app)
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// FUNÇÕES AUXILIARES 
function assinarTokenVerificacao(payload) {
  return jwt.sign(payload, process.env.EMAIL_VERIFY_SECRET, { expiresIn: `${EMAIL_VERIFY_EXP_MIN}m` });
}

function verificarTokenVerificacao(token) {
  return jwt.verify(token, process.env.EMAIL_VERIFY_SECRET);
}

// CADASTRO COM VERIFICAÇÃO POR EMAIL 
export const cadastroVerificacaoEmail = async (req, res) => {
  try {
    const { username, nome, email, senha, icon } = req.body ?? {};

    const usernameStr = typeof username === 'string' ? username.trim() : '';
    const nomeStr = typeof nome === 'string' ? nome.trim() : '';
    const emailStr = typeof email === 'string' ? email.trim() : '';
    const senhaStr = String(senha ?? '').trim();

    if (!usernameStr || usernameStr.length < 4 || usernameStr.length > 12) {
      return res.status(400).json({ error: 'O username deve ter entre 4 e 12 caracteres.' });
    }

    if (!nomeStr) {
      return res.status(400).json({ error: 'Informe o nome.' });
    }

    if (nomeStr.length > 15) {
      return res.status(400).json({ error: 'O nome deve ter no máximo 15 caracteres.' });
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
    if (uRows.length) return res.status(400).json({ error: 'Username já cadastrado.' });

    const [eRows] = await pool.query('SELECT 1 FROM usuarios WHERE email = ? LIMIT 1', [emailStr]);
    if (eRows.length) return res.status(400).json({ error: 'Email já cadastrado.' });

    const senhaCriptografada = await bcrypt.hash(senhaStr, SALT_ROUND);

    const token = assinarTokenVerificacao({
      username: usernameStr,
      nome: nomeStr,
      email: emailStr,
      senhaHash: senhaCriptografada,
      icon: icon ?? null,
      iat_ms: Date.now(),
    });

    const verifyUrl = `${API_BASE}/verificar-email?token=${encodeURIComponent(token)}`;

    await mailer.sendMail({
      from: `"Kronos" <${process.env.MAIL_USER}>`,
      to: emailStr,
      subject: 'Confirme seu cadastro - Kronos',
      html: `
        <h2>Olá, ${nomeStr || usernameStr}!</h2>
        <p>Para concluir seu cadastro no <b>Kronos</b>, confirme seu e-mail clicando no botão abaixo:</p>
        <p>
          <a href="${verifyUrl}" style="padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:6px;display:inline-block">
            Confirmar meu e-mail
          </a>
        </p>
        <p style="color:#666">Este link expira em ${EMAIL_VERIFY_EXP_MIN} minutos.</p>
      `,
    });

    return res.status(200).json({ message: 'Verifique seu e-mail para ativar a conta.' });
  } catch (err) {
    console.error('Erro ao cadastrar usuário ou enviar e-mail de verificação:', err);
    return res.status(500).json({ error: 'Não foi possível processar a solicitação.' });
  }
};



// VERIFICAÇÃO DE EMAIL
export const verificarEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Token ausente.');

  let payload;
  try {
    payload = verificarTokenVerificacao(token);
  } catch (err) {
    return res.status(400).send('Token inválido ou expirado.');
  }

  const { username, nome, email, senhaHash, icon } = payload || {};
  if (!username || !email || !senhaHash) {
    return res.status(400).send('Token inválido (dados incompletos).');
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[u]] = await conn.query(
      'SELECT 1 FROM usuarios WHERE username = ? LIMIT 1',
      [username]
    );
    if (u) {
      await conn.rollback();
      return res.status(400).send('Username já cadastrado.');
    }

    const [[e]] = await conn.query(
      'SELECT 1 FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );
    if (e) {
      await conn.rollback();
      return res.status(400).send('Email já cadastrado.');
    }

    await conn.query(
      `
      INSERT INTO usuarios (username, nome, email, senha, dataCriacao, icon)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [username, nome || null, email, senhaHash, new Date(), JSON.stringify(icon ?? null)]
    );

    await conn.query(
      `
      INSERT INTO listaatividades (nomeLista, Usuarios_username)
      VALUES (?, ?)
      `,
      ['Atividades', username]
    );

    const pomodoroVals = [
      '00:25:00',
      '00:05:00',
      '00:15:00',
      4,
      1,
      1,
      '[]'
    ];

    try {
      await conn.query(
        `
        INSERT INTO pomodoro (
          username,
          duracaoFoco,
          duracaoIntervaloCurto,
          duracaoIntervaloLongo,
          ciclosFoco,
          ciclosIntervaloCurto,
          ciclosIntervaloLongo,
          atividadesVinculadas
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [username, ...pomodoroVals]
      );
    } catch (e1) {
      try {
        await conn.query(
          `
          INSERT INTO pomodoro (
            Usuarios_username,
            duracaoFoco,
            duracaoIntervaloCurto,
            duracaoIntervaloLongo,
            ciclosFoco,
            ciclosIntervaloCurto,
            ciclosIntervaloLongo,
            atividadesVinculadas
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [username, ...pomodoroVals]
        );
      } catch (e2) {
        console.warn(
          'Preferências Pomodoro não criadas (seguindo assim mesmo):',
          e2?.sqlMessage || e2
        );
      }
    }

    await conn.commit();

    res.cookie('flash_email', encodeURIComponent(email), {
      maxAge: 60_000,
      httpOnly: false,
      sameSite: 'Lax',
      path: '/',
    });

    res.cookie('flash_msg', encodeURIComponent('Conta cadastrada. Você já pode acessar.'), {
      maxAge: 60_000,
      httpOnly: false,
      sameSite: 'Lax',
      path: '/',
    });

    return res.redirect(303, `${APP_BASE.replace(/\/+$/,'')}/login`);
  } catch (err) {
    try { await conn.rollback(); } catch {}
    console.error('Erro ao verificar e-mail:', err?.sqlMessage || err);
    return res.status(500).send('Erro interno ao concluir cadastro.');
  } finally {
    conn.release();
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
  const username = req.usuarioUsername;
  try {
    const [[u]] = await pool.query(
      'SELECT username, nome, email, icon FROM usuarios WHERE username = ? LIMIT 1',
      [username]
    );
    if (!u) return res.status(404).json({ error: 'Usuário não encontrado.' });

    let iconUrl = null;
    try {
      if (u.icon) {
        const data = typeof u.icon === 'string' ? JSON.parse(u.icon) : u.icon;
        const rel = data?.url || (typeof data === 'string' ? data : null);
        if (rel) {
          iconUrl = `${API_BASE}${rel.startsWith('/') ? '' : '/'}${rel}`;
        }
      }
    } catch {}

    return res.json({
      username: u.username,
      nome: u.nome,
      email: u.email,
      icon: iconUrl, 
    });
  } catch (err) {
    return res.status(500).json({ error: err?.sqlMessage || 'Erro ao buscar perfil.' });
  }
};
  


// RESET DE SENHA
export const solicitarResetSenha = async (req, res) => {
  const email = (req.body?.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Informe o e-mail.' });

  try {
    const [rows] = await pool.query(
      'SELECT username, email FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );


    if (!rows.length) {
      return res.json({ message: 'Se o e-mail existir, enviaremos um link de redefinição.' });
    }

    const user = rows[0];
    const token = jwt.sign(
      { email: user.email, username: user.username },
      process.env.RESET_SECRET,
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
          <a href="${link}" style="padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:6px;display:inline-block">
            Redefinir minha senha
          </a>
        </p>
        <p style="color:#666">Se o botão não funcionar, copie e cole este link no navegador:<br>${link}</p>
      `,
    });

    return res.json({ message: 'Se o e-mail existir, enviaremos um link de redefinição.' });
  } catch (err) {
    console.error('Erro em solicitarResetSenha:', err);
    return res.status(500).json({ error: 'Não foi possível processar a solicitação.' });
  }
};

export const redefinirSenha = async (req, res) => {
  const { token, novaSenha } = req.body || {};
  const senha = String(novaSenha ?? '').trim();

  if (!token || !senha) {
    return res.status(400).json({ error: 'Dados incompletos.' });
  }
  if (senha.length < 5 || senha.length > 20) {
    return res.status(400).json({ error: 'A senha deve ter entre 5 e 20 caracteres.' });
  }
  const regexEspecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'"\/~]/;
  if (!regexEspecial.test(senha)) {
    return res.status(400).json({ error: 'A senha deve conter pelo menos um caractere especial.' });
  }

  try {
    const payload = jwt.verify(token, process.env.RESET_SECRET); 
    const senhaHash = await bcrypt.hash(senha, SALT_ROUND);

    const [result] = await pool.query(
      'UPDATE usuarios SET senha = ? WHERE email = ? LIMIT 1',
      [senhaHash, payload.email]
    );
    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    res.cookie('flash_email', encodeURIComponent(payload.email), {
      maxAge: 60_000,
      httpOnly: false,
      sameSite: 'Lax',
      path: '/',
    });

    return res.json({
      message: 'Senha redefinida com sucesso. Agora você já pode fazer login.',
      prefillEmail: payload.email
    });
  } catch (err) {
    console.error('Erro em redefinirSenha:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Token expirado. Solicite uma nova redefinição.' });
    }
    return res.status(400).json({ error: 'Token inválido.' });
  }
};


// CONFIRMAÇÃO DE RESET (redireciona para o front)
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

// EXCLUIR CONTA
export const excluirConta = async (req, res) => {
  const usernameAuth = req.usuarioUsername;
  if (!usernameAuth) {
    return res.status(400).json({ error: 'Usuário da sessão não identificado.' });
  }

  const conn = await pool.getConnection();

  const tryDel = async (sql, param) => {
    try {
      const [r] = await conn.query(sql, [param]);
      return r?.affectedRows ?? 0;
    } catch {
      return 0;
    }
  };

  try {
    await conn.beginTransaction();

    const delAtvPorLista = await tryDel(
      `
      DELETE A
      FROM atividades A
      JOIN listaatividades L
        ON  L.idLista = A.ListaAtividades_idLista
        AND L.Usuarios_username = A.ListaAtividades_Usuarios_username
      WHERE L.Usuarios_username = ?
      `,
      usernameAuth
    );

    const delAtvDiretas =
      (await tryDel(`DELETE FROM atividades WHERE Usuarios_username = ?`, usernameAuth)) +
      (await tryDel(`DELETE FROM atividades WHERE username = ?`, usernameAuth));

    const delEisenhower =
      (await tryDel(`DELETE FROM eisenhower WHERE Usuarios_username = ?`, usernameAuth)) +
      (await tryDel(`DELETE FROM eisenhower WHERE username = ?`, usernameAuth));

    const delKanban =
      (await tryDel(`DELETE FROM kanban WHERE Usuarios_username = ?`, usernameAuth)) +
      (await tryDel(`DELETE FROM kanban WHERE username = ?`, usernameAuth));

    const delLembretes =
      (await tryDel(`DELETE FROM lembretes WHERE Usuarios_username = ?`, usernameAuth)) +
      (await tryDel(`DELETE FROM lembretes WHERE username = ?`, usernameAuth));

    const delPomodoro =
      (await tryDel(`DELETE FROM pomodoro WHERE Usuarios_username = ?`, usernameAuth)) +
      (await tryDel(`DELETE FROM pomodoro WHERE username = ?`, usernameAuth));

    const delListas = await tryDel(
      `DELETE FROM listaatividades WHERE Usuarios_username = ?`,
      usernameAuth
    );

    const [ru] = await conn.query(
      `DELETE FROM usuarios WHERE username = ? LIMIT 1`,
      [usernameAuth]
    );
    if (ru.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    await conn.commit();

    return res.json({
      ok: true,
      message: 'Conta excluída com sucesso.',
      debug: {
        del_ativ_por_lista: delAtvPorLista,
        del_ativ_diretas: delAtvDiretas,
        del_eisenhower: delEisenhower,
        del_kanban: delKanban,
        del_lembretes: delLembretes,
        del_pomodoro: delPomodoro,
        del_listas: delListas,
        del_usuario: ru.affectedRows
      }
    });
  } catch (err) {
    try { await conn.rollback(); } catch {}
    console.error('excluirConta:', err?.sqlMessage || err);
    return res.status(500).json({
      error: err?.sqlMessage || 'Não foi possível excluir a conta.'
    });
  } finally {
    conn.release();
  }
};


// EDITAR CONTA
const PASSWORD_RULE = /^(?=.*[^A-Za-z0-9]).{5,20}$/; // 5 a 20 chars + 1 especial
const EMAIL_RULE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_CHANGE_EXP_MIN = Number(process.env.EMAIL_CHANGE_EXP_MIN || 1440);

export const editarPerfil = async (req, res) => {
  const usernameAuth = req.usuarioUsername;
  if (!usernameAuth) return res.status(401).json({ error: 'Não autenticado.' });

  const nomeReq  = (req.body?.nome ?? '').trim();
  const userReq  = (req.body?.username ?? '').trim();
  const emailReq = (req.body?.email ?? '').trim();
  const senhaReq = String(req.body?.senha ?? '').trim();

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT username, nome, email FROM usuarios WHERE username = ? LIMIT 1',
      [usernameAuth]
    );
    if (!rows?.length) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const userDB = rows[0];

    const wantsNome  = !!nomeReq  && nomeReq  !== userDB.nome;
    const wantsUser  = !!userReq  && userReq  !== userDB.username;
    const wantsEmail = !!emailReq && emailReq.toLowerCase() !== String(userDB.email || '').toLowerCase();
    const wantsSenha = !!senhaReq;

    if (wantsUser) {
      return res.status(400).json({
        error: 'Alteração de username indisponível: este campo é chave estrangeira em outras tabelas.'
      });
    }
    if (wantsNome && nomeReq.length > 15) {
      return res.status(400).json({ error: 'O nome deve ter no máximo 15 caracteres.' });
    }
    if (wantsSenha && !PASSWORD_RULE.test(senhaReq)) {
      return res.status(400).json({
        error: 'A senha deve ter entre 5 e 20 caracteres e pelo menos 1 caractere especial.',
      });
    }
    if (wantsEmail) {
      if (!EMAIL_RULE.test(emailReq)) {
        return res.status(400).json({ error: 'E-mail inválido.' });
      }
      const [dupE] = await conn.query('SELECT 1 FROM usuarios WHERE email = ? LIMIT 1', [emailReq]);
      if (dupE?.length) {
        return res.status(409).json({ error: 'O novo e-mail já está em uso.' });
      }
    }

    if (!wantsNome && !wantsSenha && !wantsEmail) {
      return res.json({ message: 'Nada para atualizar.' });
    }

    await conn.beginTransaction();

    const sets = [];
    const params = [];
    if (wantsNome)  { sets.push('nome = ?');   params.push(nomeReq); }
    if (wantsSenha) {
      const hash = await bcrypt.hash(senhaReq, SALT_ROUND);
      sets.push('senha = ?'); params.push(hash);
    }

    if (sets.length) {
      params.push(usernameAuth);
      const [ru] = await conn.query(
        `UPDATE usuarios SET ${sets.join(', ')} WHERE username = ? LIMIT 1`,
        params
      );
      if (!ru.affectedRows) {
        await conn.rollback();
        return res.status(500).json({ error: 'Falha ao atualizar perfil.' });
      }
    }

    await conn.commit();

    let pendingEmail = false;
    let mailErrMsg = null;

    if (wantsEmail) {
      pendingEmail = true;
      const token = jwt.sign(
        { sub: usernameAuth, newEmail: emailReq },
        process.env.EMAIL_VERIFY_SECRET,
        { expiresIn: `${EMAIL_CHANGE_EXP_MIN}m` }
      );

      const confirmUrl =
        `${API_BASE.replace(/\/+$/,'')}/confirmar-email?token=${encodeURIComponent(token)}`;

      try {
        console.log('[MAIL] Enviando confirmação de novo e-mail');
        console.log('  Para:', emailReq);
        console.log('  Link:', confirmUrl);

        const info = await mailer.sendMail({
          from: `"Kronos" <${process.env.MAIL_USER}>`,
          to: emailReq,
          subject: 'Confirme seu novo e-mail - Kronos',
          html: `
            <h2>Confirmação de novo e-mail</h2>
            <p>Para confirmar a alteração do seu e-mail no <b>Kronos</b>, clique no botão abaixo:</p>
            <p>
              <a href="${confirmUrl}" style="padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:6px;display:inline-block">
                Confirmar novo e-mail
              </a>
            </p>
            <p style="color:#666">Este link expira em ${EMAIL_CHANGE_EXP_MIN} minutos.</p>
          `,
        });

        console.log('[MAIL] accepted:', info?.accepted, 'rejected:', info?.rejected);
      } catch (e) {
        mailErrMsg = e?.message || String(e);
        console.error('Falha ao enviar e-mail de confirmação:', mailErrMsg);
      }
    }

    return res.json({
      message: pendingEmail
        ? (mailErrMsg
            ? 'Perfil atualizado, mas não foi possível enviar o e-mail de confirmação.'
            : 'Verifique seu novo e-mail para salvar a edição.')
        : 'Perfil atualizado com sucesso.',
      pendingEmail,
      user: {
        username: userDB.username,
        nome: wantsNome ? nomeReq : userDB.nome,
        email: userDB.email,
      },
      mailError: mailErrMsg || undefined,
    });

  } catch (err) {
    try { await conn.rollback(); } catch {}
    console.error('editarPerfil:', err?.sqlMessage || err);
    return res.status(500).json({ error: err?.sqlMessage || 'Erro ao atualizar perfil.' });
  } finally {
    conn.release();
  }
};



export const confirmarNovoEmail = async (req, res) => {
  const rawToken = req.query?.token;
  if (!rawToken) return res.status(400).json({ error: 'Token ausente.' });


  let payload;
  try {
    payload = jwt.verify(rawToken, process.env.EMAIL_VERIFY_SECRET);
  } catch (err) {
    if (err?.name === 'TokenExpiredError') {
      return res.status(410).json({ error: 'Link expirado. Solicite a alteração de e-mail novamente.' });
    }
    return res.status(400).json({ error: 'Token inválido.' });
  }


  const username = String(payload?.sub || '').trim();
  const newEmail = String(payload?.newEmail || '').trim().toLowerCase();
  if (!username || !newEmail) return res.status(400).json({ error: 'Token inválido (dados incompletos).' });
  if (!EMAIL_RULE.test(newEmail)) return res.status(400).json({ error: 'E-mail inválido.' });


  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();


    const [rowsUser] = await conn.query(
      'SELECT username, email FROM usuarios WHERE username = ? LIMIT 1',
      [username]
    );
    if (!rowsUser?.length) {
      await conn.rollback();
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }


    const [dup] = await conn.query(
      'SELECT 1 FROM usuarios WHERE email = ? AND username <> ? LIMIT 1',
      [newEmail, username]
    );
    if (dup?.length) {
      await conn.rollback();
      return res.status(409).json({ error: 'Este e-mail já está em uso.' });
    }


    const [ru] = await conn.query(
      'UPDATE usuarios SET email = ? WHERE username = ? LIMIT 1',
      [newEmail, username]
    );
    if (!ru.affectedRows) {
      await conn.rollback();
      return res.status(500).json({ error: 'Não foi possível confirmar o novo e-mail.' });
    }


    await conn.commit();


      const WEB_BASE =
      process.env.WEB_BASE ||
      process.env.FRONT_BASE_URL ||
      'http://localhost:5173';


    const url = new URL('/login', WEB_BASE);
    url.searchParams.set('email', newEmail);
    url.searchParams.set('email_changed', '1');


    return res.redirect(303, url.toString());
  } catch (err) {
    try { await conn.rollback(); } catch {}
    console.error('confirmarNovoEmail:', err?.sqlMessage || err);
    return res.status(500).json({ error: err?.sqlMessage || 'Erro ao confirmar e-mail.' });
  } finally {
    conn.release();
  }
};

const relToAbs = (rel) => `${API_BASE}${rel.startsWith('/') ? '' : '/'}${rel}`;

export const uploadIcon = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Arquivo ausente.' });

  const username = req.usuarioUsername;
  const publicPath = `/uploads/avatars/${req.file.filename}`; 

  try {
    await pool.query(
      'UPDATE usuarios SET icon = CAST(? AS JSON) WHERE username = ? LIMIT 1',
      [JSON.stringify({ url: publicPath }), username]
    );

    return res.json({
      message: 'Foto atualizada.',
      iconUrl: relToAbs(publicPath), 
    });
  } catch (err) {
    return res.status(500).json({ error: err?.sqlMessage || 'Falha ao salvar icon.' });
  }
};

export const removerIcon = async (req, res) => {
  const username = req.usuarioUsername;

  try {
    const [[row]] = await pool.query(
      'SELECT icon FROM usuarios WHERE username = ? LIMIT 1',
      [username]
    );

    if (row?.icon) {
      try {
        const data = typeof row.icon === 'string' ? JSON.parse(row.icon) : row.icon;
        const rel = data?.url || null;
        if (rel) {
          const abs = path.join(process.cwd(), rel.replace(/^\//,''));
          fs.unlinkSync(abs);
        }
      } catch {}
    }

    await pool.query(
      'UPDATE usuarios SET icon = NULL WHERE username = ? LIMIT 1',
      [username]
    );

    return res.json({ message: 'Foto removida.', iconUrl: null });
  } catch (err) {
    return res.status(500).json({ error: err?.sqlMessage || 'Falha ao remover icon.' });
  }
};







