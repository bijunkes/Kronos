import React from "react";
import {
  Overlay,
  ModalContainer,
  ModalHeader,
  CloseButton,
  OpcoesContainer,
  Button
} from "./styles";

function ModalEscolherAcao({ isOpen, onClose, onCriar, onSelecionar }) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>

        <OpcoesContainer>
          <Button onClick={onCriar}>Criar</Button>
          <Button onClick={onSelecionar}>Selecionar</Button>
        </OpcoesContainer>

      </ModalContainer>
    </Overlay>
  );
}

export default ModalEscolherAcao;
