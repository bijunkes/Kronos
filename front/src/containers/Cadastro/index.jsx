import React, { useState, useRef, useEffect } from "react";
import {
  Container, Parte1, LeftAlign, Negrito, Opaco, ButtonEntrar,
  Parte2, Form, Negrito2, Opaco2, Input, ButtonCadastrar, ToggleEye
} from "./styles.js";

import olhoFechado from "../../assets/olhoFechado.png";
import olhoAberto from "../../assets/olhoAberto.png";
import LogoKronos from "../../assets/LogoKronos.png";

import { useNavigate } from "react-router-dom";
import { cadastrarUsuario, usuarioExiste } from "../../services/api.js";
import { showOkToast } from "../../components/showToast.jsx";


function Cadastro() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(v => !v);

  const [form, setForm] = useState({
    username: '',
    nome: '',
    email: '',
    senha: '',
    icon: null
  });
  const [loading, setLoading] = useState(false);

  // guarda o id do setInterval para limpar no unmount
  const pollTimerRef = useRef(null);

  useEffect(() => {
    // cleanup ao desmontar
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //sem toasts no front

    try {
      setLoading(true);

      await cadastrarUsuario(form);

      const emailParaChecar = form.email;
      let tentativas = 0;
      const maxTentativas = 60;

      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }

      pollTimerRef.current = setInterval(async () => {
        try {
          tentativas++;
          const data = await usuarioExiste(emailParaChecar); // { exists: true/false }
          if (data?.exists) {
            clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
            navigate('/login');
          } else if (tentativas >= maxTentativas) {
            clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
          }
        } catch {
          if (tentativas >= maxTentativas) {
            clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
          }
        }
      }, 2000);

    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const irParaLogin = () => navigate("/login");

  return (
    <Container>
      <Parte1>
        <img src={LogoKronos} alt="" style={{ width: "100%" }} />
        <LeftAlign>
          <Negrito>Bem-vindo <br />de volta!</Negrito>
          <Opaco>Acesse sua conta agora mesmo.</Opaco>
        </LeftAlign>
        <ButtonEntrar onClick={irParaLogin}>ENTRAR</ButtonEntrar>
      </Parte1>

      <Parte2 >
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


         <div style={{ position: "relative", width: "100%" }}>
  <Input
    type={showPassword ? "text" : "password"}
    name="senha"
    placeholder="Senha"
    value={form.senha}
    onChange={handleChange}
    style={{ width: "100%", paddingRight: "0px" }} // espaço pro ícone
  />
  <ToggleEye
    src={showPassword ? olhoAberto : olhoFechado}
    alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
    onClick={togglePassword}
    style={{
      position: "absolute",
      right: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      left: "93%"
    }}
  />
</div>

          <ButtonCadastrar type="submit" disabled={loading}>
            {loading ? 'ENVIANDO...' : 'CADASTRAR'}
          </ButtonCadastrar>
        </Form>
      </Parte2>
    </Container>
  );
}

export default Cadastro;
