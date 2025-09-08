import { useState } from "react";
import { criarAtividade } from "../../services/api";
import { ModalContainer, ModalHeader, ModalInput, Overlay, ModalButton, Button } from "./styles";

function ModalCriarAtividade({ isOpen, onClose, onAtividadeCriada }) {
  const [idLista, setIdLista] = useState(null);
  const [nome, setNome] = useState("");
  const [prazo, setPrazo] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const novaAtividade = await criarAtividade({
        nomeAtividade: nome,
        prazoAtividade: prazo,
        descricaoAtividade: descricao,
        idLista: idLista
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

  if (!isOpen) return null;

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
