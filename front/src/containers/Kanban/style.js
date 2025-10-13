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
    
    
`;
export const BoxTitulo= styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    height: 5.29vh;
    width: 24vw;
    font-size: 24px;
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
export const BoxTarefas = styled.div`
    height: 5.29vh;
    width: 24vw;
    background-color: rgba(255, 255, 255, 0.1);
    font-size: 18px;
    border-radius: 2rem;
    position: relative;
    display: flex;
    top: 3rem;
    left: 1rem;
    margin-bottom: 1rem;
`;
export const NomeTarefa = styled.h2`
    position: relative;
    align-self: center;
    left: 1rem;
    color: rgba(255, 255, 255, 1);
`;
export const Icones = styled.button`
    position: relative;
    align-self: center;
    left: 18rem;
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
    font-size: 24px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    margin-top: auto;
    bottom: 1rem;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
`;