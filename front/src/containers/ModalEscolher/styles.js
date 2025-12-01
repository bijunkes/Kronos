import styled from "styled-components";

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
  width: 60vh;
  min-height: 22vh;
  padding: 1vh;
  color: var(--cor-texto);
  background-color: var(--fundo-menu);
  border-radius: 20px;
  position: relative;
`;

export const ModalHeader = styled.div`
  font-size: 22px;
  font-weight: bold;
  padding: 3vh;
  color: var(--cor-texto);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CloseButton = styled.span`
  position: absolute;
  top: 3vh;
  right: 3vh;
  cursor: pointer;
  font-size: 26px;
  color: var(--cor-texto);

  &:hover {
    opacity: 0.7;
  }
`;

export const OpcoesContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vh;
  margin-top: 2vh;
`;

export const Button = styled.button`
  width: 92%;
  height: 7vh;
  background-color: var(--fundo-campo);
  border-radius: 20px;
  font-size: 18px;
  display:flex;
  align-items: center;
  justify-content: center;
  color: var(--cor-texto);
  cursor: pointer;

  &:hover {
    background-color: var(--cinza-claro);
  }
`;
