import styled from 'styled-components';

export const Painel = styled.div`
    position: relative; 
    display: flex;
    flex-direction: column;
    height: 95vh;
    width: 33.33%;
    margin: 1rem 1rem 1rem 1rem;
    background-color: #252525;
    border-radius: 1rem;
    overflow-y: scroll;
    scroll-behavior: smooth;
    &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
    
`;
export const PainelTarefas = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  height: 78.42vh;
  position: absolute;
  overflow-y: scroll;
  top: 5rem;
  left: 1rem;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }


`;

export const BoxTitulo= styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    height: 5.29vh;
    width: 24vw;
    font-size: 22px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    top: 1rem;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
`;
export const Container = styled.div`
  display: flex;                  
  height: 100vh; 
  width: 100%;
  position: relative;
  flex-direction: row;
  justify-content: space-around;

`;
export const BoxTarefa = styled.div`
    width: 24vw;
    
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    gap: 1rem;
    
     
`;
export const BoxNomeTarefa = styled.div`
    position: relative;
    
    padding: 0.5rem;
    color: rgba(255, 255, 255, 1);
    display: block;
    width: 18vw;
`;

export const NomeTarefa = styled.h2`
    position: relative;
    align-self: center;
    font-weight: normal;
    font-size: 24px;
    
    color: rgba(255, 255, 255, 1);
    white-space: normal;
word-wrap: break-word;
overflow-wrap: break-word;
`;
export const BoxIcones = styled.div`
    position: relative;
    align-self: center;
    
    color: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: center;
    
`;
export const Icones = styled.button`
    position: relative;
    align-self: center;
    color: rgba(255, 255, 255, 1);

`;
export const BoxAdicionar= styled.button`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    height: 5.29vh;
    width: 24vw;
    font-size: 20px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    margin-top: auto;
    bottom: 1rem;
    color: rgba(255, 255, 255, 1);
`;