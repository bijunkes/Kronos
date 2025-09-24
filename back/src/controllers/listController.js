import pool from '../db.js';


export const criarLista = async (req, res) => {
    const {nome} = req.body;
    const usuarioUsername = req.usuarioUsername; 

    if (!nome) return res.status(400).json({ error: "Nome da lista é obrigatório" });

    try {
        const [listasExistentes] = await pool.query(
            'SELECT idLista FROM ListaAtividades WHERE Usuarios_username = ? AND nomeLista = ?',
            [usuarioUsername, nome]
        )

        if (listasExistentes.length > 0) {
            return res.status(400).json({ error: 'Lista existente'});
        }

        const [resultado] = await pool.query(
            "INSERT INTO listaatividades (nomeLista, Usuarios_username) VALUES (?, ?)", [nome, usuarioUsername]
        );
        
        res.status(200).json({ 
            message: "Lista Criada",
            idLista: resultado.insertId,
            nomeLista: nome
        });
    } catch (err) {
        console.log("Erro ao criar lista", err);
        res.status(400).json({error: "Erro ao criar lista"});
    }
}

export const listarListas = async (req, res) => {
    const usuarioUsername = req.usuarioUsername;

    try{
        const [listas] = await pool.query(
            `SELECT * FROM ListaAtividades
             ORDER BY idLista DESC`, [usuarioUsername]
        );
        res.json(listas);
    } catch (err) {
        console.log("Erro ao buscar listas:", err);
        res.status(500).json({error: "Erro ao buscar listas"});
    }
}

export const deletarLista = async (req, res) => {
    const { id } = req.params;
    const usuarioUsername = req.usuarioUsername;

    try {
        await pool.query(
            "DELETE FROM atividades WHERE ListaAtividades_idLista = ? AND Usuarios_username = ?",
            [id, usuarioUsername]
        );
        const [resultado] = await pool.query(
            "DELETE FROM listaatividades WHERE idLista = ? AND Usuarios_username = ?",
            [id, usuarioUsername]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Lista não encontrada" });
        }

        res.json({ message: "Lista e atividades deletadas com sucesso" });
    } catch (err) {
        console.log("Erro ao deletar lista:", err);
        res.status(500).json({ error: "Erro ao deletar lista" });
    }
};


export const garantirListaAtividades = async (usuarioUsername) => {
    const [listas] = await pool.query(
        "SELECT * FROM listaatividades WHERE nomeLista = ? AND Usuarios_username = ?", ["Atividades", usuarioUsername]
    );
    
    if(listas.length > 0) return listas[0];

    const [result] = await pool.query(
        "INSERT INTO listaatividades (nomeLista, Usuarios_username) VALUES (?, ?)", ["Atividades", usuarioUsername]
    );
    return {idLista: result.insertId, nomeLista: "Atividades", Usuarios_username: usuarioUsername};
}


