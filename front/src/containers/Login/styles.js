import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100vh;
  color: var(--cor-texto);
`;

export const Parte1 = styled.div`
  background-color: var(--fundo-parte1);
  display: flex;
  width: 60vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 90px;
  gap: 16vh;
`;

export const Logo = styled.p`
    font-size: 56px;
`;

export const LeftAlign = styled.div`
    text-align: left;
    width: 100%;
`;

export const Negrito = styled.p`
    font-size: 32px;
    font-weight: bold;
    width: 100%;
    margin-bottom: 1vh;
`;

export const Opaco = styled.p`
  font-size: 20px;
  opacity: 60%;
`;

export const ButtonEntrar = styled.button`
  background: transparent;
  border: 2px solid var(--cor-texto);
  padding: 2vh 6vh;
  border-radius: 40px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    color: white;
  }
`;

export const Parte2 = styled.div`
    flex: 1;
  background-color: var(--fundo-parte2);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3vh;
  width: 70vh
`;

export const Negrito2 = styled.p`
  font-size: 32px;
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

export const Opaco2 = styled.p`
  font-size: 20px;
  opacity: 60%;
  margin-bottom: 5vh;
`;

export const Input = styled.input`
  background-color: var(--fundo-campo);
  padding: 2.5vh 6vh;
  border-radius: 40px;
  width: 100%;
  cursor: pointer;
`;

export const ButtonCadastrar = styled.button`
  background: var(--cor-texto);
  color: var(--fundo-parte1);
  padding: 2vh 6vh;
  border-radius: 40px;
  font-weight: bold;
  margin-top: 5vh;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;