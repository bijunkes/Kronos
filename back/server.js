
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './src/routes/userRoutes.js';
import listRoutes from './src/routes/listRoutes.js';
//<<<<<<< HEAD>>>>>>> 26cefd12a68bba35a0078c3a95b0aa0f05379265
//=======
import atividadeRoutes from "./src/routes/atividadeRoutes.js";

dotenv.config();

const app = express();

const ALLOWED_ORIGINS = [
  process.env.APP_BASE_URL || 'http://localhost:5173',
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin ${origin} não permitida pelo CORS`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/status', (req, res) => res.json({ ok: true }));

app.use('/', userRoutes);
app.use('/listas', listRoutes);
app.use('/atividades', atividadeRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err?.message || err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando`);
  console.log(`APP_BASE_URL: ${process.env.APP_BASE_URL || 'http://localhost:5173'}`);
  console.log(`API_BASE_URL: ${process.env.API_BASE_URL || `http://localhost:${PORT}`}`);
});
