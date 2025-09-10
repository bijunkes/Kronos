import { useState, useEffect } from "react";
import { criarAtividade, listarListas } from "../../services/api";
import { ModalContainer, ModalHeader, ModalInput, Overlay, ModalButton, Button } from "./styles";

function ModalCriarAtividade({ isOpen, onClose, onAtividadeCriada, listaId }) {
  const [nome, setNome] = useState("");
  const [prazo, setPrazo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [idPadrao, setIdPadrao] = useState(null);

  useEffect(() => {
    const carregarListaPadrao = async () => {
      try {
        const listas = await listarListas();
        const listaPadrao = listas.find(l => l.nome === "Atividades");
        if (listaPadrao) setIdPadrao(listaPadrao.idLista);
      } catch (err) {
        console.error("Erro ao buscar lista padrão: ", err);
      }
    };
    carregarListaPadrao();
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const destinoListaId = listaId || idPadrao;
    if (!destinoListaId) {
      console.error("Nenhum id de lista disponível");
      return;
    }

    try {
      const novaAtividade = await criarAtividade({
        nomeAtividade: nome,
        prazoAtividade: prazo,
        descricaoAtividade: descricao,
        listaId: destinoListaId
      });

      if (onAtividadeCriada) {
        onAtividadeCriada(novaAtividade);
      }

      setNome("");
      setPrazo("");
      setDescricao("");
      onClose();
    } catch (err) {
      console.error("Erro ao criar atividade: ", err);
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <ModalHeader>
          Criar Atividade
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalInput
            placeholder="Atividade"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <ModalInput
            type="date"
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
          />
          
          <ModalInput
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          
          <ModalButton>
            <Button type="button" onClick={onClose} id="cancelar">
              Cancelar
            </Button>
            <Button type="submit" id="criar">
              Criar
            </Button>
          </ModalButton>
        </form>
      </ModalContainer>
    </Overlay>
  );
}

export default ModalCriarAtividade;
