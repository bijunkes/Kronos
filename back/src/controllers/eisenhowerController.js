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
            `INSERT INTO eisenhower
                (classificacao, dataAlteracao)
                VALUES (?, ?)`,
            [
                classificacao, dataAlteracao
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
    
    const classificacao = req.params.classificacao;

    try {
        const [atividades] = await pool.query(
            `SELECT * FROM eisenhower WHERE classificacao= ? ORDER BY classificacao ASC`, [ classificacao]
        );
        res.json(atividades);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar atividades do quadrante" });
    }
}
export const atualizarMatriz = async (req, res) => {
    const {id, classificacao, dataAlteracao}= req.params;
    console.log("id: "+ id);
    console.log(`classificação: ${classificacao} `)

    try {
        await pool.query(
            `UPDATE eisenhower SET
            classificacao = ?,
            dataAlteracao = ?
            WHERE idAtividadeEisenhower = ? `,
            [classificacao, dataAlteracao, id]
        );
        res.json({ message: "Matriz atualizada" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar matriz" });
    }
}
export const deletarAtividadeDeMatriz = async (req, res) => {
    const {id} = req.params;
    console.log(id);

    try {
        await pool.query("SET foreign_key_checks = 0;");
        await pool.query("DELETE FROM eisenhower WHERE idAtividadeEisenhower = ?", [id]);
        await pool.query("SET foreign_key_checks = 1;");
        res.json({message: "Atividade deletada"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Erro ao deletar atividade"});
    }
}
export const contaPorClassificacao = async (req, res) => {
    const {classificacao, dataAlteracao}= req.params;
    console.log(`classificação: ${classificacao} `)
    console.log(dataAlteracao)

    try {
        const contagem = await pool.query(
            `SELECT COUNT(*) AS total, DATE(dataAlteracao) FROM eisenhower JOIN atividades a ON idAtividadeEisenhower = a.Eisenhower_idAtividadeEisenhower WHERE classificacao = ? AND DATE(dataAlteracao) = ? AND a.statusAtividade = 0`,
            [classificacao, dataAlteracao]
        );
        console.log("Contagem: "+ contagem[0])
        res.json(contagem[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao contar elementos!" });
    }
}