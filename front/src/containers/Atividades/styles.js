import styled from 'styled-components';

export const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  color: var(--cor-texto);
`;

export const ContainerLista = styled.div`
  margin: 5vh;
  height: 90vh;
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

  #add {
    cursor: pointer;
    &:hover{
      color: rgba(255, 255, 255, 0.7);
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
  padding: 0 2vh 0 2vh;
  width: 100%;
  background-color: var(--fundo-menu-ativo);
  font-size: 18px;
  height: 7vh;
  display: flex;
  align-items: center;
  border-radius: 20px;
  gap: 1vh;
`;

export const Prazo = styled.div`
  font-size: 16px;
  margin-left: auto;
`;

export const Parte2 = styled.div`
  background-color: var(--fundo-menu);
  margin: 5vh;
  margin-left: 0;
  height: 90vh;
  width: 111.5vh;
  border-radius: 20px;
`;
