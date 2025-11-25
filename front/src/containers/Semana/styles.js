
import styled from 'styled-components';

export const Background = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--fundo);
  overflow: hidden;
  display: flex;
`;
export const ListaAtividades = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: #999;
  margin-top: 1vh;
  overflow-y: auto;
  overflow-x: hidden;
  width: calc(100% + 8px);  
  margin-right: -8px;  
       
`;

export const SemanaScroll = styled.div`
  margin-left: var(--sidebar-width);
  padding: 4vh; 
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 2.5vh;
  height: calc(100vh - 2vh);
  overflow-x: auto;
  overflow-y: hidden;
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
  }
`;


export const DiaColuna = styled.div`
  padding: 2vh 3vh 3vh 3vh;
  min-width: 50vh;
  border-radius: 20px;
  background-color: var(--fundo-menu);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex-shrink: 0;
  overflow: hidden;
  height: 92vh;
  overflow-y: auto;
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

  &:hover {
    color: rgba(255, 255, 255, 0.4);
  }
`;

export const AtividadesDia = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  width: 100%; 
  height: 7vh;
`;
    

