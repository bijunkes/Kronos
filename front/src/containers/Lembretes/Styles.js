import styled from 'styled-components';

const FORM_W = '560px';

export const Container = styled.div`
  width: 40%;
  min-height: calc(100vh - 8vh);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 4vh 3vh;
`;

export const Card = styled.div`
  width: 90vh;
  max-width: 96%;
  background-color: var(--fundo-menu);
  color: var(--cor-texto);
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  padding: 3vh;
  display: flex;
  flex-direction: column;
  gap: 3vh;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 2vh;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  h2 {
    font-size: 2.6vh;
    font-weight: bold;
    color: var(--cor-texto);
  }

  button {
    background-color: var(--Importante-Urgente);
    color: var(--cor-texto);
    border: none;
    border-radius: 12px;
    padding: 1vh 2.5vh;
    font-size: 1.8vh;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background-color: rgba(255, 0, 0, 0.8);
    }
  }
`;

export const ListaLembretes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2vh;
  max-height: 75vh;
  overflow-y: auto;
  padding-right: 0.8vh;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
`;

export const Lembrete = styled.div`
  background-color: var(--fundo-campo);
  padding: 2vh;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  transition: background 0.2s, transform 0.1s ease-in-out;
  border-left: 6px solid
    ${({ tipo }) =>
      tipo === 'expirado'
        ? '#B3261E' 
        : tipo === 'proximo'
        ? '#FFCC00' 
        : 'transparent'};

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    transform: scale(1.01);
  }

  h3 {
    margin: 0;
    font-size: 2.2vh;
    color: var(--cor-texto);
  }

  p {
    margin: 0;
    font-size: 1.8vh;
    opacity: 0.8;
  }

  span {
    font-size: 1.6vh;
    opacity: 0.6;
  }
`;

export const Vazio = styled.div`
  text-align: center;
  padding: 4vh 0;
  opacity: 0.7;
  font-size: 2vh;
`;
