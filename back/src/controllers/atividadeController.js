import pool from "../db.js";
import { garantirListaAtividades } from "./listController.js";
import { fromZonedTime } from "date-fns-tz";
import { format } from "date-fns";

const TIMEZONE = "America/Sao_Paulo";

export const criarAtividade = async (req, res) => {
  const {
    nomeAtividade,
    prazoAtividade,
    dataConclusao,
    descricaoAtividade = "",
    statusAtividade = 0,
    listaId,
  } = req.body;

  const usuario = req.usuarioUsername;

  if (!nomeAtividade || !prazoAtividade || !usuario) {
    return res
      .status(400)
      .json({ error: "Nome, prazo e usuário são obrigatórios" });
  }

  try {
    const dataUtc = fromZonedTime(prazoAtividade, TIMEZONE);
    const dataFormatada = format(dataUtc, "yyyy-MM-dd HH:mm:ss");

    let listaAtual = listaId;
    if (!listaAtual) {
      const listaPadrao = await garantirListaAtividades(usuario);
      listaAtual = listaPadrao.idLista;
    }

    const [resultado] = await pool.query(
      `INSERT INTO atividades
        (nomeAtividade, statusAtividade, descricaoAtividade, prazoAtividade, dataConclusao, 
         ListaAtividades_idLista, ListaAtividades_Usuarios_username, Usuarios_username)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nomeAtividade,
        statusAtividade,
        descricaoAtividade,
        dataFormatada,
        null,
        listaAtual,
        usuario,
        usuario,
      ]
    );

    res
      .status(201)
      .json({ message: "Atividade criada", idAtividade: resultado.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar atividade" });
  }
};



export const atualizarAtividade = async (req, res) => {
  const usuario = req.usuarioUsername;
  const idAtividade = req.params.id;

  const {
    nomeAtividade,
    descricaoAtividade,
    prazoAtividade,
    statusAtividade,
    dataConclusao,
    ListaAtividades_idLista,
    Pomodoro_idStatus,
    Kanban_idAtividadeKanban,
    Eisenhower_idAtividadeEisenhower,
  } = req.body;

  try {
    const dataFormatada = prazoAtividade
      ? format(fromZonedTime(prazoAtividade, TIMEZONE), "yyyy-MM-dd HH:mm:ss")
      : null;

    await pool.query(
      `UPDATE atividades SET
          nomeAtividade = ?,
          descricaoAtividade = ?,
          prazoAtividade = ?,
          statusAtividade = ?,
          dataConclusao = ?,
          ListaAtividades_idLista = ?,
          Pomodoro_idStatus = ?,
          Kanban_idAtividadeKanban = ?,
          Eisenhower_idAtividadeEisenhower = ?
        WHERE idAtividade = ? AND Usuarios_username = ?`,
      [
        nomeAtividade,
        descricaoAtividade || null,
        dataFormatada,
        statusAtividade,
        dataConclusao || null,
        ListaAtividades_idLista,
        Pomodoro_idStatus || null,
        Kanban_idAtividadeKanban || null,
        Eisenhower_idAtividadeEisenhower || null,
        idAtividade,
        usuario,
      ]
    );

    res.json({ message: ""});
  } catch (err) {
    console.error("Erro ao atualizar atividade:", err);
    res.status(500).json({ error: "Erro ao atualizar atividade" });
  }
};

export const atualizarIdEisenAtividade = async (req, res) => {
  const usuario = req.body.Usuarios_username;
  const idAtividade = req.body.idAtividade;
  const idEisen = req.body.Eisenhower_idAtividadeEisenhower;

  try {
    await pool.query(
      `UPDATE atividades SET
        Eisenhower_idAtividadeEisenhower = ?
        WHERE idAtividade = ? AND Usuarios_username = ?`,
      [idEisen, idAtividade, usuario]
    );
    res.json({ message:""});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar atividade" });
  }
};

export const atualizarIdKanbanAtividade = async (req, res) => {
  const usuario = req.body.Usuarios_username;
  const idAtividade = req.body.idAtividade;
  const idKanban = req.body.Kanban_idAtividadeKanban;

  try {
    await pool.query(
      `UPDATE atividades SET
        Kanban_idAtividadeKanban = ?
        WHERE idAtividade = ? AND Usuarios_username = ?`,
      [idKanban, idAtividade, usuario]
    );
    res.json({ message:""});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar atividade" });
  }
};

export const listarAtividades = async (req, res) => {
  const usuario = req.usuarioUsername;
  try {
    const [atividades] = await pool.query(
      `SELECT *, DATE(dataConclusao) as dataDeConclusao 
       FROM atividades 
       WHERE Usuarios_username = ? 
       ORDER BY dataConclusao ASC`,
      [usuario]
    );
    res.json(atividades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar atividades" });
  }
};

export const listarAtividadesPorLista = async (req, res) => {
  const usuario = req.usuarioUsername;
  const listaId = req.params.listaId;

  try {
    const [atividades] = await pool.query(
      `SELECT * 
       FROM atividades 
       WHERE Usuarios_username = ? AND ListaAtividades_idLista = ? 
       ORDER BY dataConclusao ASC`,
      [usuario, listaId]
    );
    res.json(atividades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar atividades da lista" });
  }
};

export const deletarAtividade = async (req, res) => {
  const usuario = req.usuarioUsername;
  const idAtividade = req.params.id;

  try {
    await pool.query(
      "DELETE FROM atividades WHERE idAtividade = ? AND Usuarios_username = ?",
      [idAtividade, usuario]
    );
    res.json({ message: "Atividade excluída" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar atividade" });
  }
};

export const listarTodasAtividades = async (req, res) => {
  const usuarioUsername = req.usuarioUsername;

  try {
    const [atividades] = await pool.query(
      `SELECT a.*
       FROM atividades a
       JOIN listaatividades l ON a.ListaAtividades_idLista = l.idLista
       WHERE a.Usuarios_username = ?
       ORDER BY a.prazoAtividade ASC`,
      [usuarioUsername]
    );
    res.json(atividades);
  } catch (err) {
    console.error("Erro ao listar todas atividades:", err);
    res.status(500).json({ error: "Erro ao listar todas atividades" });
  }
};
