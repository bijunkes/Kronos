import { Router } from "express";
import { criarLista, listarListas, deletarLista } from "../controllers/listaController.js";
import verificarToken from "../middleware/verificarToken.js";

const listRoutes = Router();

listRoutes.post("/", verificarToken, criarLista);
listRoutes.get("/", verificarToken, listarListas);
listRoutes.delete("/:id", verificarToken, deletarLista);

export default listRoutes;
