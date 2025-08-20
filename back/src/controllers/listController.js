import pool from "../../db.js";

export const criarLista = async (req, res) => {
    const {nome} = req.body;
    const usuarioUsername = req.usuarioUsername; // vem pelo token

    try {
        await pool.query(
            "INSERT INTO listaatividades (nomeLista, Usuarios_username) VALUES (?, ?)", [nome, usuarioUsername]
        );
        res.status(200).json({message: "Lista criada"});
    } catch (err) {
        console.log("Erro ao criar lista", err);
        res.status(400).json({error: "Erro ao criar lista"});
    }
}

export const listarListas = async (req, res) => {
    const usuarioUsername = req.usuarioUsername;

    try{
        const [listas] = await pool.query(
            "SELECT idLista, nomeLista FROM listaatividades WHERE Usuarios_username = ?", [usuarioUsername]
        );
        res.json(listas);
    } catch (err) {
        console.log("Erro ao buscar listas:", err);
        res.status(500).json({error: "Erro ao buscar listas"});
    }
}

export const deletarLista = async (req, res) => {
    const {id} = req.params;
    const usuarioUsername = req.usuarioUsername;

    try {
        const [resultado] = await pool.query(
            "DELETE FROM listaatividades WHERE idLista = ? AND Usuarios_username = ?",
            [id, usuarioUsername]
        );

        if(resultado.affectedRows === 0) {
            return res.status(404).json({error: "Lista não encontrada"});
        }

        res.json({message: "Lista deletada com sucesso"});
    } catch (err) {
        console.log("Erro ao deletar lista:", err);
        res.status(500).json({error: "Erro ao deletar lista"});
    }
}