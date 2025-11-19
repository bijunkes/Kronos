import React, { useEffect, useState } from "react"; 
import {
  Container,
  Card,
  Header,
  ListaLembretes,
  Lembrete,
  Vazio,
  PainelDireito,
  DetalheBox,
} from "./style";
import { listarLembretes, getLembrete, excluirLembretes, excluirLembrete } from "../../services/api";
import { showOkToast } from "../../components/showToast.jsx";
import { Link } from "react-router-dom";

export default function LembretesPage() {
  const [lista, setLista] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const nomeUsuario = localStorage.getItem("user_nome") || "";

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      
      try {
        const dados = await listarLembretes();

        const normalizados = (Array.isArray(dados) ? dados : []).map((l) => {
          const idVal =
            Number(l.idLembretes ?? l.idLembrete ?? l.id ?? l._id) || undefined;

          return {
            ...l,
            idLembrete: idVal,
            titulo: l.tituloLembrete ?? l.titulo ?? l.name ?? "Lembrete",
            descricao: l.descricao ?? l.message ?? l.mensagem ?? "",
            dataOriginal: l.dhLembrete ?? l.data ?? null,
            dataFormatada: l.dhLembrete
              ? new Date(l.dhLembrete).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })
              : l.dataFormatada ?? "Sem data",
          };
        });

        setLista(normalizados);
      } catch (err) {
        console.error("Erro ao buscar lembretes:", err);
        showOkToast("Erro ao carregar lembretes.", "error");
        setLista([]);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  const abrirDetalhe = async (id) => {
    console.log("LEMBRETE SELECIONADO:", selecionado);

    if (!id) return;

    if (selecionado && selecionado.idLembrete === id) {
      setSelecionado(null);
      return;
    }

    try {
      const dados = await getLembrete(id);
      const detalhe = dados?.data ?? dados;

      const nomeAtividade =
        detalhe.nomeAtividade ??
        detalhe.nome ??
        detalhe.tituloAtividade ??
        detalhe.tituloLembrete ??
        detalhe.titulo ??
        detalhe.activityName ??
        detalhe.name ??
        "Atividade";

      const rawPrazo =
        detalhe.prazoExtenso ??
        detalhe.prazo ??
        detalhe.prazoAtividade ??
        detalhe.prazo_atividade ??
        detalhe.dataPrazo ??
        detalhe.data ??
        detalhe.dhLembrete ??
        null;

      let prazoExtenso = "Sem data";
      if (rawPrazo) {
        if (typeof rawPrazo === "string" && /\d{4}-\d{2}-\d{2}/.test(rawPrazo)) {
          const d = new Date(rawPrazo);
          if (!Number.isNaN(d.getTime())) {
            prazoExtenso = d.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          } else {
            prazoExtenso = rawPrazo;
          }
        } else if (rawPrazo instanceof Date) {
          prazoExtenso = rawPrazo.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        } else {
          prazoExtenso = String(rawPrazo);
        }
      }

      let listas = [];
      if (Array.isArray(detalhe.listas)) listas = detalhe.listas;
      else if (typeof detalhe.listas === "string") {
        listas = detalhe.listas.split(",").map((s) => s.trim()).filter(Boolean);
      } else if (Array.isArray(detalhe.lista)) listas = detalhe.lista;
      else if (typeof detalhe.lista === "string")
        listas = detalhe.lista.split(",").map((s) => s.trim()).filter(Boolean);
      else if (detalhe.listaAtividades) listas = detalhe.listaAtividades;

      const idAtividade =
        detalhe.idAtividade ??
        detalhe.atividadeId ??
        detalhe.id_atividade ??
        detalhe.activityId ??
        detalhe.idAtv ??
        null;

     setSelecionado(prev => {
        const novo = {
          idLembrete: Number(detalhe.idLembrete ?? detalhe.id ?? detalhe._id ?? id),
          titulo:
            detalhe.tituloLembrete ??
            detalhe.titulo ??
            detalhe.title ??
            "Lembrete",
          mensagem: detalhe.descricao ?? detalhe.mensagem ?? detalhe.message ?? "",
          dataOriginal: detalhe.dhLembrete ?? detalhe.data ?? null,
          dataFormatada:
            detalhe.dhLembrete
              ? new Date(detalhe.dhLembrete).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : detalhe.dataFormatada ?? "Sem data",
          listas,
          statusLembrete: detalhe.statusLembrete ?? null,
          nomeAtividade,
          prazoExtenso,
          idAtividade,
          usuarioNome:
            detalhe.usuarioNome ??
            detalhe.nomeUsuario ??
            detalhe.usuario ??
            nomeUsuario,
        };

        console.log("📌 NOVO SELECIONADO:", novo);
        return novo;
      });

    } catch (err) {
      console.error("Erro ao abrir lembrete:", err);
      showOkToast("Lembrete não encontrado.", "error");
    }
  };

  const handleExcluirTodos = async () => {
    try {
      await excluirLembretes();
      setLista([]);
      setSelecionado(null);
      showOkToast("Todos os lembretes foram excluídos.", "success");
    } catch (err) {
      console.error("Erro ao excluir todos:", err);
      showOkToast("Falha ao excluir todos os lembretes.", "error");
    }
  };

  
const handleExcluir = async () => {
  const token = localStorage.getItem("token");
  if (!selecionado) return;

  try {
    await excluirLembrete(selecionado.idLembrete);

    setLista(prev =>
      prev.filter(item => item.idLembrete !== selecionado.idLembrete)
    );

    setSelecionado(null);
    showOkToast("Lembrete excluído!", "success");
  } catch (err) {
    console.error("Erro ao excluir lembrete:", err);
    showOkToast("Falha ao excluir o lembrete.", "error");
  }
};

  return (
    <Container>
      <Card>
        <Header>
          <h2>Lembretes</h2>
          <button onClick={handleExcluirTodos}>Excluir todos</button>
        </Header>

        {carregando ? (
          <Vazio>Carregando lembretes...</Vazio>
        ) : lista.length === 0 ? (
          <Vazio>Nenhum lembrete encontrado.</Vazio>
        ) : (
          <ListaLembretes>
            {lista.map((l) => {
              const tipo =
                Number(l.statusLembrete) === 2
                  ? "expirado"
                  : Number(l.statusLembrete) === 1
                  ? "proximo"
                  : "normal";

              const id = l.idLembrete;

              return (
               <Lembrete
                  key={l.idLembrete}
                  $tipo={tipo}
                  onClick={() => {
                    const id = l.idLembrete; 

                    if (!id) {
                      showOkToast("ID do lembrete ausente.", "error");
                      return;
                    }

                    abrirDetalhe(id);
                  }}
                >
                  <h3>{l.titulo}</h3>
                  <p>{l.descricao || "Sem descrição."}</p>
                  <small>{l.dataFormatada}</small>
                </Lembrete>

              );
            })}
          </ListaLembretes>
        )}
      </Card>

      <PainelDireito>
        {selecionado ? (
          <DetalheBox>
            <div className="topbar"></div>

            <button className="btn-excluir" onClick={handleExcluir}>
              <span className="material-symbols-outlined">delete</span>
            </button>

            <h2>
              {selecionado.statusLembrete === 2
                ? "A atividade expirou no dia anterior"
                : selecionado.statusLembrete === 1
                ? "Você tem uma atividade com prazo para amanhã"
                : selecionado.titulo}
            </h2>

            {selecionado.statusLembrete === 1 && (
              <p style={{ marginTop: "2vh", lineHeight: "3vh" }}>
                Olá {selecionado.usuarioNome || nomeUsuario},<br /><br />
                Você tem uma atividade com prazo para amanhã.<br /><br />
                <strong>{selecionado.nomeAtividade}</strong><br /><br />
                Quando: {selecionado.prazoExtenso}<br /><br />
                Listas:{" "}
                {selecionado.listas?.length ? selecionado.listas.join(", ") : "[Nenhuma lista vinculada]"}
                <br /><br />
                <Link
                 to={
                    selecionado.listas && selecionado.listas.length > 0
                      ? `/listas/${selecionado.listas[0]}` 
                      : "#" 
                  }
                  style={{ color: "#5b6cff", textDecoration: "underline" }}
                >
                  Ir para lista
                </Link>
              </p>
            )}

            {selecionado.statusLembrete === 2 && (
              <p style={{ marginTop: "2vh", lineHeight: "3vh" }}>
                Olá {selecionado.usuarioNome || nomeUsuario},<br /><br />
                A atividade expirou no dia anterior.<br /><br />
                <strong>{selecionado.nomeAtividade}</strong><br /><br />
                Quando: {selecionado.prazoExtenso}<br /><br />
                Listas:{" "}
                {selecionado.listas?.length ? selecionado.listas.join(", ") : "[Nenhuma lista vinculada]"}
                <br /><br />
                <Link
                  to={
                      selecionado.listas && selecionado.listas.length > 0
                        ? `/listas/${selecionado.listas[0]}` 
                        : "#" 
                    }
                  style={{ color: "#5b6cff", textDecoration: "underline" }}
                >
                  Ir para lista
                </Link>
              </p>
            )}
          </DetalheBox>
        ) : null}
      </PainelDireito>
    </Container>
  );
}
