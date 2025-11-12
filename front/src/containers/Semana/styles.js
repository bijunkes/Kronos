import styled from "styled-components";

export const Background = styled.div`
  background-color: var(--fundo);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Conteudo = styled.div`
  width: 85%;
  height: 80%;
  background-color: var(--fundo-parte1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  padding: 2vh;
  gap: 2vh;
`;

export const SemanaScroll = styled.div`
  display: flex;
  flex: 1;
  gap: 2vh;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 1vh;
  scrollbar-gutter: stable both-edges; /* evita alargamento */

  /* Scroll horizontal (sem setas, igual ao das listas) */
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const DiaColuna = styled.div`
  flex: 1;
  min-width: 260px;
  max-width: 260px;
  background-color: var(--fundo-parte2);
  border-radius: 20px;
  padding: 1.5vh;
  display: flex;
  flex-direction: column;
  gap: 1vh;
`;

export const DiaHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1vh;
`;

export const DiaTitulo = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: var(--cor-texto);
`;

export const AtividadesDia = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  padding: 0 0.5vh 0 0.5vh;

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

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const Atividade = styled.div`
  background-color: var(--fundo-menu-ativo);
  border-radius: 20px;
  padding: 1vh 2vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--cor-texto);
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background-color: var(--fundo-campo);
  }
`;

export const Prazo = styled.div`
  font-size: 15px;
  color: #bbb;
`;

export const BotaoAdd = styled.button`
  background: none;
  color: var(--cor-texto);
  font-size: 22px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    color: var(--Importante-NaoUrgente);
  }
`;
