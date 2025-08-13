import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default function verificarToken(req, res, next){
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({error: 'Token não fornecido'});

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) return res.status(401).json({error: 'Token inválido'});

        req.usuarioUsername = decoded.username;
        next();
    })
}