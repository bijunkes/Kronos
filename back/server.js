import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

import cookieParser from 'cookie-parser';

import userRoutes from './src/routes/userRoutes.js';
import listRoutes from './src/routes/listRoutes.js';
import atividadeRoutes from "./src/routes/atividadeRoutes.js";
import pomodoroRouter from './src/routes/pomodoroRoutes.js';
import eisenRoutes from "./src/routes/eisenRoutes.js";
import kanbanRoutes from "./src/routes/kanbanRoutes.js"

const app = express();

const APP_BASE = process.env.APP_BASE_URL || 'http://localhost:5173';
const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000';

const ALLOWED_ORIGINS = [
  APP_BASE,
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

app.use(cookieParser());

const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');
const AVATARS_DIR = path.join(UPLOAD_ROOT, 'avatars');
fs.mkdirSync(AVATARS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_ROOT));

app.get('/status', (req, res) => res.json({ ok: true }));

app.use('/', userRoutes);

app.use('/listas', listRoutes);
app.use('/atividades', atividadeRoutes);
app.use('/pomodoro', pomodoroRouter);
app.use('/eisenhower', eisenRoutes);
app.use('/kanban', kanbanRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err?.message || err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`APP_BASE_URL: ${APP_BASE}`);
  console.log(`API_BASE_URL: ${API_BASE}`);
});

