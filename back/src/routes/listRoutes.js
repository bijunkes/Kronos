import { Router } from 'express';
import { criarLista, listarListas, deletarLista, garantirListaAtividades, atualizarLista } from '../controllers/listController.js';
import verificarToken from '../middlewares/userMiddleware.js';

const listRoutes = Router();

listRoutes.post('/', verificarToken, criarLista);
listRoutes.get('/', verificarToken, listarListas);
listRoutes.delete('/:id', verificarToken, deletarLista);
listRoutes.put('/:id', verificarToken, atualizarLista);

listRoutes.get('/atividades', verificarToken, async (req, res) => {
    try {
        const usuarioUsername = req.usuarioUsername;
        const lista = await garantirListaAtividades(usuarioUsername);
        res.json(lista);
    } catch (err) {
        console.error("Erro ao garantir lista Atividades:", err);
        res.status(500).json({ error: "Erro ao garantir lista Atividades" });
    }
});

export default listRoutes;
