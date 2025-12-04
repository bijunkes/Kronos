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

export const ContainerLista = styled.div`
  margin: 4vh;
  height: 92vh;
  width: 50vh;
  border-radius: 20px;
  background-color: var(--fundo-menu);
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  font-size: 22px;
  font-weight: bold;
  color: var(--cor-texto);
  padding: 3vh;
  justify-content: space-between;

  span {
    cursor: pointer;
    &:hover {
      color: var(--cinza-claro);
    }
  }
`;

export const Conteudo = styled.div`
  flex: 1;
  padding: 0 3vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    cursor: pointer;
  }
`;

export const AreaAtividades = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
  font-size: 18px;
`;

export const Atividade = styled.div`
  width: 100%;
  padding: 0 3vh;
  height: 7vh;
  display: flex;
  align-items: center;
  border-radius: 20px;
  background-color: var(--fundo-menu-ativo);
  cursor: pointer;

  &:hover {
    background-color: var(--cinza-claro);
  }
`;

export const Prazo = styled.div`
  margin-left: auto;
  font-size: 16px;
`;

export const Pesquisar = styled.div`
  margin: 2vh;
  height: 7vh;
  display: flex;
  align-items: center;
  gap: 1vh;
  padding: 0 2vh;
  border-radius: 20px;
  background-color: var(--fundo-menu-ativo);
`;

export const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: var(--cor-texto);
  font-size: 16px;
  height: 100%;
  outline: none;
`;
