import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Header,
  ListaLembretes,
  Lembrete,
  Vazio,
} from "./Styles";

const Lembretes = () => {
  const [lembretes, setLembretes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const API_URL = "http://localhost:3000"; 
  const username = localStorage.getItem("username")?.trim();
const token = localStorage.getItem("token");


  const buscarLembretes = async () => {
  setCarregando(true);
  setErro(null);

  const token = localStorage.getItem("token"); 
  const username = localStorage.getItem("username");

  if (!token) {
    setErro("Usuário não autenticado.");
    setCarregando(false);
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/lembretes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resposta.ok) throw new Error("Erro ao buscar lembretes");

    const data = await resposta.json();
    setLembretes(data);
  } catch (err) {
    console.error("Erro ao carregar lembretes:", err);
    setErro("Erro ao carregar lembretes.");
  } finally {
    setCarregando(false);
  }
};


  const onExcluirLembretes = async () => {
    if (!token) return console.error("Usuário não autenticado.");

    try {
      const resposta = await fetch(`${API_URL}/lembretes`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resposta.ok) throw new Error("Erro ao excluir lembretes");

      setLembretes([]);
    } catch (err) {
      console.error("Erro ao excluir lembretes:", err);
      
    }
  };

  useEffect(() => {
    buscarLembretes();
  }, []);

  return (
    <Container>
      <Card>
        <Header>
          <h2>Lembretes</h2>
          <button onClick={onExcluirLembretes}>Excluir</button>
        </Header>

        {carregando ? (
          <Vazio>Carregando lembretes...</Vazio>
        ) : erro ? (
          <Vazio>{erro}</Vazio>
        ) : lembretes.length > 0 ? (
         <ListaLembretes>
            {lembretes.map((lembrete) => {
              let tipo = "";

              if (lembrete.statusLembrete === 2) tipo = "expirado";
              else if (lembrete.statusLembrete === 1) tipo = "proximo";

              return (
                <Lembrete key={lembrete.idLembrete} tipo={tipo}>
                  <h3>{lembrete.tituloLembrete}</h3>
                  <p>{lembrete.descricao}</p>
                  <small>
                    {new Date(lembrete.dhLembrete).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </small>
                </Lembrete>
              );
            })}
          </ListaLembretes>


        ) : (
          <Vazio>Nenhum lembrete no momento.</Vazio>
        )}
      </Card>
    </Container>
  );
};

export default Lembretes;
