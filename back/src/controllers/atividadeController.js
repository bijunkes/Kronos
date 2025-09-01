import pool from "../db.js";
import { garantirListaAtividades } from "./listController.js";

export const criarAtividade = async (req, res) => {
    const {
        nomeAtividade, 
        prazoAtividade, 
        descricaoAtividade = '', statusAtividade = 0, 
        listaId 
    } = req.body;

    const usuario = req.usuarioUsername;

    if (!nomeAtividade || !prazoAtividade || !usuario) {
        return res.status(400).json({ error: "Nome, prazo e usuário são obrigatórios" });
    }

    try {
        let listaAtual = listaId;
        if (!listaAtual) {
            const listaPadrao = await garantirListaAtividades(usuario);
            listaAtual = listaPadrao.idLista;
        }

        const dataCriacao = new Date();

        const [resultado] = await pool.query(
            `INSERT INTO atividades
                (nomeAtividade, 
                statusAtividade, 
                descricaoAtividade, 
                prazoAtividade, 
                dataCriacao, 
                ListaAtividades_idLista, 
                ListaAtividades_Usuarios_username,
                Usuarios_username)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nomeAtividade, 
                statusAtividade, descricaoAtividade, 
                prazoAtividade, 
                dataCriacao, 
                listaAtual, 
                usuario, 
                usuario
            ]
        );
        res.status(201).json({ message: "Atividade criada", idAtividade: resultado.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao criar atividade" });
    }
}

export const listarAtividades = async (req, res) => {
    const usuario = req.usuarioUsername;
    try {
        const [atividades] = await pool.query(
            `SELECT * FROM atividades WHERE Usuarios_username = ? ORDER BY dataCriacao ASC`, [usuario]
        );
        res.json(atividades);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar atividades" });
    }
}

export const listarAtividadesPorLista = async (req, res) => {
    const usuario = req.usuarioUsername;
    const listaId = req.params.listaId;

    try {
        const [atividades] = await pool.query(
            `SELECT * FROM atividades WHERE Usuarios_username = ? AND ListaAtividades_idLista = ? ORDER BY dataCriacao ASC`, [usuario, listaId]
        );
        res.json(atividades);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar atividades da lista" });
    }
}

export const atualizarAtividade = async (req, res) => {
    const usuario = req.usuarioUsername;
    const idAtividade = req.params.id;
    const { nomeAtividade, descricaoAtividade, prazoAtividade, statusAtividade } = req.body;

    try {
        await pool.query(
            `UPDATE atividades SET
            nomeAtividade = ?,
            descricaoAtividade = ?,
            prazoAtividade = ?,
            statusAtividade = ?
            WHERE idAtividade = ? AND Usuarios_username = ?`,
            [nomeAtividade, descricaoAtividade, prazoAtividade, statusAtividade, idAtividade, usuario]
        );
        res.json({ message: "Atividade atualizada" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar atividade" });
    }
}

export const deletarAtividade = async (req, res) => {
    const usuario = req.usuarioUsername;
    const idAtividade = req.params.id;

    try {
        await pool.query(
            "DELETE FROM atividades WHERE idAtividade = ? AND Usuarios_username = ?", [idAtividade, usuario]
        );
        res.json({message: "Atividade deletada"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Erro ao deletar atividade"});
    }
}

