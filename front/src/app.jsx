import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ResetarSenha from "./containers/ResetarSenha/index.jsx";
import Padrao from './components/Padrao/Padrao.jsx';

import Home from './containers/Home';
import Usuario from './containers/Usuario';
import Login from './containers/Login';
import Cadastro from './containers/Cadastro';
import Hoje from './containers/Hoje';
import Semana from './containers/Semana';
import Atividades from './containers/Atividades';
import Lista from "./containers/Lista/index";
import Pomodoro from './containers/Pomodoro';
import Kanban from './containers/Kanban';
import Eisenhower from './containers/Einsenhower';
import RelatorioDiario from './containers/RelatorioDiario';
import RelatorioSemanal from './containers/RelatorioSemanal';
import NotFound from './containers/NotFound';
import CronometroTemporizador from "./containers/CronometroTemporizador";
import Lembretes from "./containers/Lembretes/index.jsx";

import { listarLembretes } from "./services/api";

function App() {
  const [temNotificacoes, setTemNotificacoes] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const url = `${import.meta.env.VITE_API_URL}/lembretes/eventos?token=${token}`;
    console.log("Conectando SSE em:", url);

    const evtSource = new EventSource(url, { withCredentials: true });

    evtSource.addEventListener("ping", () => {
      console.log("SSE conectado (ping)");
    });

    evtSource.addEventListener("lembreteCriado", (e) => {
      try {
        const data = e.data ? JSON.parse(e.data) : null;
        console.log("Evento lembreteCriado recebido:", data);
      } catch {
        console.log("Evento lembreteCriado recebido (sem JSON)");
      }
      setTemNotificacoes(true);
    });

    evtSource.onerror = (err) => {
      console.warn("Erro no SSE de lembretes:", err);
    };

    return () => {
      console.log("Fechando SSE de lembretes");
      evtSource.close();
    };
  }, []);

  useEffect(() => {
    async function carregarLembretesIniciais() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const lembretes = await listarLembretes();
        if (Array.isArray(lembretes) && lembretes.length > 0) {
          setTemNotificacoes(true);
        }
      } catch (err) {
        console.error("Erro ao carregar lembretes iniciais:", err);
      }
    }

    carregarLembretesIniciais();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/resetar-senha" element={<ResetarSenha />} />
        <Route path="*" element={<NotFound />} />

        <Route
          element={
            <Padrao
              temNotificacoes={temNotificacoes}
              setTemNotificacoes={setTemNotificacoes}
            />
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/:username" element={<Usuario />} />
          <Route path="/hoje" element={<Hoje />} />
          <Route path="/semana" element={<Semana />} />
          <Route path="/atividades" element={<Atividades />} />

          <Route path="/listas/:nomeLista" element={<Lista />} />                 

          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/eisenhower" element={<Eisenhower />} />
          <Route path="/relatoriodiario" element={<RelatorioDiario />} />
          <Route path="/relatoriosemanal" element={<RelatorioSemanal />} />
          <Route path="/cronometro" element={<CronometroTemporizador />} />
          <Route path="/lembretes" element={<Lembretes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
