import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Parte1, Logo, LeftAlign, Negrito, Opaco, ButtonEntrar,
  Parte2, Form, Negrito2, Opaco2, Input, ButtonCadastrar, EsqueceuSenha,
  ToggleEye
} from './styles.js';

import olhoFechado from "../../assets/olhoFechado.png";
import olhoAberto from "../../assets/olhoAberto.png";
import LogoKronos from '../../assets/LogoKronos.png';

import { loginUsuario, solicitarResetSenha } from '../../services/api.js';
import { showOkToast } from '../../components/showToast.jsx';
import toast from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(v => !v);

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

  const handleEsqueceuSenha = async () => {
    const emailParaReset = email.trim() || window.prompt('Digite o e-mail cadastrado:');
    if (!emailParaReset) return;

    const tid = toast.loading('Enviando link de redefinição...', { position: 'top-center' });
    try {
      await solicitarResetSenha(emailParaReset);
      showOkToast('Se o e-mail existir, enviaremos o link de redefinição.', 'success');
    } catch (err) {
      showOkToast(err?.response?.data?.error || 'Não foi possível enviar o link.', 'error');
    } finally {
      toast.dismiss(tid);
    }
  };

  function handleVoltar() {
    navigate('/cadastro');
  }

  return (
    <Container>
      <Parte1>
        <img src={LogoKronos} alt="Logo Kronos" style={{ width: '100%' }} />
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

        
          <div style={{position: "relative", width: "100%" }}>
            <Input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            />
            <ToggleEye
              src={showPassword ? olhoAberto : olhoFechado}
              alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
              onClick={togglePassword}
              style={{
                position: "absolute",
                right: "30px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer"
              }}
            />
          </div>

          <EsqueceuSenha style={{marginTop: '1vh'}} as="button" type="button" onClick={handleEsqueceuSenha}>
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
