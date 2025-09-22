
import React, { useState } from "react";
import {
  Overlay,
  ModalContainer,
  Titulo,
  Subtitulo,
  Input,
  ButtonRow,
  Button,
  ToggleEye,        
} from "./style.js";

import olhoFechado from "../../assets/olhoFechado.png";
import olhoAberto from "../../assets/olhoAberto.png";
import { showOkToast } from "../../components/showToast.jsx";

function ModalSenha({ onClose, onSubmit }) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(v => !v);

  const handleSubmit = () => {
    if (!novaSenha || !confirmarSenha) {
      showOkToast("Preencha os dois campos de senha.", "error");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      showOkToast("As senhas não coincidem.", "error");
      return;
    }
    onSubmit(novaSenha);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <Overlay>
      <ModalContainer>
        <Titulo>Redefinir senha</Titulo>
        <Subtitulo>Digite sua nova senha abaixo</Subtitulo>

        
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Nova Senha"
            value={novaSenha}
            onChange={e => setNovaSenha(e.target.value)}
            onKeyDown={onKeyDown}
          />
          

        <div style={{ position: "relative", width: "100%", marginBottom: 16 }}>
          <Input
          type={showPassword ? "text" : "password"}
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChange={e => setConfirmarSenha(e.target.value)}
          onKeyDown={onKeyDown}
          style={{ marginBottom: 0 }}
          />
          <ToggleEye
            src={showPassword ? olhoAberto : olhoFechado}
            alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
            onClick={togglePassword}
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          />
        </div>

        <ButtonRow>
          <Button cancel onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Confirmar</Button>
        </ButtonRow>
      </ModalContainer>
    </Overlay>
  );
}

export default ModalSenha;
