import pool from "../../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const cadastro = async (req, res) => {
    const {username, nome, email, senha, icon} = req.body;
    const senhaCriptografada = bcrypt.hashSync(senha, 8);
    const dataCriacao = new Date();

    try {
        const [usuariosExistentes] = await pool.query('SELECT username FROM usuarios WHERE username = ?', [username]);

        if (usuariosExistentes.length > 0) {
            return res.status(400).json({error: 'Username já cadastrado'});
        }

        const [emailsExistentes] = await pool.query('SELECT email FROM usuarios WHERE email = ?', [email]);
        if (emailsExistentes.length > 0) {
            return res.status(400).json({error: 'Email já cadastrado'});
        }

        const iconString = JSON.stringify(icon);
        await pool.query(
            'INSERT INTO usuarios (username, nome, email, senha, dataCriacao, icon) VALUES (?, ?, ?, ?, ?, ?)', 
            [username, nome, email, senhaCriptografada, dataCriacao, iconString]
        );
        res.status(200).json({message: 'Usuário cadastrado'});
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(400).json({error: 'Erro ao cadastrar usuário'});
    }
};

export const login = async (req, res) => {
    const{email, senha} = req.body;

    try {
        const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (usuarios.length === 0){
            return res.status(401).json({error: 'Usuário não encontrado'});
        }
        const usuario = usuarios[0];

        const senhaValida = bcrypt.compareSync(senha, usuario.senha);
        if (!senhaValida) return res.status(401).json({error: 'Senha incorreta'});

        const token = jwt.sign({username: usuario.username}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({auth: true, token});
    } catch (err) {
        res.status(500).json({error: 'Erro no servidor'});
    }
};

export const perfil = async (req, res) => {
    const usuarioUsername = req.usuarioUsername;

    try {
        const [usuarios] = await pool.query('SELECT username, nome, email, senha, dataCriacao, icon  FROM usuarios WHERE username = ?', [req.usuarioUsername]);
        if (usuarios.length === 0) return res.status(404).json({error: 'Usuário não encontrado'});
        res.json(usuarios[0]);
    } catch (error) {
        res.status(500).json({error: 'Erro ao buscar usuário'});
    }
}