import styled from 'styled-components';

export const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  color: var(--cor-texto);
  padding: 4vh;
  cursor: default;
`;

export const Painel = styled.div`
    position: relative; 
    display: flex;
    flex-direction: column;
    width: 33.33%;
    background-color: var(--fundo-menu);
    border-radius: 20px;
    padding: 3vh 0 3vh 3vh;
    gap: 3vh;
`;

export const PainelTarefas = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-behavior: smooth;
  background-color: var(--fundo-menu);
  gap: 1.5vh;
  padding-right: calc(3vh - 6px);

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

export const BoxTitulo= styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    height: 7vh;
    width: calc(100% - 3vh);
    font-size: 20px;
    background-color: var(--cinza-claro);
    border-radius: 1rem;
    top: 1rem;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    margin-right: 3vh;
`;

export const Container = styled.div`
  display: flex;                  
  height: 92vh; 
  width: 168.5vh;
  position: relative;
  flex-direction: row;
  justify-content: space-around;
  gap: 3vh;

`;

export const BoxTarefa = styled.div`
    width: 100%;
    background-color: var(--fundo-menu-ativo);
    border-radius: 20px;
    display: flex;
    height: 7vh;
    align-items: center;
    justify-content: space-between;
    padding: 2vh;
`;

export const BoxNomeTarefa = styled.div`
    padding: 2vh;
    color: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    width: 100%;
`;

export const NomeTarefa = styled.h2`
    align-self: center;
    font-weight: normal;
    font-size: 20px;
    color: rgba(255, 255, 255, 1);
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
`;

export const BoxIcones = styled.div`
    color: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: center;
    :hover{
      cursor: pointer;
    }
    gap: 1vh;
    
`;

export const Icones = styled.button`
  position: relative;
  align-self: center;
  color: rgba(255, 255, 255, 1);
  background: transparent;
  border: none;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.2s ease;

  ${(props) =>
    props.type === "delete" &&
    `
      &:hover {
        color: var(--Importante-Urgente);
      }
    `
  }

  ${(props) =>
    props.type === "arrow" &&
    `
      &:hover {
        color: rgba(255, 255, 255, 0.5);
      }
    `
  }
`;


export const BoxAdicionar= styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    height: 7vh;
    width: calc(100% - 3vh);
    font-size: 18px;
    background-color: var(--cinza-claro);
    border-radius: 16px;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
    margin-right: 3vh;
`;