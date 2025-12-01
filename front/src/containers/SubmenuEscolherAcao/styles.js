import styled from "styled-components";

export const MenuContainer = styled.div`
  position: absolute;
  background: var(--fundo-menu);
  border-radius: 12px;
  padding: 10px 0;
  width: 180px;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.2);
  z-index: 999; /* acima do overlay */
`;

export const MenuItem = styled.div`
  padding: 12px 16px;
  color: var(--cor-texto);
  cursor: pointer;

  &:hover {
    background: var(--cinza-claro);
  }
`;
