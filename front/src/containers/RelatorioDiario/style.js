import styled from "styled-components";

export const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  color: var(--cor-texto);
  cursor: default;
`;

export const Container = styled.div`
  display: grid;
  margin: 4vh;
  height: 92vh;
  grid-template-areas: "titulo relaKanban relaKanban relaKanban" 
  "data pendente andamento concluido"
  "progresso pendente andamento concluido"
  "pomodoro classificacao classificacao classificacao";
  gap: 1%;       
  width: calc(100vw - 20%);
  padding: 3vh;
  box-sizing: border-box;
  position: fixed;
  border-radius: 20px;
  background-color: var(--fundo-menu);
`;

export const Titulo = styled.h2`
    grid-area: titulo;
    font-size: 24px;
    color: #FFFFFF;
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-weight: bold;
`;

export const RelatorioKanban = styled.h2`
    grid-area: relaKanban;
    font-size: 20px;
    display: flex;
    justify-content: center;
    color: #FFFFFF;
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
`;

export const Data = styled.div`
    grid-area: data;
    display: flex;
    align-items: center;
    padding: 2.5vh;
    width: 18vw;
    height: 6vh;
    background-color: #282828;
    border-radius: 16px;
    font-size: 16px;
    color: #FFFFFF;
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    font-variation-settings:
    "wdth" 100;
`;

export const Progresso = styled.div`
    grid-area: progresso;
    width: 18vw;
    height: 38vh;
    background-color: #282828;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    padding: 2.5vh;
    font-size: 20px;
    color: #FFFFFF;
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    font-variation-settings:
    "wdth" 100;
`;

export const Pomodoro = styled.div`
    grid-area: pomodoro;
    width: 18vw;
    height: 30vh;
    background-color: #282828;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    padding: 2.5vh;
    justify-content: flex-start;
    align-items: start;
    font-size: 20px;
    gap: 3vh;
    color: #FFFFFF;
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    font-variation-settings:
    "wdth" 100;
`;
export const QuadroKanban = styled.div`
    width: 18vw;
    height: 47vh;
    background-color: #282828;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.5vh;
    gap: 0.5vh;
    justify-content: flex-start;
`;

export const PainelTarefas = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  gap: 1.5vh;
  align-items: center;
  overflow-y: scroll;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
`;

export const Pendente = styled(QuadroKanban)`
    grid-area: pendente;
`;
export const Andamento = styled(QuadroKanban)`
    grid-area: andamento;
`;
export const Concluido = styled(QuadroKanban)`
    grid-area: concluido;
`;

export const Classificacao = styled.div`
    grid-area: classificacao;
    width: 100%;
    height: 30vh;
    background-color: #282828;
    border-radius: 20px;

    display: flex;
    flex-direction: column;
    padding: 2.5vh;
    gap: 1.5vh;
    justify-content: center;
    align-items: start;

    font-size: 20px;
    color: #FFFFFF;
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    font-variation-settings: "wdth" 100;

    overflow-x: auto;
    overflow-y: hidden;
    flex-wrap: nowrap;

    &::-webkit-scrollbar {
        height: 5px;
    }

    &::-webkit-scrollbar-track {
        background: var(--fundo-menu);
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: var(--cinza-claro);
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover{
      cursor: pointer;
    }
`;

export const ProgressoBox = styled.div`
    width: 70%;
    height: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    left: 50%;
    top: 48%;
    transform: translate(-50%, -50%);

    font-size: 52px;
    color: #FFFFFF;
    font-family: "Roboto", sans-serif;
    font-weight: bold;

    border-radius: 50%;
    background-color: #353535;
    z-index: 1;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        padding: 6px;
        border-radius: 50%;
        background: ${({ progresso }) => `
            conic-gradient(
                #ffffff ${progresso * 360}deg,
                #353535 ${progresso * 360}deg
            )
        `};
        -webkit-mask: 
            radial-gradient(farthest-side, transparent calc(100% - 5px), black 0);
        mask:
            radial-gradient(farthest-side, transparent calc(100% - 5px), black 0);
        transition: background 0.6s ease-in-out;
    }
`;

export const BoxTitulo = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    height: 7vh;
    width: 100%;
    font-size: 20px;
    background-color: var(--cinza-claro);
    border-radius: 16px;
    margin-bottom: 5%;
    color: rgba(255, 255, 255, 1);
`;
export const BoxTarefas = styled.div`
    height: 6vh;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.06);
    font-size: 16px;
    border-radius: 16px;
    position: relative;
    display: flex;
    justify-content: center;
    padding: 2vh;
`;
export const BoxNomeTarefa = styled.div`
    position: relative;
    display: flex;
    align-self: center;
    width: 12vw;
    height: auto;
    color: rgba(255, 255, 255, 1);
`;

export const NomeTarefa = styled.h2`
    position: relative;
    align-self: center;
    color: rgba(255, 255, 255, 1);
    font-size: 18px;
    width: 100%;
    height: 100%;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
    font-weight: 100;
`;

export const QuadroEisen = styled.div`
    height: 1vh;
    width: 1vh;
    font-size: 18px;
    border-radius: 20px;
    position: relative;
    display: flex;
    padding: 2vh;
    align-items: center;
    justify-content: flex-end;
    color: #FFFFFF;
`;

export const ImportanteUrgente = styled(QuadroEisen)`
  background-color: #B3261E;
`;

export const ImportanteNaoUrgente = styled(QuadroEisen)`
  background-color: #FFCC00;
  
`;

export const NaoImportanteUrgente = styled(QuadroEisen)`
  background-color: #007AFF;
`;

export const NaoImportanteNaoUrgente = styled(QuadroEisen)`
  background-color: #34C759;
`;

export const Icones = styled.span`
    position: relative;
    left: 1vh;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
`;

export const BoxPomodoro = styled.div`
    width: 100%;
    height: 6vh;
    display: flex;
    align-items:center;
    padding: 2.5vh;
    border-radius: 16px;
    font-weight: 100;
    background-color: rgba(255, 255, 255, 0.1);
    font-size: 18px;
`;
