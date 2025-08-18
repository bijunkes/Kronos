import React, { useState } from "react"
import axios from 'axios';
import {
    Container,
    Parte1,
    Logo,
    LeftAlign,
    Negrito,
    Opaco,
    ButtonEntrar,
    Parte2,
    Form,
    Negrito2,
    Opaco2,
    Input,
    ButtonCadastrar,
} from './styles.js'
import { useNavigate } from "react-router-dom";
import { cadastrarUsuario } from "../../services/API.js";

function Cadastro() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '',
        nome: '',
        email: '',
        senha: '',
        icon: null
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.nome || !form.username || !form.email || !form.senha) {
            alert('Preencha todos os campos');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/cadastro', form);
            setError('');
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Erro no cadastro');
        }
    }

    const irParaLogin = () => {
        navigate("/login");
    };

    return (
        <Container>
            <Parte1>
                <Logo>KRONOS</Logo>
                <LeftAlign>
                    <Negrito>Bem-vindo <br />de volta!</Negrito>
                    <Opaco>Acesse sua conta agora mesmo.</Opaco>
                </LeftAlign>
                <ButtonEntrar onClick={irParaLogin}>ENTRAR</ButtonEntrar>
            </Parte1>
            <Parte2>

                <Form onSubmit={handleSubmit}>
                    <Negrito2>Crie uma conta</Negrito2>
                    <Opaco2>Preencha seus dados.</Opaco2>
                    <Input
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        value={form.nome}
                        onChange={handleChange}
                    />
                    <Input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                    />
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <Input
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={form.senha}
                        onChange={handleChange}
                    />
                    <ButtonCadastrar type="submit">CADASTRAR</ButtonCadastrar>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </Form>
            </Parte2>
        </Container>

    )
}

export default Cadastro;