import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function autenticarSSE(req, res, next) {
  const token = req.query.token;

  if (!token) {
    res.write(
      `event: erro\ndata: ${JSON.stringify({ error: "Token não fornecido" })}\n\n`
    );
    return res.end();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioUsername = decoded.username;
    next();
  } catch (err) {
    console.error("Erro ao validar token SSE:", err);
    res.write(
      `event: erro\ndata: ${JSON.stringify({ error: "Token inválido" })}\n\n`
    );
    return res.end();
  }
}
