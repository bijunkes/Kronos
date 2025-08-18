import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
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
    EsqueceuSenha
} from './styles.js'
import axios from 'axios';

function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!email || !senha) {
            alert('Preencha todos os campos');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/login', { email, senha });

            if (response.data.auth) {
                localStorage.setItem('token', response.data.token);
                navigate('/home');
            } else {
                alert('Falha ao autenticar');
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Erro ao fazer login');
        }
    }

    function handleVoltar() {
        navigate('/cadastro')
    }

    return (
        <Container>
            <Parte1>
                <Logo>KRONOS</Logo>
                <LeftAlign>
                    <Negrito>Não possui<br />um cadastro?</Negrito>
                    <Opaco>Cadastre-se clicando logo abaixo.</Opaco>
                </LeftAlign>
                <ButtonEntrar onClick={handleVoltar}>VOLTAR</ButtonEntrar>
            </Parte1>
            <Parte2>

                <Form onSubmit={handleSubmit}>
                    <Negrito2>Acesse sua conta</Negrito2>
                    <Opaco2>Preencha seus dados.</Opaco2>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} style={{marginBottom: '3vh'}}
                    />
                    <Input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                    />
                    <EsqueceuSenha>
                        Esqueceu a senha?
                    </EsqueceuSenha>
                    <ButtonCadastrar type="submit">ENTRAR</ButtonCadastrar>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </Form>
            </Parte2>
        </Container>

    )
}

export default Login