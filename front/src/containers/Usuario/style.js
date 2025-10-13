import styled from 'styled-components';


const FORM_W = '560px';


export const Container = styled.div`
  width: 40%;
  min-height: calc(100vh - 8vh);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 4vh 3vh;
`;


export const Card = styled.div`
  width: 90vh;
  max-width: 96%;
  background-color: var(--fundo-menu);
  color: var(--cor-texto);
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  padding: 3vh;
`;


export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 2vh;
  padding-bottom: 2vh;
  border-bottom: 1px solid rgba(255,255,255,0.06);
`;


export const Avatar = styled.div`
  width: 12vh;
  height: 12vh;
  border-radius: 50%;
  background-color: var(--fundo-campo);
  display: grid;
  place-items: center;
  font-size: 6vh;
  user-select: none;
  overflow: hidden;


  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
`;


export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: .8vh;


  h2 {
    margin: 0;
    font-size: 2.6vh;
    font-weight: bold;
    color: var(--cor-texto);
  }
  p {
    margin: 0;
    font-size: 1.8vh;
    opacity: .75;
  }
`;


export const Form = styled.form`
  padding-top: 2.5vh;
  max-width: ${FORM_W};
  width: 100%;
`;


export const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2vh;
  max-width: ${FORM_W};
  width: 100%;
`;


export const Label = styled.label`
  font-size: 1.8vh;
  color: var(--cor-texto);
  margin: 0 0 1vh 0;
  opacity: .9;
`;


export const Input = styled.input`
  width: 100%;
  height: 7vh;
  font-size: 2vh;
  color: var(--cor-texto);
  background-color: var(--fundo-campo);
  border-radius: 20px;
  padding: 0 3vh;
  border: none;
  outline: none;
  box-sizing: border-box;


  &::placeholder {
    color: #999;
    font-size: 1.9vh;
  }
`;


export const InputWithIcon = styled.div`
  position: relative;
  max-width: ${FORM_W};
  width: 100%;


  ${Input} {
    padding-right: 6.5vh;
  }
`;
export const EyeIcon = styled.img.withConfig({
  shouldForwardProp: (prop) => prop !== '$disabled',
})`
  position: absolute;
  right: 2vh;
  top: 50%;
  transform: translateY(-50%);
  width: 2.4vh;
  height: 2.4vh;
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};
`;


export const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 2vh;
  gap: 1.5vh;
  justify-content: flex-end;
  max-width: ${FORM_W};
  width: 100%;


  @media (max-width: 680px) {
    flex-direction: column;
    align-items: stretch;
  }
`;


export const Button = styled.button.attrs((props) => ({
  type: props.type ?? 'button',
}))`
  font-size: 2vh;
  color: var(--cor-texto);
  background-color: var(--fundo-campo);
  border-radius: 20px;
  height: 7vh;
  padding: 0 3vh;
  cursor: pointer;
  border: none;


  &#cancelar:hover {
    background-color: var(--Importante-Urgente);
  }
  &#salvar:hover {
    background-color: var(--NaoImportante-NaoUrgente);
  }
  &#editar:hover {
    background-color: var(--NaoImportante-NaoUrgente);
  }
  &#excluir:hover {
    background-color: var(--Importante-Urgente);
  }
`;


export const Loading = styled.div`
  padding: 2vh 0;
  font-size: 1.9vh;
  opacity: .8;
`;



