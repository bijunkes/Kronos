import React, { useState } from 'react';
import { Overlay,
  ModalContainer,
  ModalHeader } from './style';

function ModalLista({ isOpen, onClose, onCreate }) {
  const [nomeLista, setNomeLista] = useState('');

  const handleCriar = () => {
    if (!nomeLista.trim()) return;

    onCreate(nomeLista);
    setNomeLista('');
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <ModalHeader>
          <h1>Criar nova lista</h1>
        </ModalHeader>
        
      </ModalContainer>

    </Overlay>
  );
}

export default ModalLista;
