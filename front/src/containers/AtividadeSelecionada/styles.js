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
  &:hover{color: #B3261E};
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
  cursor: pointer;
`;

export const Input = styled.input`
  font-size: 18px;
  border: none;
  background-color: transparent;
  width: 100%;
  text-align: right;
`;

export const Desc = styled.div`
  display: flex;
  width: 100%;
  height: 27vh;
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
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 7vh;
  background-color: var(--fundo-menu-ativo);
  border-radius: 20px;
  margin: 2vh 0;
  position: relative;
  box-sizing: border-box;

  select {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    border-radius: 20px;
    font-size: 18px;
    color: var(--texto);
    outline: none;
    cursor: pointer;
    padding: 0 2vh;
    appearance: none;
    text-align: center;
    text-align-last: center;

    option {
      background-color: var(--fundo-menu-ativo);
      color: var(--texto);
      text-align: left;
    }
  }

  &::after {
    content: "▾";
    position: absolute;
    right: 2vh;
    color: var(--texto);
    font-size: 20px;
    pointer-events: none;
  }
`;

export const Tecnicas = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 2vh;
  border: none;
  background: transparent;
  width: 100%;
`;

export const Tecnica = styled.div`
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 7vh;
  background-color: var(--fundo-menu-ativo);
  margin-bottom: 2vh;
  border-radius: 20px;
  cursor: pointer;
  background-color: ${({ ativo, tipo }) => {
    if (!ativo) return "var(--fundo-menu-ativo)";
    switch (tipo) {
      case "pomodoro":
        return "var(--Importante-Urgente)";
      case "kanban":
        return "var(--NaoImportante-Urgente)";
      case "eisenhower":
        return "var(--Importante-NaoUrgente)";
      default:
        return "var(--fundo-menu-ativo)";
    }
  }};
  color: ${({ ativo }) => (ativo ? "var(--texto)" : "var(--texto-claro)")};

  &:hover {
    background-color: ${({ tipo }) => {
      switch (tipo) {
        case "pomodoro":
          return "var(--Importante-Urgente)";
        case "kanban":
          return "var(--NaoImportante-Urgente)";
        case "eisenhower":
          return "var(--Importante-NaoUrgente)";
        default:
          return "var(--fundo-menu-ativo)";
      }
    }};
  }
`;