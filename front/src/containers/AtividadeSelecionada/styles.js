import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 4vh;
  margin-bottom: 3vh;
  height: 92vh;
  width: 114vh;
  border-radius: 20px;
  background-color: var(--fundo-menu);
  box-sizing: border-box;
  padding: 3vh;
`;

export const Excluir = styled.div`
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const NomeAtividade = styled.input`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1vh;
  border: none;
  background: transparent;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

export const Status = styled.div`
  font-size: 16px;
  opacity: 50%;
`;

export const Datas = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2vh;
  margin: 2vh 0;
`;

export const Data = styled.div`
  padding: 0 3vh;
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

export const Input = styled.input`
  font-size: 18px;
  border: none;
  background-color: transparent;
  width: 100%;
  text-align: right;
  &:focus {
    outline: none;
  }
`;

export const Desc = styled.div`
  display: flex;
  width: 100%;
  height: 28vh;
  background-color: var(--fundo-menu-ativo);
  padding: 2vh;
  border-radius: 20px;
  font-size: 18px;
  flex-direction: column;
`;


export const DescTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  background-color: transparent;
  font-size: 16px;
  padding: 1vh;
  outline: none;
  color: var(--texto);

  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: var(--fundo-menu-ativo);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--cinza-claro);
    border-radius: 10px;
  }
`;

export const Lista = styled.div`
  display: flex;
  width: 100vh;
  height: 7vh;
  background-color: var(--fundo-menu-ativo);
  border-radius: 20px;
  margin: 2vh 0;
`;

export const Tecnicas = styled.div`
`;

export const Tecnica = styled.div`
`;