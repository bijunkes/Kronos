import styled from "styled-components";


export const Container = styled.div`
  display: grid;
  left: 58.5%;
  top: 50%;
  transform: translate(-50%, -50%);
  grid-template-areas: "titulo . . ." 
  "data pendente andamento concluido"
  "progresso pendente andamento concluido"
  "pomodoro classificao classificacao classificacao";
                      
  height: 95vh; 
  width: 81vw;
  padding: 1rem;
  box-sizing: border-box;
  position: fixed;
  border-radius: 1rem;
  background-color: #212121;
`;

export const Titulo = styled.h2`
    grid-area: titulo;
    color: #FFFFFF;
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-weight: <weight>;
    font-style: normal;
    font-variation-settings:
    "wdth" 100;
`;

export const Data = styled.div`
    grid-area: data;
    width: 15.625vw;
    height: 5.30vh;
    background-color: #282828;
    border-radius: 1rem;
`;

export const Progresso = styled.div`
    grid-area: progresso;
    width: 15.625vw;
    height: 33.9vh;
    background-color: #282828;
    border-radius: 1rem;
`;

export const Pomodoro = styled.div`
    grid-area: pomodoro;
    width: 15.625vw;
    height: 27.5vh;
    background-color: #282828;
    border-radius: 1rem;
`;
