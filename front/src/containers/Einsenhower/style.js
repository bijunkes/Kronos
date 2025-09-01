import styled from "styled-components";


export const Container = styled.div`
  display: grid;
  left: 6rem;
  grid-template-columns: 1fr 1fr; 
  grid-template-rows: 1fr 1fr;     
  gap: 0.5rem;                       
  height: 100vh; 
  width: 72vw;
  padding: 6rem;
  box-sizing: border-box;
  position: relative;
`;

export const Quadrante = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: flex-start;
  border-radius: 1rem;
  font-weight: bold;
  color: white;
  font-size: 1.2rem;
  height: 34.92vh; 
  width: 27.6vw;
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
  font-size: 2rem;
  font-weight: bold;
  color: #FFFFFF;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  z-index: 10;
`;

export const LabelImportante = styled(LabelVertical)`
  top: 26%;

`;

export const LabelNaoImportante = styled(LabelVertical)`
  top: 65%;
  left: -2rem; 
`;


export const LabelHorizontal = styled.h2`
  position: absolute;
  top: 1rem;
  font-size: 2rem;
  font-weight: bold;
  color: #FFFFFF;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  z-index: 10;
`;


export const LabelUrgente = styled(LabelHorizontal)`
  left: 20%;
  top: 3rem;
  
`;

export const LabelNaoUrgente = styled(LabelHorizontal)`
  left: 62%;
  top: 3rem;
  
`;
export const Lista = styled.ul`

  display: block;
  padding: 0;
  margin-top: 0.3rem;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: scroll;
  height: 25vh; 
  width: 27.3vw;
  scroll-behavior: smooth;

  &::-webkit-scrollbar-track{
  
   background-color: rgba(27, 27, 27, 0.2);
  
  }
  &::-webkit-scrollbar-thumb{
  
    background-color: rgba(255, 255, 255, 1);
    border-radius: 50%;
  
  }
  &::-webkit-scrollbar{
  
    width: 6px;
  
  }

`;
export const Atividade = styled.li`

  background: rgba(27, 27, 27, 0.2);
  display: flex;
  align-items: flex-start;
  margin-top: 0.3rem;
  margin-left: 1rem;
  padding-left: 1rem;
  padding-top: 1rem;
  color: #FFFFFF;
  height: 6vh;
  width: 25.5vw;
  border-radius: 1rem;
  flex-shrink: 0;
  overflow: hidden;
  
`;
export const AdicionarTarefa = styled.button`

  background: rgba(27, 27, 27, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1rem;
  margin-top: 1rem;
  padding-left: 1rem;
  padding-bottom: 0.3rem;
  color: #FFFFFF;
  height: 6vh;
  width: 25.5vw;
  border-radius: 1rem;
  text-align: center;
  overflow: hidden;

  &:hover{
  
  color: #c0c0c0;
  font-size: 27px;
  
  
  }

`;



