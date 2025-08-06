import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MyGlobalStyles from './styles/globalStyles';
import Padrao from './components/Padrao/Padrao.jsx';

import Home from './containers/Home';
import Login from './containers/Login';
import Cadastro from './containers/Cadastro';
import Hoje from './containers/Hoje';
import Semana from './containers/Semana';
import Tarefas from './containers/Tarefas';
import Pomodoro from './containers/Pomodoro';
import Kanban from './containers/Kanban';
import Eisenhower from './containers/Einsenhower';
import RelatorioDiario from './containers/RelatorioDiario';
import RelatorioSemanal from './containers/RelatorioSemanal';
import NotFound from './containers/NotFound';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MyGlobalStyles />
        <BrowserRouter>
            <Routes>
                <Route element={<Padrao />}> 
                    <Route path="/" element={<Home />} />
                    <Route path="/hoje" element={<Hoje />} />
                    <Route path="/semana" element={<Semana />} />
                    <Route path="/tarefas" element={<Tarefas />} />
                    <Route path="/pomodoro" element={<Pomodoro />} />
                    <Route path="/kanban" element={<Kanban />} />
                    <Route path="/eisenhower" element={<Eisenhower />} />
                    <Route path="/relatoriodiario" element={<RelatorioDiario />} />
                    <Route path="/relatoriosemanal" element={<RelatorioSemanal />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="*" element={<NotFound />} />

            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)