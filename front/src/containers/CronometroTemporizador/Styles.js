import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--fundo);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 3vh 2vw;
  box-sizing: border-box;
`;

export const Card = styled.div`
  width: calc(100% - 320px);
  max-width: 1100px;
  height: 90vh;
  background: var(--fundo-menu);
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
  padding: 36px 48px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 2.5rem;
`;

export const Aba = styled.button`
  background: ${({ ativo }) =>
    ativo ? "var(--fundo-menu-ativo)" : "transparent"};
  color: ${({ ativo }) => (ativo ? "#fff" : "#bdbdbd")};
  border: none;
  padding: 16px 64px;
  min-width: 240px;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 160ms ease;
  box-shadow: ${({ ativo }) =>
    ativo ? "inset 0 -2px 0 rgba(0,0,0,0.15)" : "none"};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${({ ativo }) =>
      ativo ? "var(--fundo-menu-ativo)" : "#2c2c2c"};
    color: #fff;
  }
`;

export const RelogioWrap = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Relogio = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6.2rem;
  font-weight: 800;
  letter-spacing: 6px;
  color: #ffffff;
  text-align: center;
  line-height: 1;
  margin-bottom: 1.6rem;
  gap: 16px;

  @media (max-width: 800px) {
    font-size: 4.2rem;
  }
`;

export const AjusteContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-bottom: 1rem;
`;

export const AjusteColuna = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  font-size: 3rem;
  font-weight: 700;
  position: relative;

  .valor {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 70px;
  }

  .setas {
    position: absolute;
    bottom: -35px; 
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
  }
`;

export const Flecha = styled.div`
  cursor: pointer;
  user-select: none;
  font-size: 0.8rem;
  color: #bdbdbd;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: #fff;
    transform: scale(1.1);
  }
`;


export const TempoLabel = styled.div`
  color: #cfcfcf;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  text-align: center;
  min-height: 1.4rem;
`;

export const BotoesContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

export const BotoesColuna = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
`;

export const Botao = styled.button`
  width: 240px;
  height: 50px;
  background: ${({ cancelar }) => (cancelar ? "#3a3a3a" : "#2e2e2e")};
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 150ms ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${({ cancelar }) => (cancelar ? "#444" : "#383838")};
  }
`;

export const CardFooterSpacer = styled.div`
  height: 12px;
  width: 100%;
`;
