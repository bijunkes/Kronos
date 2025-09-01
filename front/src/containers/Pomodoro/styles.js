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
  border-radius: 20px;
  background-color: var(--fundo-menu);
  box-sizing: border-box;
`;

export const Intervalos = styled.div`
    font-size: 20px;
    font-weight: bold;
    display: flex;
    gap: 3vh;
    align-items: center;
    justify-content: center;
    padding: 3vh;
`;

export const Intervalo = styled.div`
    display: flex;
    width: calc(100%);
    background-color: var(--fundo-menu-ativo);
    align-items: center;
    justify-content: center;
    padding: 1.5vh;
    border-radius: 16px;
`;

export const Principal = styled.div`
    display: flex;
    flex-direction: row;
    gap: 2vh;
    height: calc(100% - 10vh);
    width: 100%;
`;

export const ParteTempo = styled.div`
    display: flex;
    flex-direction: column;
    height: 77vh;
    width: calc(100% / 3);
    align-items: center;
    padding: 0 1vh 0 3vh;
`;

export const Cronometro = styled.div`
    display: flex;
    height: 50vh;
    width: 100%;
    background-color: var(--fundo-menu-ativo);
    padding: 2vh;
    border-radius: 16px;
    margin-bottom: 3vh;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

export const Circulo = styled.div`
    display: flex;
    background-color: var(--cinza-claro);
    width: 28vh;
    height: 28vh;
    border-radius: 100%;
    font-size: 22px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 2vh;
    margin-bottom: 2vh;

    #ciclos {
        margin-top: 1.5vh;
    }
    #tempo {
        font-size: 46px;
    }
    span {
        font-size: 38px;
        &:hover{
            cursor: pointer;
        }
    }
`;

export const BotaoCronometro = styled.div`
    display: flex;
    background-color: var(--cinza-claro);
    width: calc(100% - 2vh);
    padding: 1.5vh;
    border-radius: 16px;
    align-items: center;
    justify-content: center;
    font-size: 18px;

    &:hover{
        cursor: pointer;
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
    font-size: 20px;
    padding: 1vh;
    gap: 2vh;
`;

export const OpcaoFoco = styled.div`
    display: flex;
    background-color: var(--cinza-claro);
    height: 6vh;
    border-radius: 14px;
    align-items: center;
    padding: 3vh;
`;

export const OpcaoCurto = styled.div`
    display: flex;
    background-color: var(--cinza-claro);
    height: 6vh;
    border-radius: 14px;
    align-items: center;
    padding: 3vh;
`;

export const OpcaoLongo = styled.div`
    display: flex;
    background-color: var(--cinza-claro);
    height: 6vh;
    border-radius: 14px;
    align-items: center;
    padding: 3vh;
`;

export const Atividades = styled.div`
    background-color: var(--fundo-menu-ativo);
    height: 77vh;
    width: 107.5vh;
    border-radius: 16px;
`;