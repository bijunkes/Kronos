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
  height: 50vh;
  width: 60vh;
  color: var(--fundo-menu);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  background-color: var(--fundo-menu);
`;

export const ModalHeader = styled.div`
    display: flex;
    font-size: 22px;
    font-weight: bold;
    color: var(--cor-texto);
    padding: 3vh;
`;

export const ModalInput = styled.input`
    width: 80%;
    font-size: 18px;
    color: var(--cor-texto);
    background-color: var(--fundo-campo);
    height: 7vh;
    border-radius: 20px;
    margin-left: 3vh;
    margin-right: 3vh;
    padding: 0 3vh;
    margin-bottom: 2vh;

    &::placeholder {
        color: #999;
        font-size: 18px;
    }
`;

export const ModalButton = styled.div`
    display: flex;
    flex-direction: row;
    padding: 3vh;
    gap: 1.5vh;
    justify-content: flex-end;
`;

export const Button = styled.button`
    font-size: 18px;
    color: var(--cor-texto);
    background-color: var(--fundo-campo);
    border-radius: 20px;
    height: 7vh;
    padding: 0 3vh;
    cursor: pointer;

    &#cancelar:hover {
        background-color: var(--Importante-Urgente);
    }
    &#criar:hover {
        background-color: var(--NaoImportante-NaoUrgente);
    }
`;