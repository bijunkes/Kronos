import styled from 'styled-components';

export const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  color: var(--cor-texto);
`;

export const ContainerLista = styled.div`
  margin: 4vh;
  height: 92vh;
  width: 50vh;
  border-radius: 20px;
  background-color: var(--fundo-menu);
  box-sizing: border-box;
`;

export const Conteudo = styled.div`
  padding: 3vh;
`;

export const Header = styled.div`
  margin-bottom: 3vh;
  display: flex;
`;

export const NomeLista = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

export const Botoes = styled.div`
  display: flex;
  gap: 1.5vh;
  margin-left: auto;

  #delete {
    cursor: pointer;
    &:hover{
      color: var(--Importante-Urgente);
    }
  }

  #add {
    cursor: pointer;
    &:hover{
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

export const AreaAtividades = styled.div`
  padding: 0 2vh 0 2vh;
  font-size: 18px;
  background-color: var(--fundo-menu-ativo);
  border-radius: 16px;
`;

export const Atividade = styled.div`
  font-size: 18px;
  height: 6vh;
  display: flex;
  align-items: center;
  gap: 1vh;
`;