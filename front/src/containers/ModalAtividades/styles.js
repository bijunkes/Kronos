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

export const ModalContainer = styled.div`
  height: 80vh;
  width: 50vh;
  color: var(--fundo-menu);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  background-color: var(--fundo-menu);
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
      &:hover{
        color: var(--cinza-claro);
      }  
    }
`;

export const ModalInput = styled.input`
    width: 80%;
    font-size: 18px;
    color: var(--cor-texto);
    background-color: var(--fundo-campo);
    height: 7vh;
    border-radius: 20px;
    margin-left: 3vh;
    margin-right: 3vh;
    padding: 0 3vh;
    margin-bottom: 2vh;

    &::placeholder {
        color: #999;
        font-size: 18px;
    }
`;

export const ModalButton = styled.div`
    display: flex;
    flex-direction: row;
    padding: 3vh;
    gap: 1.5vh;
    justify-content: flex-end;
`;

export const Button = styled.button`
    font-size: 18px;
    color: var(--cor-texto);
    background-color: var(--fundo-campo);
    border-radius: 20px;
    height: 7vh;
    padding: 0 3vh;
    cursor: pointer;

    &#cancelar:hover {
        background-color: var(--Importante-Urgente);
    }
    &#criar:hover {
        background-color: var(--NaoImportante-NaoUrgente);
    }
`;

export const ContainerLista = styled.div`
  margin: 4vh;
  height: 92vh;
  width: 50vh;
  border-radius: 20px;
  background-color: var(--fundo-menu);
  box-sizing: border-box;

  display: flex;
  flex-direction: column; 
`;

export const Conteudo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;      
  overflow-y: auto;
  padding: 0 3vh;

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


export const Botoes = styled.div`
  display: flex;
  gap: 1.5vh;
  margin-left: auto;

  #add {
    cursor: pointer;
    &:hover {
      color: rgba(255, 255, 255, 0.4);
    }
  }
`;

export const AreaAtividades = styled.div`
  font-size: 18px;
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
`;

export const Atividade = styled.div`
  padding: 0 2vh;
  width: 100%;
  background-color: var(--fundo-menu-ativo);
  font-size: 18px;
  height: 7vh;
  display: flex;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  padding: 0 3vh;

  &:hover {
    background-color: var(--cinza-claro);
  }
`;

export const Prazo = styled.div`
  font-size: 16px;
  margin-left: auto;
`;

export const Pesquisar = styled.div`
  padding: 0 2vh;
  width: calc(100% - 6vh);
  background-color: var(--fundo-menu-ativo);
  font-size: 18px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  gap: 1vh;
  height: 7vh;
  margin: 2vh;
  flex-shrink: 0;
`;

export const Input = styled.input`
  font-size: 16px;
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  color: var(--cor-texto);
  outline: none;
`;