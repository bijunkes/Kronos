import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 4vh;
  margin-bottom: 3vh;
  height: 92vh;
  width: 114vh;
  border-radius: 20px;
  background-color: var(--fundo-menu);
  box-sizing: border-box;
  padding: 3vh;
`;

export const Header = styled.div`
  margin-bottom: 3vh;
  display: flex;
  flex-direction: column;
`;

export const NomeAtividade = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1vh;
`;

export const Status = styled.div`
    font-size: 16px;
    opacity: 50%;
`;