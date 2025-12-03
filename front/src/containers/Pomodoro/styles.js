import styled from 'styled-components';

export const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  color: var(--cor-texto);
`;

export const Container = styled.div`
  margin: 4vh;
  height: 92vh;
  width: 168.5vh;
  padding: 3vh;
  border-radius: 20px;
  background-color: var(--fundo-menu);
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 3vh;
`;

export const Intervalos = styled.div`
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Intervalo = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 1.5vh;
  border-radius: 16px;
  cursor: default;
  
  /* 
    Use o $ativo (com cifrão) para aplicar estilos condicionais
    sem que o atributo seja passado ao DOM:
  */
  background-color: ${({ $ativo }) =>
    $ativo ? 'var(--fundo-menu-ativo)' : 'transparent'};

  transition: background-color 0.3s ease;
`;

export const Principal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3vh;
  height: 100%;
  width: calc(100% / 3);
`;

export const ParteTempo = styled.div`
  display: flex;
  flex-direction: column;
  height: 77vh;
  align-items: center;
`;

export const Cronometro = styled.div`
  display: flex;
  height: 50vh;
  width: 100%;
  background-color: var(--fundo-menu-ativo);
  border-radius: 16px;
  margin-bottom: 3vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  cursor: default;
`;

export const Circulo = styled.div`
  display: flex;
  background-color: var(--cinza-claro);
  width: 32vh;
  height: 32vh;
  border-radius: 100%;
  font-size: 26px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2vh;

  #ciclos {
    margin-top: 1.5vh;
  }
  #tempo {
    font-size: 50px;
  }
  span {
    font-size: 42px;
    &:hover {
      cursor: pointer;
    }
  }
`;

export const Reiniciar = styled.button`
  position: absolute;
  bottom: 2vh;
  left: 2vh;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    color: var(--cinza-claro);
  }
`;

export const Pular = styled.button`
  position: absolute;
  bottom: 2vh;
  right: 2vh;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    color: var(--cinza-claro);
  }
`;

export const Configuracoes = styled.div`
  display: flex;
  width: 100%;
  background-color: var(--fundo-menu-ativo);
  padding: 2vh;
  border-radius: 16px;
  flex-direction: column;
`;

export const TituloConfiguracoes = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding: 1vh;
`;

export const OpcoesConfiguracoes = styled.div`
  flex-direction: column;
  display: flex;
  font-size: 18px;
  padding: 1vh;
  gap: 2vh;
`;

export const OpcaoFoco = styled.div`
  display: flex;
  height: 6vh;
  border-radius: 14px;
  align-items: center;
  gap: 1.5vh;
`;

export const FocoDuracao = styled.div`
  display: flex;
  background-color: var(--cinza-claro);
  height: 6vh;
  border-radius: 14px;
  align-items: center;
  padding: 0 1vh 0 3vh;
  width: 50%;
  gap: 1vh;

  input {
    padding: 1vh;
    width: 100%;
    margin-left: 3vh;
  }
`;

export const FocoQtde = styled.div`
  display: flex;
  background-color: var(--cinza-claro);
  height: 6vh;
  border-radius: 14px;
  align-items: center;
  padding: 0 1vh 0 3vh;
  width: 50%;
  gap: 1vh;

  input {
    padding: 1vh;
    width: 100%;
    margin-left: 3vh;
  }
`;

export const OpcaoCurto = styled.div`
  display: flex;
  background-color: var(--cinza-claro);
  height: 6vh;
  border-radius: 14px;
  align-items: center;
  padding: 0 1vh 0 3vh;
  width: 100%;
  gap: 1vh;

  input {
    padding: 1vh;
    width: 13%;
    margin-left: 17.5vh;
  }
`;

export const OpcaoLongo = styled.div`
  display: flex;
  background-color: var(--cinza-claro);
  height: 6vh;
  border-radius: 14px;
  align-items: center;
  padding: 0 1vh 0 3vh;
  width: 100%;
  gap: 1vh;

  input {
    padding: 1vh;
    width: 13%;
    margin-left: 16.5vh;
  }
`;

export const Atividades = styled.div`
  background-color: var(--fundo-menu-ativo);
  height: 100%;
  width: 107.5vh;
  padding: 3vh;
  display: flex;
  flex-direction: column;
  width: calc(100% / 3 * 2);
  gap: 1.5vh;
  border-radius: 20px;

  h1 {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 1%.5;
  }
`;

export const Atividade = styled.div`
  position: relative; 
  background-color: var(--cinza-claro);
  height: 7vh;
  width: 100%;
  font-size: 18px;
  border-radius: 20px;
  padding: 3vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5vh;

  .btn-excluir {
    position: absolute;
    right: 3vh;
    display: none; 
    font-size: 24px;
    cursor: pointer;
    color: var(--Importante-Urgente);
  }

  &:hover .btn-excluir {
    display: inline-block;
  }
`;

export const Lista = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;      
  overflow-y: auto;
  display: flex;
  gap: 1.5vh;
  flex-direction: column;

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

export const Adicionar = styled.div`
  background-color: var(--cinza-claro);
  height: 7vh;
  width: 100%;
  border-radius: 16px;
  padding: 3vh;
  font-size: 18px;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
