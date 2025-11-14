import styled from "styled-components";


export const Container = styled.div`
  display: grid;
  left: 58.5%;
  top: 50%;
  transform: translate(-50%, -50%);
  grid-template-areas: "titulo relaKanban relaKanban relaKanban" 
  "data pendente andamento concluido"
  "progresso pendente andamento concluido"
  "pomodoro classificacao classificacao classificacao";
  gap: 1%;       
  height: 95vh; 
  width: 81vw;
  padding: 2rem;
  box-sizing: border-box;
  position: fixed;
  border-radius: 1rem;
  background-color: #212121;
`;

export const Titulo = styled.h2`
    grid-area: titulo;
    font-size: 33px;
    color: #FFFFFF;
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    font-variation-settings:
    "wdth" 100;
`;

export const RelatorioKanban = styled.h2`
    grid-area: relaKanban;
    font-size: 27px;
    display: flex;
    justify-content: center;
    color: #FFFFFF;
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    font-variation-settings:
    "wdth" 100;
`;

export const Data = styled.div`
    grid-area: data;
    display: flex;
    align-items: center;
    padding: 1rem;
    width: 18vw;
    height: 5.30vh;
    background-color: #282828;
    border-radius: 1rem;
    font-size: 18px;
    color: #FFFFFF;
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    font-weight: 10%;
    font-variation-settings:
    "wdth" 100;
`;

export const Progresso = styled.div`
    grid-area: progresso;
    width: 18vw;
    height: 38vh;
    background-color: #282828;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    font-size: 27px;
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
    border-radius: 1rem;
`;
export const QuadroKanban = styled.div`
    width: 18vw;
    height: 47vh;
    background-color: #282828;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1%;
    gap: 5%;
    justify-content: flex-start;
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
    width: 58vw;
    height: 30vh;
    background-color: #282828;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    justify-content: center;
    align-items: start;
    font-size: 27px;
    color: #FFFFFF;
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    font-variation-settings:
    "wdth" 100;
`;
export const ProgressoBox = styled.div`
    width: 70%;
    height: 70%;
    display:flex;
    justify-content: center;
    align-items: center;
    background-color: #353535;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 60px;
    color: #FFFFFF;
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-weight: bold;
    font-style: normal;
    font-variation-settings:
    "wdth" 100;
`;
export const BoxTitulo = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    height: 5.29vh;
    width: 16vw;
    font-size: 24px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    top: 1rem;
    font-weight: 1%;
    margin-bottom: 5%;
    color: rgba(255, 255, 255, 1);
`;
export const BoxTarefas = styled.div`
    height: auto;
    width: 12vw;
    background-color: rgba(255, 255, 255, 0.1);
    font-size: 18px;
    border-radius: 2rem;
    position: relative;
    display: flex;
    padding: 1rem;
    margin: 1px;
    flex-wrap: wrap;
`;
export const BoxNomeTarefa = styled.div`
    position: relative;
    align-self: center;
    width: 12vw;
    height: auto;
    color: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
`;

export const NomeTarefa = styled.h2`
    position: relative;
    align-self: center;
    color: rgba(255, 255, 255, 1);
    font-size: 18px;
`;
export const QuadroEisen = styled.div`
    height: 2vh;
    width: 1vw;
    font-size: 18px;
    border-radius: 1rem;
    position: relative;
    display: flex;
    padding: 1rem;
    align-items: center;
    justify-content: flex-end;
    left: 0;
    color: #FFFFFF;
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
    left: 30%;
    color: rgba(255, 255, 255, 1);
    left: 1rem;
    

`;