import express from "express";
import { eventosLembretes } from "../controllers/eventosController.js";
import { autenticarSSE } from "../middlewares/authSSE.js";

const router = express.Router();

router.get("/lembretes/eventos", autenticarSSE, (req, res) => {
    console.log("TOKEN RECEBIDO NO SSE:", req.query.token);
    return eventosLembretes(req, res);
});

export default router;
