import styled from 'styled-components';

export const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  color: var(--cor-texto);
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
  padding: 0 3vh 0 3vh;
  display: flex;
  flex-direction: column;
  flex: 1;      
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: var(--fundo-menu);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--fundo-menu-ativo);
    border-radius: 10px;
  }
`;

export const Header = styled.div`
  display: flex;
  padding: 3vh;
`;

export const NomeLista = styled.div`
  font-size: 20px;
  font-weight: bold;
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
  #delete{
    &:hover{
      color:  #B3261E;
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
  gap: 1vh;
  cursor: pointer;
`;

export const Prazo = styled.div`
  font-size: 16px;
  margin-left: auto;
`;

export const Pesquisar = styled.div`
  padding: 0 2vh;
  width: calc(100% - 4vh);
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

export const Parte2 = styled.div``;
