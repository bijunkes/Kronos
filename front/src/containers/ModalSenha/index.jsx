import React from "react";
import {
  Overlay,
  ModalContainer,
  Titulo,
  Subtitulo,
  Input,
  ButtonRow,
  Button,
} from "./style.js";
import { showOkToast } from "../../components/showToast.jsx"; // <- usa o toast

function ModalSenha({ onClose, onSubmit }) {
  const [novaSenha, setNovaSenha] = React.useState("");
  const [confirmarSenha, setConfirmarSenha] = React.useState("");

  const handleSubmit = () => {
    if (novaSenha !== confirmarSenha) {
      // antes: alert("As senhas não coincidem");
      showOkToast("As senhas não coincidem", "error");
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
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Input
          type="password"
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <ButtonRow>
          <Button cancel onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Confirmar</Button>
        </ButtonRow>
      </ModalContainer>
    </Overlay>
  );
}

export default ModalSenha;
