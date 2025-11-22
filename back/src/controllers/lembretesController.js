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
    const usernameAuth = req.usuarioUsername;

    if (!usernameAuth) {
      return res.status(400).json({ error: "Usuário não autenticado." });
    }

    const [lembretes] = await pool.query(
      `SELECT *
         FROM lembretes
        WHERE Usuarios_username = ?
        ORDER BY dhLembrete DESC`,
      [usernameAuth.trim()]
    );

    return res.json(lembretes);

  } catch (error) {
    console.error("Erro ao listar lembretes:", error);
    return res.status(500).json({ error: "Erro ao buscar lembretes." });
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

    const prazoData = new Date(atividade.prazoAtividade)
      .toISOString()
      .split("T")[0];

    if (prazoData === amanhaData) {

      const [existe] = await pool.query(
        `SELECT 1 FROM lembretes
          WHERE tituloLembrete = ?
            AND Usuarios_username = ?
            AND statusLembrete = ?
          LIMIT 1`,
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
            tipo: 'proximo',
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

    const prazoData = new Date(atividade.prazoAtividade)
      .toISOString()
      .split("T")[0];

    if (prazoData === ontemData) {

      const [existe] = await pool.query(
        `SELECT 1 FROM lembretes
          WHERE tituloLembrete = ?
            AND Usuarios_username = ?
            AND statusLembrete = ?
          LIMIT 1`,
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
        console.log(`Lembrete expirado criado: ${atividade.nomeAtividade} (${atividade.Usuarios_username})`);
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
            tipo: 'expirado',
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
    await pool.query(
      `DELETE FROM lembretes WHERE Usuarios_username = ?`,
      [usernameAuth]
    );

    console.log(`Lembretes excluídos para ${usernameAuth}`);
    return res.json({ message: "Todos os lembretes foram excluídos com sucesso." });

  } catch (error) {
    console.error("Erro ao excluir lembretes:", error);
    return res.status(500).json({ error: "Erro ao excluir lembretes." });
  }
}

export const excluirLembrete = async (req, res) => {
  console.log("DELETE LEMBRETE");
  console.log("id:", req.params.id);
  console.log("usernameAuth:", req.usuarioUsername);

  try {
    console.log(">>> ROUTE DELETE /lembretes/:id chamada");
    console.log("Headers Authorization:", req.headers.authorization);
    console.log("req.usuarioUsername (middleware):", req.usuarioUsername);

    const usuario = req.usuarioUsername;
    const idParam = req.params.id;

    if (!usuario) {
      console.warn("Middleware não forneceu req.usuarioUsername");
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!idParam) {
      console.warn("ID não fornecido na requisição");
      return res.status(400).json({ error: "ID do lembrete não fornecido" });
    }

    const idNum = Number(idParam);
    if (!Number.isFinite(idNum) || idNum <= 0) {
      console.warn("ID inválido:", idParam);
      return res.status(400).json({ error: "ID inválido" });
    }

    let rowsSelect;
    try {
      const [rows] = await pool.query(
        "SELECT * FROM lembretes WHERE idLembretes = ?",
        [idNum]
      );
      rowsSelect = rows;

      console.log("SELECT encontrado:", JSON.stringify(rowsSelect, null, 2));

      if (!rowsSelect || rowsSelect.length === 0) {
        console.warn("Lembrete não encontrado no SELECT:", idNum);
        return res.status(404).json({ error: "Lembrete não encontrado" });
      }

      const registro = rowsSelect[0];

      if (registro.Usuarios_username && registro.Usuarios_username !== usuario) {
        console.warn(
          `Tentativa de deletar lembrete de outro usuário. Banco=${registro.Usuarios_username} / Req=${usuario}`
        );
        return res.status(403).json({ error: "Lembrete não pertence ao usuário" });
      }
    } catch (selErr) {
      console.error("Erro no SELECT de verificação:", selErr);
      return res.status(500).json({ error: "Erro ao buscar lembrete" });
    }

    console.log(
      "Executando DELETE FROM lembretes WHERE idLembretes = ? AND Usuarios_username = ?",
      [idNum, usuario]
    );

    const [deleteResult] = await pool.query(
      "DELETE FROM lembretes WHERE idLembretes = ? AND Usuarios_username = ?",
      [idNum, usuario]
    );

    console.log("Resultado do DELETE:", deleteResult);

    if (deleteResult.affectedRows === 0) {
      console.warn("DELETE executado mas nada foi afetado.");
      return res.status(404).json({ error: "Lembrete não encontrado ou não pertence ao usuário" });
    }

    console.log(`Lembrete ${idNum} excluído com sucesso para o usuário ${usuario}`);
    return res.json({ });

  } catch (err) {
    console.error("Erro ao deletar lembrete (catch):", err);
    return res.status(500).json({ error: "Erro ao deletar lembrete" });
  }
};



export async function detalhesLembrete(req, res) {
  try {
    const rawId = req.params.id;
    const usernameAuth = req.usuarioUsername;

    if (!usernameAuth) {
      return res.status(400).json({ error: "Usuário não autenticado." });
    }

    let lembreteRow;
    const idNum = Number(rawId);

    if (Number.isFinite(idNum) && idNum > 0) {
      const [lemRes] = await pool.query(
        `SELECT * FROM lembretes 
          WHERE idLembretes = ? AND Usuarios_username = ? 
          LIMIT 1`,
        [idNum, usernameAuth]
      );
      lembreteRow = lemRes[0];

    } else {
      const [lemRes] = await pool.query(
        `SELECT * FROM lembretes 
          WHERE tituloLembrete = ? AND Usuarios_username = ? 
          LIMIT 1`,
        [rawId, usernameAuth]
      );
      lembreteRow = lemRes[0];
    }

    if (!lembreteRow) {
      return res.status(404).json({ error: "Lembrete não encontrado." });
    }

    const lembrete = lembreteRow;

    const [ativRes] = await pool.query(
      `SELECT idAtividade, nomeAtividade, prazoAtividade, ListaAtividades_idLista
         FROM atividades
        WHERE nomeAtividade = ? AND Usuarios_username = ?
        LIMIT 1`,
      [lembrete.tituloLembrete, usernameAuth]
    );

    const atividade = ativRes.length > 0 ? ativRes[0] : null;

    const [userRes] = await pool.query(
      `SELECT nome FROM usuarios WHERE username = ? LIMIT 1`,
      [usernameAuth]
    );

    const usuarioNome = userRes.length > 0 ? userRes[0].nome : null;

    let listas = [];
    if (atividade?.ListaAtividades_idLista) {
      const [listaRes] = await pool.query(
        `SELECT nomeLista 
           FROM listaatividades 
          WHERE idLista = ? AND Usuarios_username = ?`,
        [atividade.ListaAtividades_idLista, usernameAuth]
      );

      listas = listaRes.map(l => l.nomeLista);
    }

    return res.json({
        idLembrete: lembrete.idLembretes,
        tituloLembrete: lembrete.tituloLembrete,
        descricao: lembrete.descricao,
        dhLembrete: lembrete.dhLembrete,
        statusLembrete: lembrete.statusLembrete,
        usuarioNome,
        prazoAtividade: atividade ? atividade.prazoAtividade : null,
        idAtividade: atividade ? atividade.idAtividade : null, 
        listas,
      });


  } catch (err) {
    console.error("Erro ao buscar detalhes do lembrete:", err);
    return res.status(500).json({ error: "Erro ao buscar detalhes do lembrete." });
  }
}


cron.schedule(
  "0 19 * * *",
  async () => {
    console.log("Gerando lembretes de atividades próximas (19h)...");
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
