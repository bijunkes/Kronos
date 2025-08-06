const express = require('express');
const router = express.Router();
import verificarToken from '../middlewares/userMiddleare.js';
import {cadastro, login, perfil} from '../src/controllers/userControllers.js';

router.post('/cadastro', cadastro);
router.post('/login', login);
router.get('/perfil', verificarToken, perfil);

export default router;
