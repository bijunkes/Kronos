import React, { useState } from 'react';
import {
  Overlay,
  ModalContainer,
  ModalHeader,
  ModalInput,
  ModalButton,
  Button
} from './style';

function ModalLista({ isOpen, onClose, onCreate }) {
  const [nomeLista, setNomeLista] = useState('');

  const handleCriar = () => {
    if (!nomeLista.trim()) return;

    onCreate(nomeLista);
    setNomeLista('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <ModalHeader>
          Criar nova lista
        </ModalHeader>
        <ModalInput placeholder="Nome da lista"
        value={nomeLista}
        onChange={(e) => setNomeLista(e.target.value)}/>
        <ModalButton>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleCriar}>Criar</Button>
        </ModalButton>
      </ModalContainer>
    </Overlay>
  );
}

export default ModalLista;
