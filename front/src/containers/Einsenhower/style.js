import styled from "styled-components";

export const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  color: var(--cor-texto);
  cursor: default;
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; 
  grid-template-rows: 1fr 1fr;              
  margin: 4vh;
  height: 92vh;
  width: 168.5vh;
  padding: 3vh;
  border-radius: 20px;
  background-color: var(--fundo);
  box-sizing: border-box;
`;

export const Quadrante = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  color: white;
  font-size: 20px;
  height: 39.5vh;
  width: calc(100% - 3vh);
  padding: 2vh;
  gap: 2vh;
  justify-self: end; 
  align-self: end; 
`;

export const ImportanteUrgente = styled(Quadrante)`
  background-color: #B3261E;
`;

export const ImportanteNaoUrgente = styled(Quadrante)`
  background-color: #FFCC00;
  color: black;
`;

export const NaoImportanteUrgente = styled(Quadrante)`
  background-color: #007AFF;
`;

export const NaoImportanteNaoUrgente = styled(Quadrante)`
  background-color: #34C759;

`;

export const LabelVertical = styled.h2`
  position: absolute;
  transform: rotate(270deg) translateY(-50%);
  transform-origin: center;
  font-size: 24px;
  color: #FFFFFF;
  z-index: 10;
`;

export const LabelImportante = styled(LabelVertical)`
  top: 28%;
  left: 16.5%;
`;

export const LabelNaoImportante = styled(LabelVertical)`
  top: 71%;
  left: 14.8%;
`;

export const LabelHorizontal = styled.h2`
  position: absolute;
  font-size: 24px;
  color: #FFFFFF;
  z-index: 10;
`;

export const LabelUrgente = styled(LabelHorizontal)`
  left: 37%;
  top: 5.7%;
`;

export const LabelNaoUrgente = styled(LabelHorizontal)`
  left: 74%;
  top: 5.7%;
`;

export const Lista = styled.ul`
  overflow-y: scroll;
  height: 100%; 
  width: 100%;
  overflow-y: auto;
  display: flex;
  gap: 1vh;
  flex-direction: column;
  scroll-behavior: smooth;
  overflow-y: auto;

   &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.25);
    cursor: pointer;
  }

`;

export const Atividade = styled.li`
  background: rgba(27, 27, 27, 0.15);
  display: flex;
  color: #FFFFFF;
  min-height: 6vh;
  width: 100%;
  border-radius: 16px;
  flex-direction: row;
`;

export const AdicionarTarefa = styled.button`
  background: rgba(27, 27, 27, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
  height: 7vh;
  width: 100%;
  border-radius: 20px;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
`;

export const Icones = styled.button`
    position: relative;
    left: 36%;
    font-size: 22px;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;

    ${(props) =>
    props.type === "delete" &&
    `
      &:hover {
        color: var(--Importante-Urgente);
      }
    `
  }

  ${(props) =>
    props.type === "arrow" &&
    `
      &:hover {
        color: rgba(255, 255, 255, 0.5);
      }
    `
  }
`;

export const BoxNomeTarefa = styled.div`
    display: flex;
    align-items: center;
    padding: 0 3vh;
    width: 75%;
    height: 100%;
    color: rgba(255, 255, 255, 1);
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
`;

export const BoxIcones = styled.div`
    align-self: center;
    width: 25%;
    height: 100%;
    color: rgba(255, 255, 255, 1);
    display: flex;
    font-size: 16px;
    justify-self: end;
    gap: 1vh;
    padding-right: 3vh;
`;