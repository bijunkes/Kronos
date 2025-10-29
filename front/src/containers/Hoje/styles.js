import styled from 'styled-components';

export const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  width: 100%;
  background-color: var(--fundo-principal, #121212);
  color: #fff;
  padding-top: 40px;
`;

export const ContainerLista = styled.div`
  background-color: var(--fundo-menu, #1e1e1e);
  width: 600px;
  border-radius: 16px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
  padding: 25px 30px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Conteudo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;


export const NomeLista = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--azul-claro, #60a5fa);
`;

export const AreaAtividades = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 480px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #333;
    border-radius: 6px;
  }
`;

export const Atividade = styled.div`
  background-color: var(--fundo-menu-ativo, #2a2a2a);
  padding: 12px 16px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #383838;
  }

  span.material-symbols-outlined {
    font-size: 20px;
    cursor: pointer;
  }
`;

export const Prazo = styled.div`
  font-size: 0.85rem;
  color: #ccc;
`;

export const Pesquisar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: var(--fundo-menu-ativo, #2a2a2a);
  padding: 10px 15px;
  border-radius: 10px;
  margin-top: 10px;

  span.material-symbols-outlined {
    font-size: 22px;
    color: #888;
  }
`;

export const Input = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 0.95rem;
  width: 100%;
  ::placeholder {
    color: #777;
  }
`;

export const MensagemVazia = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: #999;
  margin-top: 15px;
`;

export const Botoes = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  #add {
    color: var(--azul-claro, #60a5fa);
    font-size: 25px;
    cursor: pointer;
  }
`;
