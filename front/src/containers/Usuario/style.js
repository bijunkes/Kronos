import styled from 'styled-components';

const FORM_W = '560px';

export const Container = styled.div`
  width: 40%;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 4vh;
`;

export const Card = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--fundo-menu);
  color: var(--cor-texto);
  border-radius: 20px;
  padding: 3vh;

  display: flex;
  flex-direction: column;
`;


export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 2vh;
  padding-bottom: 2vh;
  height: 16vh;
  border-bottom: 1px solid rgba(255,255,255,0.06);
`;

export const Avatar = styled.div`
  position: relative;
  width: 12vh;
  height: 12vh;
  border-radius: 50%;
  background-color: var(--fundo-campo);
  display: grid;
  place-items: center;
  overflow: hidden;
  cursor: ${(p) => (p.$editando ? 'pointer' : 'default')};
  transition: all 0.25s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: ${(p) => (p.$editando ? 1 : 0.5)};
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    transform: ${(p) => (p.$editando ? 'scale(1.05)' : 'none')};
  }
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: .8vh;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    color: var(--cor-texto);
  }
  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
  }
`;

export const Form = styled.form`
  padding-top: 1.5vh;
  max-width: ${FORM_W};
  width: 100%;

  display: flex;
  flex-direction: column;

  flex: 1;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5vh;
  max-width: ${FORM_W};
  width: 100%;
`;

export const Label = styled.label`
  font-size: 16px;
  color: var(--cor-texto);
  margin-top: 1.5vh;
  margin-bottom: 1vh;
  opacity: 0.9;
`;

export const Input = styled.input`
  width: 100%;
  height: 7vh;
  font-size: 16px;
  color: var(--cor-texto);
  background-color: var(--fundo-campo);
  border-radius: 20px;
  padding: 0 3vh;
  border: none;
  outline: none;
  box-sizing: border-box;
  transition: opacity 0.2s;

  opacity: ${(p) => (p.readOnly ? 0.6 : 1)};

  &::placeholder {
    color: #999;
    font-size: 16px;
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
  gap: 1.5vh;
  justify-content: flex-end;

  max-width: ${FORM_W};
  width: 100%;

  margin-top: auto;

  @media (max-width: 680px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Button = styled.button.attrs((props) => ({
  type: props.type ?? 'button',
}))`
  font-size: 16px;
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



