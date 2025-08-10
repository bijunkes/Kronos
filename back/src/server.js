import express from 'express';
import dotenv from 'dotenv';
import router from '../src/routes/userRoutes.js';
import cors from 'cors';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/usuarios',(req,res) => {



})


app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor rodando');
})