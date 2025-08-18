import styled from 'styled-components';

export const MenuWrapper = styled.menu`
  background-color: var(--fundo-menu);
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 34vh;
  flex-shrink: 0;
  color: var(--cor-texto);
`;

export const Usuario = styled.div`
  display: flex;
  padding: 3vh 1vh 2vh 3vh;
`;

export const IconUsuario = styled.button`
  width: 6.5vh;
  height: 6.5vh;
  border-radius: 50%;   
  overflow: hidden;       
  cursor: pointer;
  display: flex;          
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  margin-right: 1.5vh;
`;

export const InfoUsuario = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const NomeUsuario = styled.p`
  font-size: 18px;
  font-weight: bold;
`;

export const Username = styled.p`
  font-size: 16px;
  opacity: 0.8;
`;

export const Lista = styled.ul`
  display: flex;
  flex-direction: column; 
  justify-content: space-between;
  padding: 0;
  margin: 0;
`;

export const ItemMenor = styled.li.attrs(props => ({
  ativo: props.ativo ? 'true' : undefined,
}))`
  font-size: 18px;
  display: flex; 
  width: 100%;    
  box-sizing: border-box;
  padding: 1.6vh 1vh 1.6vh 3vh;
  cursor: pointer;
  gap: 1vh;;
  color: ${({ ativo, corativa }) => (ativo ? corativa || 'var(--cor-texto-ativo)' : 'var(--cor-texto)')};
  align-items: center;

  &:hover {
    background-color: var(--fundo-menu-ativo);
    transition: 0.3s ease;
  }
`;

export const ItemMaior = styled.li
`
  font-size: 20px;
  font-weight: bold;
  box-sizing: border-box;
  padding: 1.6vh 1vh 1.6vh 3vh;
  width: 100%;    
  cursor: pointer;
  color: ${({ ativo}) => (ativo ? corativa || 'var(--cor-texto-ativo)' : 'var(--cor-texto)')};

  &:hover {
    background-color: var(--fundo-menu-ativo);
    transition: 0.3s ease;
  }
`;

export const Submenu = styled.div`
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

export const SubmenuItem =  styled.li
`
  width: 100%;    
  cursor: pointer;
  font-size: 16px;
  padding: 1.5vh 0vh 1.5vh 6vh;
  color: ${({ ativo }) => (ativo ? 'var(--cor-texto-ativo)' : 'var(--cor-texto)')};
  align-items: center;

  &:hover {
    background-color: var(--fundo-menu-ativo);
  }
`;

export const ListasHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BotaoAdicionar = styled.button`
  all: unset;
  padding: 0vh 1.5vh 0vh 1.5vh;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: #FFFFFF;
  
  &:hover {
    background-color: var(--fundo-menu-ativo);
    color: #AF52DE;
  }
`;

export const OpcoesAbaixo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 1.6vh 3vh 3vh 3vh;
  width: 100%;
  margin-top: auto;

  :hover{
    cursor: pointer;
  }
`

export const OpcoesAbaixo1 = styled.div`
display: flex;
  justify-content: space-between;
  gap: 2vh;
`