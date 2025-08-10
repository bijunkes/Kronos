import express from 'express';
import dotenv from 'dotenv';
import router from '../src/routes/userRoutes.js';
import cors from 'cors';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

app.post('/cadastro',(req,res) => {

    const {nome} = req.body;
    const {email} = req.body;
    const {senha} = req.body;
    const {username} = req.body;

})

app.get('/usuarios',(req,res) => {



})


app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor rodando');
})