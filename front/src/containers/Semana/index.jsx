import React, { useEffect, useRef, useState } from "react";
import {
  Background,
  SemanaScroll,
  DiaColuna,
  DiaHeader,
  DiaTitulo,
  BotaoAdd, 
  ListaAtividades
} from "./styles.js";
import { listarTodasAtividades, listarListas } from "../../services/api.js";
import api from "../../services/api.js";
import ModalCriarAtividade from "../ModalCriarAtividade";

function Semana() {
  const [dias, setDias] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [listaPadrao, setListaPadrao] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    gerarDiasSemana();
    carregarAtividades();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [dias]);

  const gerarDiasSemana = () => {
    const hoje = new Date();
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(hoje);
      d.setDate(hoje.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      const nome = d.toLocaleDateString("pt-BR", { weekday: "long" });
      arr.push({ iso, nome });
    }
    setDias(arr);
  };

  const carregarAtividades = async () => {
    try {
      const todas = await listarTodasAtividades();
      const norm = (todas || []).map((a) => {
        const raw = a.prazoAtividade;
        let prazoIso = null;

        if (typeof raw === "string") {
          const match = raw.match(/\d{4}-\d{2}-\d{2}/);
          if (match) prazoIso = match[0];
        }

        return { ...a, prazoIso };
      });
      setAtividades(norm);
    } catch (err) {
      console.error("Erro ao carregar atividades:", err);
    }
  };

  useEffect(() => {
    const carregarListaPadrao = async () => {
      try {
        const listas = await listarListas();
        const lista = listas.find(
          (l) => (l.nomeLista || l.nome) === "Atividades"
        );
        if (lista) setListaPadrao(lista);
        else console.warn("Lista padrão 'Atividades' não encontrada!");
      } catch (err) {
        console.error("Erro ao carregar lista padrão:", err);
      }
    };
    carregarListaPadrao();
  }, []);

  const concluirAtividade = async (atividade) => {
    try {
      if (!listaPadrao?.idLista) {
        alert("Lista padrão 'Atividades' não encontrada!");
        return;
      }

      const prazoFormatado = atividade.prazoAtividade
        ? typeof atividade.prazoAtividade === "string"
          ? atividade.prazoAtividade
          : String(atividade.prazoAtividade)
        : null;

      const novoStatus = atividade.statusAtividade === 1 ? 0 : 1;
      const novaConclusao =
        novoStatus === 1
          ? new Date().toISOString().slice(0, 19).replace("T", " ")
          : null;

      await api.put(`/atividades/${atividade.idAtividade}`, {
        nomeAtividade: atividade.nomeAtividade,
        descricaoAtividade: atividade.descricaoAtividade || null,
        prazoAtividade: prazoFormatado,
        statusAtividade: novoStatus,
        dataConclusao: novaConclusao,
        ListaAtividades_idLista:
          atividade.ListaAtividades_idLista || listaPadrao.idLista,
        ListaAtividades_Usuarios_username:
          atividade.ListaAtividades_Usuarios_username ||
          atividade.Usuarios_username ||
          listaPadrao.Usuarios_username ||
          listaPadrao.Usuarios?.username ||
          "admin"
      });

      await carregarAtividades();
    } catch (err) {
      console.error("Erro ao atualizar atividade:", err);
      alert("Erro ao atualizar atividade");
    }
  };

  const handleAtividadeCriada = () => {
    carregarAtividades();
    setModalAberto(false);
    setDiaSelecionado(null);
  };

  const atividadesPorDia = (iso) =>
    atividades.filter((a) => a.prazoIso === iso);

  return (
  <Background>
    <SemanaScroll ref={scrollRef}>
      {dias.map((d) => (
        <DiaColuna key={d.iso}>
          <DiaHeader>
            <DiaTitulo>
              {d.nome.charAt(0).toUpperCase() + d.nome.slice(1)}
            </DiaTitulo>

            <BotaoAdd
              id="add"
              className="material-symbols-outlined"
              onClick={() => {
                setDiaSelecionado(d.iso);
                setModalAberto(true);
              }}
              aria-label={`Adicionar atividade para ${d.iso}`}
            >
              add
            </BotaoAdd>
          </DiaHeader>

          <div
            style={{
             flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: "1.5vh",
            overflowY: "auto",
            width: "100%",
            paddingRight: "6px",
            color: "var(--cor-texto)",
            }}
          >
            {atividadesPorDia(d.iso).length === 0 ? (
              <div style={{ color: "#999", textAlign: "center" }}>
                Sem atividades
              </div>
            ) : (
              atividadesPorDia(d.iso).map((a) => (
                <div
                  key={a.idAtividade}
                  style={{
                    width: "100%",
                    marginBottom: 12,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "var(--fundo-menu-ativo)",
                      padding: "20px 25px",
                      borderRadius: 20,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                      }}
                      onClick={() => concluirAtividade(a)}
                    >
                      <span className="material-symbols-outlined">
                        {a.statusAtividade === 1
                          ? "radio_button_checked"
                          : "radio_button_unchecked"}
                      </span>
                      <span>{a.nomeAtividade}</span>
                    </div>
                    <div style={{ color: "#fffefe" }}>
                      {a.prazoIso
                        ? a.prazoIso.split("-").reverse().join("/")
                        : "Sem prazo"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DiaColuna>
      ))}
    </SemanaScroll>

    {modalAberto && (
      <ModalCriarAtividade
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setDiaSelecionado(null);
        }}
        onAtividadeCriada={handleAtividadeCriada}
        listaId={listaPadrao?.idLista || 1}
        dataSelecionada={diaSelecionado}
        origem="semana"
      />
    )}
  </Background>
);

}

export default Semana;