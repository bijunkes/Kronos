import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './src/routes/userRoutes.js';
import listRoutes from './src/routes/listRoutes.js';
import atividadeRoutes from "./src/routes/atividadeRoutes.js";
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173' 
}));

app.use(express.json());

app.use('/', userRoutes);
app.use('/listas', listRoutes);
app.use('/atividades', atividadeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor rodando');
})