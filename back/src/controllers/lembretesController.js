import pool from '../db.js';
import cron from 'node-cron';
import { enviarEmailNovoLembrete } from '../services/emailLembretes.js';

const STATUS = {
  PENDENTE: 0,
  PROXIMO: 1,
  EXPIRADO: 2,
};

async function verificarAtividades() {
  const [atividades] = await pool.query(`
    SELECT idAtividade, nomeAtividade, prazoAtividade, Usuarios_username
    FROM atividades
    WHERE prazoAtividade IS NOT NULL
  `);
  return atividades;
}

export async function listarLembretes(req, res) {
  try {
    const username = req.usuarioUsername; 

    if (!username) {
      return res.status(400).json({ error: "Usuário não autenticado." });
    }

    const [lembretes] = await pool.query(
      `SELECT * FROM lembretes WHERE Usuarios_username = ? ORDER BY dhLembrete DESC`,
      [username.trim()]
    );

    res.json(lembretes);
  } catch (error) {
    console.error("Erro ao listar lembretes:", error);
    res.status(500).json({ error: "Erro ao buscar lembretes." });
  }
}


export async function gerarLembretesAtividadesProximas() {
  const atividades = await verificarAtividades();
  if (atividades.length === 0) return;

  const agora = new Date();
  const amanha = new Date(agora);
  amanha.setDate(agora.getDate() + 1);
  amanha.setHours(0, 0, 0, 0);
  const amanhaData = amanha.toISOString().split("T")[0];

  const usuariosNotificados = new Set();

  for (const atividade of atividades) {
    const prazo = new Date(atividade.prazoAtividade);
    const prazoData = prazo.toISOString().split("T")[0];

    if (prazoData === amanhaData) {
      const [existe] = await pool.query(
        `SELECT 1 FROM lembretes
         WHERE tituloLembrete = ? AND Usuarios_username = ? AND statusLembrete = ? LIMIT 1`,
        [atividade.nomeAtividade, atividade.Usuarios_username, STATUS.PROXIMO]
      );

      if (existe.length === 0) {
        await pool.query(
          `INSERT INTO lembretes
            (tituloLembrete, dhLembrete, descricao, statusLembrete, Usuarios_username)
           VALUES (?, NOW(), ?, ?, ?)`,
          [
            atividade.nomeAtividade,
            "Você tem uma atividade com prazo para amanhã.",
            STATUS.PROXIMO,
            atividade.Usuarios_username,
          ]
        );
        console.log(`Lembrete criado: ${atividade.nomeAtividade} (${atividade.Usuarios_username})`);
      }

      if (!usuariosNotificados.has(atividade.Usuarios_username)) {
        const [usuario] = await pool.query(
          `SELECT nome, email FROM usuarios WHERE username = ? LIMIT 1`,
          [atividade.Usuarios_username]
        );
        if (usuario.length > 0 && usuario[0].email) {
          await enviarEmailNovoLembrete({
            nome: usuario[0].nome,
            email: usuario[0].email,
            titulo: "Atividades próximas!",
            descricao:
              "Você possui atividades com prazo para amanhã. Acesse o Kronos e confira seus lembretes.",
            data: amanha,
          });
          usuariosNotificados.add(atividade.Usuarios_username);
          console.log(`Email de lembrete próximo enviado para ${usuario[0].email}`);
        }
      }
    }
  }
}

export async function gerarLembretesExpirados() {
  const atividades = await verificarAtividades();
  if (atividades.length === 0) return;

  const agora = new Date();
  const ontem = new Date(agora);
  ontem.setDate(agora.getDate() - 1);
  ontem.setHours(0, 0, 0, 0);
  const ontemData = ontem.toISOString().split("T")[0];

  const usuariosNotificados = new Set();

  for (const atividade of atividades) {
    const prazo = new Date(atividade.prazoAtividade);
    const prazoData = prazo.toISOString().split("T")[0];

    if (prazoData === ontemData) {
      const [existe] = await pool.query(
        `SELECT 1 FROM lembretes
         WHERE tituloLembrete = ? AND Usuarios_username = ? AND statusLembrete = ? LIMIT 1`,
        [atividade.nomeAtividade, atividade.Usuarios_username, STATUS.EXPIRADO]
      );

      if (existe.length === 0) {
        await pool.query(
          `INSERT INTO lembretes
            (tituloLembrete, dhLembrete, descricao, statusLembrete, Usuarios_username)
           VALUES (?, NOW(), ?, ?, ?)`,
          [
            atividade.nomeAtividade,
            "A atividade expirou no dia anterior.",
            STATUS.EXPIRADO,
            atividade.Usuarios_username,
          ]
        );
        console.log(`Lembrete de expiração criado: ${atividade.nomeAtividade} (${atividade.Usuarios_username})`);
      }

      if (!usuariosNotificados.has(atividade.Usuarios_username)) {
        const [usuario] = await pool.query(
          `SELECT nome, email FROM usuarios WHERE username = ? LIMIT 1`,
          [atividade.Usuarios_username]
        );
        if (usuario.length > 0 && usuario[0].email) {
          await enviarEmailNovoLembrete({
            nome: usuario[0].nome,
            email: usuario[0].email,
            titulo: "Atividades expiradas!",
            descricao:
              "Algumas de suas atividades expiraram ontem. Acesse o Kronos e veja o que perdeu.",
            data: ontem,
          });
          usuariosNotificados.add(atividade.Usuarios_username);
          console.log(`Email de lembrete expirado enviado para ${usuario[0].email}`);
        }
      }
    }
  }
}

export async function excluirLembretes(req, res) {
  const usernameAuth = req.usuarioUsername;

  if (!usernameAuth) {
    return res.status(400).json({ error: "Usuário da sessão não identificado." });
  }

  try {
    await pool.query(`DELETE FROM lembretes WHERE Usuarios_username = ?`, [usernameAuth]);
    res.json({ message: "Todos os lembretes foram excluídos com sucesso." });
    console.log(`Lembretes excluídos para ${usernameAuth}`);
  } catch (error) {
    console.error("Erro ao excluir lembretes:", error);
    res.status(500).json({ error: "Erro ao excluir lembretes." });
  }
}

cron.schedule(
  "0 21 * * *",
  async () => {
    console.log("Gerando lembretes de atividades próximas (21h)...");
    await gerarLembretesAtividadesProximas();
  },
  { timezone: "America/Sao_Paulo" }
);

cron.schedule(
  "0 0 * * *",
  async () => {
    console.log("Gerando lembretes de atividades expiradas (00h)...");
    await gerarLembretesExpirados();
  },
  { timezone: "America/Sao_Paulo" }
);
