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
export const AtividadeCard = styled.div`
  padding: 12px;
  display: flex;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f4f4f4;
  width: 100%;
  justify-content: center;
`;
export const ModalContainer = styled.div`
  height: 50vh;
  display: flex;
  width: 60vh;
  color: var(--fundo-menu);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  background-color: var(--fundo-menu);
  padding: 2vh;
  flex-direction: column;
`;
export const ModalBody = styled.div`
  display: flex;
  width: 90%;
  align-self: center;
  height: auto;
  margin-top: 1rem; 
  flex-direction: column;
`;

export const ModalHeader = styled.div`
    display: flex;
    font-size: 22px;
    font-weight: bold;
    color: var(--cor-texto);
    align-items: flex-start;
    justify-content: flex-start;
`;
export const ModalButton = styled.div`
    display: flex;
    flex-direction: row;
    padding: 3vh;
    gap: 1.5vh;
    justify-content: flex-end;
`;
export const Icones = styled.button`
    position: relative;
    left: 23.1rem;
    color: rgba(255, 255, 255, 1);

`;
