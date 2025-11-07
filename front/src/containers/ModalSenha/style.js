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

export const ToggleEye = styled.img`
  right: 12px; 
  top: 50%;
  width: 20px;
  height: 20px;
  cursor: text;
  opacity: 0.75;
  user-select: none;

  &:hover { opacity: 1; 
  cursor: pointer}
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

export const ButtonVoltar = styled.button`
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
  width: 70vh;
`;

export const Titulo = styled.p`
  font-size: 32px;
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

export const Subtitulo = styled.p`
  font-size: 18px;
  opacity: 60%;
  margin-bottom: 4vh;
  text-align: center;
`;

export const Input = styled.input`
  background-color: var(--fundo-campo);
  padding: 2vh 6vh;
  border-radius: 40px;
  width: 70%;
  cursor: text;
  margin-bottom: 1.2vh;
  border: none;
  outline: none;
`;

export const LinhaCodigos = styled.div`
  display: flex;
  gap: 10px;
  margin: 1.2vh 0;
  width: 100%;
  justify-content: center;
`;

export const CodigoBox = styled.input`
  width: 48px;
  height: 56px;
  border-radius: 12px;
  background-color: var(--fundo-campo);
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  border: none;
  outline: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

export const ButtonPrimario = styled.button`
  background: var(--cor-texto);
  color: var(--fundo-parte1);
  padding: 2vh 6vh;
  border-radius: 40px;
  font-weight: bold;
  margin-top: 4vh;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: rgba(255, 255, 255, 0.85);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LinkAcao = styled.span`
  margin-top: 1.6vh;
  font-size: 16px;
  cursor: pointer;
  color: #4f4f4f;
  align-self: center;

  &:hover {
    color: white;
  }
`;

export const Aviso = styled.p`
  margin-top: 1.2vh;
  font-size: 14px;
  opacity: 0.7;
  text-align: center;
  max-width: 60vh;
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const ModalContainer = styled.div`
  background: var(--fundo-parte2);
  color: var(--cor-texto);
  width: 420px;
  max-width: 92vw;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

export const Button = styled.button`
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: opacity .2s ease, background-color .2s ease;

  background: ${props => props.cancel ? 'transparent' : 'var(--cor-texto)'};
  color: ${props => props.cancel ? 'var(--cor-texto)' : 'var(--fundo-parte1)'};
  border: ${props => props.cancel ? '2px solid var(--cor-texto)' : 'none'};

  &:hover { opacity: .85; }
`;
