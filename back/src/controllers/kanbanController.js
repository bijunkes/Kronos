import pool from "../db.js";

export const adicionarAtividade = async (req, res) => {
    const {
        
        classificacao,
        dataAlteracao
    } = req.body;


    if (!classificacao) {
        return res.status(400).json({ error: "classificação é obrigatória" });
    }

    try {

        const [resultado] = await pool.query(
            `INSERT INTO kanban
                (classificacao, dataAlteracao)
                VALUES (?, ?)`,
            [
                classificacao, dataAlteracao
            ]
        );
        const idAtividadeKanban = resultado.insertId;
        
        res.status(201).json({idAtividadeKanban});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao adicionar atividade ao Kanban" });
    }
}
export const listarAtividadesNoKanban = async (req, res) => {
   
    try {
        const [linhas] = await pool.query(
            `SELECT * FROM kanban ORDER BY classificacao ASC`
        );
         console.log('Dados do kanban:', linhas);
        res.json(linhas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar kanban" });
    }

}
export const listarAtividadesPorClassificacao = async (req, res) => {
    const id = req.params.idAtividadeKanban;
    const classificacao = req.params.classificacao;

    try {
        const [atividades] = await pool.query(
            `SELECT * FROM kanban WHERE idAtividadeKanban = ? AND classificacao= ? ORDER BY idAtividadeKanban ASC`, [id, classificacao]
        );
        res.json(atividades);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar atividades do quadro" });
    }
}
export const atualizarKanban = async (req, res) => {
    const {id, classificacao, dataAlteracao}= req.params;
    console.log("id: "+ id);
    console.log(`classificação: ${classificacao} `)

    try {
        await pool.query(
            `UPDATE kanban SET
            classificacao = ?,
            dataAlteracao = ?
            WHERE idAtividadeKanban = ? `,
            [classificacao, dataAlteracao, id]
        );
       
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar Kanban" });
    }
}
export const deletarAtividadeDeKanban = async (req, res) => {
    const {id} = req.params;
    console.log(id);

    try {
        await pool.query("SET foreign_key_checks = 0;");
        await pool.query("DELETE FROM kanban WHERE idAtividadeKanban = ?", [id]);
        await pool.query("SET foreign_key_checks = 1;");
        
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Erro ao deletar atividade"});
    }
}