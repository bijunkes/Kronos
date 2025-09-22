import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Parte1, Logo, LeftAlign, Negrito, Opaco, ButtonEntrar,
  Parte2, Form, Negrito2, Opaco2, Input, ButtonCadastrar, EsqueceuSenha
} from './styles.js';
import LogoKronos from '../../assets/LogoKronos.png';
import { loginUsuario} from '../../services/api.js';
import { showOkToast } from '../../components/showToast.jsx';
import toast from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !senha) {
      showOkToast('Preencha todos os campos.', 'error');
      return;
    }

    try {
      const data = await loginUsuario({ email, senha });
      if (data.auth) {
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        showOkToast('Falha ao autenticar.', 'error');
      }
    } catch (err) {
      showOkToast(err?.response?.data?.error || 'Erro ao fazer login', 'error');
    }
  }

  

  function handleVoltar() {
    navigate('/cadastro');
  }

  return (
    <Container>
      <Parte1>
        <img src={LogoKronos} alt="" style={{ width: '100%' }} />
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
            onChange={e => setEmail(e.target.value)}
            style={{ marginBottom: '3vh' }}
          />

          <Input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />

          <EsqueceuSenha as="button" type="button" >
            Esqueceu a senha?
          </EsqueceuSenha>

          <ButtonCadastrar type="submit">ENTRAR</ButtonCadastrar>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </Form>
      </Parte2>
    </Container>
  );
}

export default Login;
