import { useState, useEffect } from "react";
import { listarListas } from "../../services/api";
import api from "../../services/api";
import {
  ModalContainer,
  ModalHeader,
  ModalInput,
  Overlay,
  ModalButton,
  Button,
} from "./styles";

function ModalCriarAtividade({
  isOpen,
  onClose,
  onAtividadeCriada,
  dataSelecionada = null,
  origem = "semana",
  listaId = null,
}) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prazo, setPrazo] = useState("");
  const [listaPadrao, setListaPadrao] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarListaPadrao = async () => {
      try {
        const listas = await listarListas();
        const lista = listas.find(
          (l) => (l.nomeLista || l.nome) === "Atividades"
        );
        if (lista) setListaPadrao(lista);
      } catch (err) {
        console.error("Erro ao buscar lista padrão: ", err);
      }
    };
    carregarListaPadrao();
  }, []);

  useEffect(() => {
    if (dataSelecionada) setPrazo(dataSelecionada);
  }, [dataSelecionada]);

  if (!isOpen) return null;

  const formatarData = (isoDate) => {
    if (!isoDate) return "";
    try {
      const partes = isoDate.split("-");
      if (partes.length === 3) {
        const [ano, mes, dia] = partes;
        return `${dia}/${mes}/${ano}`;
      }
      return isoDate;
    } catch {
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return alert("Informe o nome da atividade.");
    if (nome.length > 20) return alert("A atividade deve conter até 20 caracteres!");
    if (!listaPadrao?.idLista)
      return alert("Lista padrão 'Atividades' não encontrada!");

    setLoading(true);

    try {
        const dataBase = dataSelecionada || prazo;
        const prazoFinal = dataBase ? `${dataBase.slice(0,10)} 12:00:00` : null;

        const targetListaId =
          origem === "lista" && listaId ? listaId : listaPadrao?.idLista;

        const payload = {
          nomeAtividade: nome,
          descricaoAtividade: descricao || null,
          prazoAtividade: prazoFinal,
          listaId: targetListaId,
          ListaAtividades_idLista: targetListaId,
          ListaAtividades_Usuarios_username:
            listaPadrao?.Usuarios_username ||
            listaPadrao?.Usuarios?.username ||
            "admin",
        };

        if (origem === "lista" && listaId && listaPadrao?.idLista && listaPadrao.idLista !== listaId) {
          payload.ListasExtras = [listaPadrao.idLista];
        }

        console.log("Criando atividade com payload:", payload);

        const res = await api.post("/atividades", payload);


      if (onAtividadeCriada) onAtividadeCriada(res.data);

      setNome("");
      setDescricao("");
      setPrazo("");
      onClose();
    } catch (err) {
      console.error("Erro ao criar atividade:", err);
     showOkToast(err?.response?.data?.error || 'Erro ao criar', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <ModalHeader>Criar Atividade</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalInput
            placeholder="Atividade"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          {dataSelecionada ? (
            <ModalInput value={formatarData(dataSelecionada)} readOnly />
          ) : (
            <ModalInput
              type="date"
              value={prazo}
              onChange={(e) => setPrazo(e.target.value)}
            />
          )}

          <ModalInput
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <ModalButton>
            <Button type="button" onClick={onClose} id="cancelar">
              Cancelar
            </Button>
            <Button type="submit" id="criar" disabled={loading}>
              {loading ? "Salvando..." : "Criar"}
            </Button>
          </ModalButton>
        </form>
      </ModalContainer>
    </Overlay>
  );
}

export default ModalCriarAtividade;
