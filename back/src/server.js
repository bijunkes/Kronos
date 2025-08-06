import express from 'express';
import mysql from 'mysql2/promise';
import connection from './database/db.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API rodando')
});

app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM usuarios');
        res.json(rows);
    } catch(error) {
        res.status(500).json({error: 'Erro no banco'})
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});