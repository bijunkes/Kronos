import styled from 'styled-components';

/* ======= ESTRUTURA PRINCIPAL ======= */
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
  width: calc(100% + 8px);
  margin-right: -8px;
`;

/* ======= ÁREA DE SCROLL HORIZONTAL (SEMANA) ======= */
export const SemanaScroll = styled.div`
  margin-left: var(--sidebar-width);
  padding: 4vh 4vh 2vh 4vh;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  gap: 2.5vh;
  height: calc(100vh - 4vh);
  scroll-behavior: smooth;
  overflow: hidden; /* rolagem nativa desativada */
  position: relative;
`;

/* ======= SCROLL CUSTOMIZADO HORIZONTAL ======= */
export const ScrollArea = styled.div`
  display: flex;
  gap: 2.5vh;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ScrollBarX = styled.div`
  position: absolute;
  bottom: 6px;
  left: 4vh;
  right: 4vh;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
`;

export const ScrollThumbX = styled.div`
  position: absolute;
  bottom: 6px;
  left: ${({ pos }) => pos || 0}%;
  width: ${({ size }) => size || 20}%;
  height: 6px;
  background: var(--cor-primaria);
  border-radius: 10px;
  transition: left 0.2s linear;
`;

/* ======= COLUNA DE DIA ======= */
export const DiaColuna = styled.div`
  flex: 0 0 50vh;
  min-width: 52vh;
  border-radius: 20px;
  background-color: var(--fundo-menu);
  display: flex;
  flex-direction: column;
  padding: 3vh;
  box-sizing: border-box;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  flex-shrink: 0;
  gap: 2vh;
  height: 92vh;
  position: relative;
`;

/* ======= HEADER DO DIA ======= */
export const DiaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DiaTitulo = styled.h3`
  color: var(--cor-texto);
  margin: 0;
  font-size: 20px;
  font-weight: 700;
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
  transition: color 0.18s ease, background 0.18s ease;
  user-select: none;

  &:hover {
    color: rgba(255, 255, 255, 0.4);
  }
`;

/* ======= LISTA DE ATIVIDADES (SCROLL CUSTOM VERTICAL) ======= */
export const ScrollWrapper = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const AtividadesDia = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
  padding-right: 8px;
  width: calc(100% + 8px);
  margin-right: -8px;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ScrollBarY = styled.div`
  position: absolute;
  top: 0;
  right: 2px;
  width: 6px;
  height: 100%;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
`;

export const ScrollThumbY = styled.div`
  position: absolute;
  top: ${({ pos }) => pos || 0}%;
  right: 2px;
  width: 6px;
  height: ${({ size }) => size || 20}%;
  background: var(--cor-primaria);
  border-radius: 10px;
  transition: top 0.2s linear;
`;
