import styled from 'styled-components'; 

export const Background = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--fundo);
  overflow: hidden;
  display: flex; /* deixa o menu e o conteúdo lado a lado */
`;


export const SemanaScroll = styled.div`
  margin-left: var(--sidebar-width);
  padding: 4vh 4vh 2vh 4vh;
  box-sizing: border-box;

  display: flex;
  align-items: flex-start;
  gap: 2.5vh;
  height: calc(100vh - 4vh);
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--fundo-menu-ativo);
    border-radius: 8px;
  }
`;

/* colunas da semana */
export const DiaColuna = styled.div`
  flex: 0 0 50vh;
  min-width: 50vh;
  height: 92vh;
  border-radius: 20px;
  background-color: var(--fundo-menu);
  display: flex;
  flex-direction: column;
  padding: 3vh;
  box-sizing: border-box;
  box-shadow: 0 6px 18px rgba(0,0,0,0.35);
  flex-shrink: 0;
  gap: 2vh; /* <-- adiciona espaço entre título e atividades */
`;

