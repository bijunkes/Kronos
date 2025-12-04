import styled from "styled-components";

const LEFT_WIDTH = "520px"

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 4vh 4vh;
  gap: 3vh;
  box-sizing: border-box;
  cursor: default;
`;

export const Card = styled.div`
  background-color: var(--fundo-menu);
  color: var(--cor-texto);
  border-radius: 20px;
  padding: 3vh;
  display: flex;
  flex-direction: column;
  gap: 3vh;
  box-sizing: border-box;
  height: 100%;
  width: 40%;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 2vh;
  border-bottom: 1px solid rgba(255,255,255,0.06);

  h2 {
    font-size: 20px;
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
      background-color: rgba(179, 38, 30, 0.6);
    }
  }
`;

export const ListaLembretes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2vh;
  max-height: calc(75vh - 6vh);
  overflow-y: auto;
  padding-right: 0.8vh;
  box-sizing: content-box;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.25);
    cursor: pointer;
  }
`;


export const Lembrete = styled.div`
  background-color: var(--fundo-campo);
  padding: 2vh;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  transition: background 0.12s, transform 0.06s ease-in-out;
  cursor: pointer;

  border-left: 6px solid
    ${(p) =>
      p.$tipo === "expirado"
        ? "#B3261E"
        : p.$tipo === "proximo"
        ? "#FFCC00"
        : "transparent"};

  &:hover {
    background-color: var(--cinza-claro);
    transform: translateY(-2px);
  }

  h3 {
    margin: 0;
    font-size: 16px;
    color: var(--cor-texto);
  }

  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.85;
  }

  small {
    font-size: 12px;
    opacity: 0.6;
  }
`;

export const Vazio = styled.div`
  text-align: center;
  padding: 2vh 0;
  opacity: 0.4;
  font-size: 16px;
`;

export const PainelDireito = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
 
  height: 100%;
  background-color: var(--fundo);
  box-sizing: border-box;
  position: relative;
  
`;

export const DetalheBox = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--fundo-menu);
  border-radius: 20px;

  padding: 0 3vh 3vh 3vh;

  color: var(--cor-texto);
  display: flex;
  flex-direction: column;
  gap: 3vh;
  box-sizing: border-box;
  position: relative;

  p {
    font-size: 18px;
  }

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    color: var(--cor-texto);
    height: 7vh;
    line-height: 5vh;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

   .btn-excluir {
    position: absolute;
    top: 3vh;
    right: 3vh;

    background: transparent;
    border: none;
    cursor: pointer;

    padding: 0.8vh;
    border-radius: 10px;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: background 0.2s;
  }

  .btn-excluir:hover {
    color: var(--Importante-Urgente);
  }

  .btn-excluir span {
    font-size: 3vh;
  }

`;

export const ResponsiveShim = styled.div`
  @media (max-width: 1000px) {
    ${Container} {
      flex-direction: column;
    }
  }
`;
