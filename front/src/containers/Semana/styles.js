import styled from 'styled-components';

export const Background = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--fundo);
  overflow: visible;
  display: flex;
`;

export const SemanaScroll = styled.div`
  margin-left: var(--sidebar-width);
  padding: 4vh;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 2.5vh;
  height: calc(100vh - 4vh);
  overflow-x: auto;
  overflow-y: visible;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 6px;
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

export const DiaColuna = styled.div`
padding: 2vh 0 2vh 3vh;
  min-width: 50vh;
  border-radius: 20px;
  background-color: var(--fundo-menu);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex-shrink: 0;

  height: 100%;
  max-height: 100%;

  overflow: visible;
  scroll-behavior: smooth;
`;

export const DiaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DiaTitulo = styled.h3`
  color: var(--cor-texto);
  margin: 0;
  font-size: 20px;
  font-weight: bold;
`;

export const BotaoAdd = styled.span`
  background: transparent;
  color: var(--cor-texto);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  user-select: none;
  margin-right: calc(3vh - 6px);

  &:hover {
    color: rgba(255, 255, 255, 0.4);
  }
`;

export const ListaDoDia = styled.div`
  margin-top: 2vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding-right: 3vh;

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

