import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalContainer = styled.div`
  height: 32vh;
  width: 60vh;
  color: var(--fundo-menu);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  background-color: var(--fundo-menu);
`;

export const ModalHeader = styled.div`
    display: flex;
    font-size: 10px;
    font-weight: bold;

    h1 {
       color: var(--cor-texto); 
    }
`;