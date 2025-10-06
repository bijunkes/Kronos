import pool from "../db.js";

export const adicionarAtividade = async (req, res) => {
    const {
        
        classificacao,
    } = req.body;


    if (!classificacao) {
        return res.status(400).json({ error: "classificação são obrigatórios" });
    }

    try {

        const [resultado] = await pool.query(
            `INSERT INTO eisenhower
                (classificacao)
                VALUES (?)`,
            [
                classificacao
            ]
        );
        const idAtividadeEisenhower = resultado.insertId;
        
        res.status(201).json({idAtividadeEisenhower, message: "Atividade adicionada ao Eisenhower"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao adicionar atividade ao Eisenhower" });
    }
}
export const listarAtividadesNaMatriz = async (req, res) => {
   
    try {
        const [linhas] = await pool.query(
            `SELECT * FROM eisenhower ORDER BY classificacao ASC`
        );
         console.log('Dados da matriz:', linhas);
        res.json(linhas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar matriz" });
    }
}
export const listarAtividadesPorClassificacao = async (req, res) => {
    const id = req.params.idAtividadeEisenhower;
    const classificacao = req.params.classificacao;

    try {
        const [atividades] = await pool.query(
            `SELECT * FROM eisenhower WHERE idAtividadeEisenhower = ? AND classificacao= ? ORDER BY idAtividadeEisenhower ASC`, [id, classificacao]
        );
        res.json(atividades);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar atividades do quadrante" });
    }
}
export const atualizarMatriz = async (req, res) => {
    const id = req.body.idAtividadeEisenhower;
    const classificacao = req.body.classificacao;

    try {
        await pool.query(
            `UPDATE eisenhower SET
            classificacao = ?
            WHERE idAtividadeEisenhower = ? `,
            [classificacao, id]
        );
        res.json({ message: "Matriz atualizada" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar matriz" });
    }
}
export const deletarAtividadeDeMatriz = async (req, res) => {
    const id = req.body.idAtividadeEisenhower;
    const classificacao = req.body.classificacao;

    try {
        await pool.query(
            "DELETE FROM eisenhower WHERE idAtividadeEisenhower = ? AND classificacao = ?", [id, classificacao]
        );
        res.json({message: "Atividade deletada"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Erro ao deletar atividade"});
    }
}