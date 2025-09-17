import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppWrapper from "./appWrapper";

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

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper>
        <Routes>
          {/* Primeiro acesso sempre leva a /cadastro; o reload com token é tratado no AppWrapper */}
          <Route path="/" element={<Navigate to="/cadastro" replace />} />

          {/* públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/resetar-senha" element={<ResetarSenha />} />

          {/* privadas (com layout) */}
          <Route element={<Padrao />}>
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
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppWrapper>
    </BrowserRouter>
  );
}
