import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import pool from '../db.js';

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
    const senhaStr = String(senha ?? '').trim(); // <- garante string

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

  try {
    const { username, nome, email, senhaHash, icon } = verificarTokenVerificacao(token);

    const [[u]] = await pool.query('SELECT 1 FROM usuarios WHERE username = ? LIMIT 1', [username]);
    if (u) return res.status(400).send('Username já cadastrado.');

    const [[e]] = await pool.query('SELECT 1 FROM usuarios WHERE email = ? LIMIT 1', [email]);
    if (e) return res.status(400).send('Email já cadastrado.');

    await pool.query(
      'INSERT INTO usuarios (username, nome, email, senha, dataCriacao, icon) VALUES (?, ?, ?, ?, ?, ?)',
      [username, nome, email, senhaHash, new Date(), JSON.stringify(icon ?? null)]
    );

    await pool.query(
      'INSERT INTO ListaAtividades (nomeLista, Usuarios_username) VALUES (?, ?)',
      ['Atividades', username]
    );

    await pool.query(`
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
`, [
      username,
      '00:25:00',
      '00:05:00',
      '00:15:00',
      4,
      1,
      1,
      '[]'
    ]);

    const loginUrl = `${APP_BASE}/login`;
    res.status(303).location(loginUrl);
    return res.send(`
      <!doctype html>
      <meta charset="utf-8" />
      <title>Redirecionando…</title>
      <meta http-equiv="refresh" content="0;url='${loginUrl}'" />
      <script>window.location.replace(${JSON.stringify(loginUrl)});</script>
      <p>Redirecionando para <a href="${loginUrl}">login</a>…</p>
    `);
    res.cookie('flash_email', encodeURIComponent(email), {
      maxAge: 60_000,
      httpOnly: false,
      sameSite: 'Lax',
      path: '/',
      domain: 'localhost', 
    });

    res.cookie('flash_msg', encodeURIComponent('Conta cadastrada. Você já pode acessar.'), {
      maxAge: 60_000,
      httpOnly: false,
      sameSite: 'Lax',
      path: '/',
      domain: 'localhost',
    });

    return res.redirect(303, `${APP_BASE}/login`);
  } catch (err) {
    console.error('Erro ao verificar e-mail:', err);
    return res.status(400).send('Token inválido ou expirado.');
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
  const email = (req.body?.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Informe o e-mail.' });

  try {
    const [rows] = await pool.query(
      'SELECT username, email FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );

    // resposta genérica para não vazar existência de conta
    if (!rows.length) {
      return res.json({ message: 'Se o e-mail existir, enviaremos um link de redefinição.' });
    }

    const user = rows[0];
    const token = jwt.sign(
      { email: user.email, username: user.username },
      process.env.RESET_SECRET,
      { expiresIn: `${RESET_EXP_MIN}m` }
    );

    // o link bate na API e redireciona para a página do front
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

  // regras de senha
  if (senha.length < 5 || senha.length > 20) {
    return res.status(400).json({ error: 'A senha deve ter entre 5 e 20 caracteres.' });
  }
  const regexEspecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;'"\/~]/;
  if (!regexEspecial.test(senha)) {
    return res.status(400).json({ error: 'A senha deve conter pelo menos um caractere especial.' });
  }

  try {
    const payload = jwt.verify(token, process.env.RESET_SECRET); // { email, username }
    const senhaHash = await bcrypt.hash(senha, SALT_ROUND);

    const [result] = await pool.query(
      'UPDATE usuarios SET senha = ? WHERE email = ? LIMIT 1',
      [senhaHash, payload.email]
    );

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
  try {
    await conn.beginTransaction();


    const [rAtvList] = await conn.query(`
      DELETE A
      FROM atividades A
      JOIN listaatividades L
        ON  L.idLista = A.ListaAtividades_idLista
        AND L.Usuarios_username = A.ListaAtividades_Usuarios_username
      WHERE L.Usuarios_username = ?
    `, [usernameAuth]);


    const [rAtvUser] = await conn.query(
      `DELETE FROM atividades WHERE Usuarios_username = ?`,
      [usernameAuth]
    );


    const [rList] = await conn.query(
      `DELETE FROM listaatividades WHERE Usuarios_username = ?`,
      [usernameAuth]
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
        del_ativ_por_lista: rAtvList?.affectedRows ?? 0,
        del_ativ_diretas: rAtvUser?.affectedRows ?? 0,
        del_listas: rList?.affectedRows ?? 0
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
const PASSWORD_RULE = /^(?=.*[^A-Za-z0-9]).{5,}$/;
const EMAIL_RULE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_CHANGE_EXP_MIN = Number(process.env.EMAIL_CHANGE_EXP_MIN || 1440);


export const editarPerfil = async (req, res) => {
  const usernameAuth = req.usuarioUsername;
  if (!usernameAuth) return res.status(401).json({ error: 'Não autenticado.' });


  const nomeReq  = (req.body?.nome ?? '').trim();
  const userReq  = (req.body?.username ?? '').trim();
  const emailReq = (req.body?.email ?? '').trim();
  const senhaReq = String(req.body?.senha ?? '');


  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT username, nome, email FROM usuarios WHERE username = ? LIMIT 1',
      [usernameAuth]
    );
    if (!rows?.length) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
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
    if (wantsNome && nomeReq.length > 20) {
      return res.status(400).json({ error: 'O nome deve ter no máximo 20 caracteres.' });
    }
    if (wantsSenha && !PASSWORD_RULE.test(senhaReq)) {
      return res.status(400).json({
        error: 'A nova senha deve ter no mínimo 5 caracteres e pelo menos 1 caractere especial.',
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
    if (wantsEmail) {
      pendingEmail = true;
      const token = jwt.sign(
        { sub: usernameAuth, newEmail: emailReq },
        process.env.EMAIL_VERIFY_SECRET,
        { expiresIn: `${EMAIL_CHANGE_EXP_MIN}m` }
      );
      const confirmUrl = `${API_BASE}/usuarios/confirmar-email?token=${encodeURIComponent(token)}`;


      try {
        await mailer.sendMail({
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
      } catch (mailErr) {
        console.error('Falha ao enviar e-mail de confirmação:', mailErr?.message || mailErr);
      }
    }


    return res.json({
      //message: 'Perfil atualizado com sucesso.',
      pendingEmail,
      user: {
        username: userDB.username,
        nome: wantsNome ? nomeReq : userDB.nome,
        email: userDB.email,
      },
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








