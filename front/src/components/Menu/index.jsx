import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  MenuWrapper,
  Usuario,
  IconUsuario,
  InfoUsuario,
  NomeUsuario,
  Username,
  Lista,
  ItemMenor,
  ItemMaior,
  Submenu,
  SubmenuItem,
  ListasHeader,
  BotaoAdicionar,
  OpcoesAbaixo,
  OpcoesAbaixo1
} from './styles';

import defaultUserImage from '../../assets/defaultUserImage.jpg';
import {
  criarLista,
  listarListas,
  deletarLista, // (mantido se você usa em outro lugar)
  getPerfil
} from '../../services/api.js';

import ModalLista from '../../containers/ModalLista/index.jsx';

function Menu() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({ nome: '', username: '' });
  const [iconUrl, setIconUrl] = useState(null);

  const [modalListaAberto, setModalListaAberto] = useState(false);
  const [listas, setListas] = useState([]);

  const [submenuAberto, setSubmenuAberto] = useState('');
  const [submenuSelecionado, setSubmenuSelecionado] = useState({ pai: '', item: '' });

  // carrega perfil + ícone
  useEffect(() => {
    (async () => {
      try {
        const perfil = await getPerfil(); // GET /usuarios/me
        setUsuario({ nome: perfil.nome || '', username: perfil.username || '' });
        setIconUrl(perfil.icon || null);

        // persiste e avisa possíveis ouvintes (não faz mal ter aqui também)
        if (perfil.icon) localStorage.setItem('user_icon_url', perfil.icon);
        else localStorage.removeItem('user_icon_url');
      } catch (err) {
        // silencioso no menu
        console.error('Erro ao buscar usuário no menu:', err?.response?.data || err);
      }
    })();
  }, []);

  // escuta atualizações de ícone disparadas pela página de Perfil
  useEffect(() => {
    const handler = (e) => {
      const url = e?.detail?.iconUrl || null;
      setIconUrl(url);
      if (url) localStorage.setItem('user_icon_url', url);
      else localStorage.removeItem('user_icon_url');
    };
    window.addEventListener('user:icon', handler);

    // fallback: se recarregar outra rota e já existir ícone salvo
    const saved = localStorage.getItem('user_icon_url');
    if (saved) setIconUrl(saved);

    return () => window.removeEventListener('user:icon', handler);
  }, []);

  const handleClick = (item, temRota = true) => {
    if (submenuAberto === item) {
      setSubmenuAberto('');
      if (temRota) navigate('/home');
    } else {
      setSubmenuAberto(item);
      if (temRota) navigate('/' + item);
    }
  };

  const handleSubmenuClick = (pai, item, idLista = null) => {
    if (submenuSelecionado.pai === pai && submenuSelecionado.item === item) {
      setSubmenuSelecionado({ pai: '', item: '' });

      if (pai === 'listas') {
        setSubmenuAberto('listas');
        navigate('/listas');
      } else if (pai === 'tecnicas') {
        setSubmenuAberto('tecnicas');
        navigate('/tecnicas');
      } else if (pai === 'relatorios') {
        setSubmenuAberto('relatorios');
        navigate('/relatorios');
      }
      return;
    }
    setSubmenuSelecionado({ pai, item });
    if (pai === 'listas') {
      const listaSlug = encodeURIComponent(item);
      navigate(`/listas/${listaSlug}`);
    }
  };

  const abrirModal = () => setModalListaAberto(true);
  const fecharModal = () => setModalListaAberto(false);

  const atualizarListas = async () => {
    try {
      const listas = await listarListas();
      setListas(listas);
      localStorage.setItem('atualizarListas', Date.now());
    } catch (err) {
      console.error('Erro ao buscar listas:', err);
    }
  };

  useEffect(() => {
    if (submenuAberto === 'listas') atualizarListas();
  }, [submenuAberto]);

  useEffect(() => {
    const handleListasAtualizadas = () => atualizarListas();
    window.addEventListener('listasAtualizadas', handleListasAtualizadas);
    return () => window.removeEventListener('listasAtualizadas', handleListasAtualizadas);
  }, []);

  const handleCriarLista = async (nome) => {
    try {
      const novaLista = await criarLista(nome);
      fecharModal();
      atualizarListas();
      window.dispatchEvent(new Event('listasAtualizadas'));
      navigate(`/listas/${encodeURIComponent(novaLista.nomeLista)}`);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Erro inesperado ao criar lista';
      console.error('Erro ao criar lista:', msg);
      alert(msg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_icon_url');
    window.location.href = '/login';
  };

  return (
    <MenuWrapper>
      <Usuario>
        <IconUsuario
          onClick={() => {
            setSubmenuAberto('');
            setSubmenuSelecionado({ pai: '', item: '' });
            navigate(`/${usuario.username}`);
          }}
        >
          <img
            src={iconUrl || defaultUserImage}
            alt="Icon usuário"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              borderRadius: '50%'
            }}
          />
        </IconUsuario>

        <InfoUsuario>
          <NomeUsuario>{usuario.nome}</NomeUsuario>
          <Username>@{usuario.username}</Username>
        </InfoUsuario>
      </Usuario>

      <Lista>
        <ItemMenor
          style={{ color: submenuAberto === 'hoje' ? '#FFCC00' : '' }}
          onClick={() => handleClick('hoje', true)}
        >
          <span className="material-symbols-outlined">
            {submenuAberto === 'hoje' ? 'wb_sunny' : 'light_mode'}
          </span>
          Hoje
        </ItemMenor>

        <ItemMenor
          style={{ color: submenuAberto === 'semana' ? '#34C759' : '' }}
          onClick={() => handleClick('semana', true)}
        >
          <span className="material-symbols-outlined">
            {submenuAberto === 'semana' ? 'calendar_month' : 'calendar_today'}
          </span>
          Semana
        </ItemMenor>

        <ItemMenor
          style={{ color: submenuAberto === 'atividades' ? '#007AFF' : '' }}
          onClick={() => handleClick('atividades', true)}
        >
          <span className="material-symbols-outlined">
            {submenuAberto === 'atividades' ? 'folder_open' : 'folder'}
          </span>
          Atividades
        </ItemMenor>
      </Lista>

      <Lista>
        <ItemMaior
          style={{ color: submenuAberto === 'listas' ? '#AF52DE' : '' }}
          onClick={() => handleClick('listas', false)}
        >
          <ListasHeader>
            Listas
            {submenuAberto === 'listas' && (
              <BotaoAdicionar onClick={() => setModalListaAberto(true)}>+</BotaoAdicionar>
            )}
          </ListasHeader>
        </ItemMaior>

        <Submenu style={{ display: submenuAberto === 'listas' ? 'block' : 'none' }}>
          {listas
            .filter((lista) => lista.nomeLista !== 'Atividades')
            .map((lista) => (
              <SubmenuItem
                key={lista.idLista}
                onClick={() => handleSubmenuClick('listas', lista.nomeLista)}
                style={{ color: submenuSelecionado.item === lista.nomeLista ? '#AF52DE' : '' }}
              >
                {lista.nomeLista}
              </SubmenuItem>
            ))}
        </Submenu>

        <ItemMaior
          style={{
            color: submenuAberto === 'tecnicas' && submenuSelecionado.pai !== 'tecnicas' ? '#D732A8' : ''
          }}
          onClick={() => handleClick('tecnicas', false)}
        >
          Técnicas
        </ItemMaior>
        <Submenu style={{ display: submenuAberto === 'tecnicas' ? 'block' : 'none' }}>
          <SubmenuItem
            onClick={() => {
              handleSubmenuClick('tecnicas', 'Pomodoro');
              navigate('/pomodoro');
            }}
            style={{ color: submenuSelecionado.item === 'Pomodoro' ? '#B3261E' : '' }}
          >
            Pomodoro
          </SubmenuItem>
          <SubmenuItem
            onClick={() => {
              handleSubmenuClick('tecnicas', 'Kanban');
              navigate('/kanban');
            }}
            style={{ color: submenuSelecionado.item === 'Kanban' ? '#007AFF' : '' }}
          >
            Kanban
          </SubmenuItem>
          <SubmenuItem
            onClick={() => {
              handleSubmenuClick('tecnicas', 'Eisenhower');
              navigate('/eisenhower');
            }}
            style={{ color: submenuSelecionado.item === 'Eisenhower' ? '#FFCC00' : '' }}
          >
            Eisenhower
          </SubmenuItem>
        </Submenu>

        <ItemMaior
          style={{
            color:
              submenuAberto === 'relatorios' && submenuSelecionado.pai !== 'relatorios' ? '#B3261E' : ''
          }}
          onClick={() => handleClick('relatorios', false)}
        >
          Relatórios
        </ItemMaior>
        <Submenu style={{ display: submenuAberto === 'relatorios' ? 'block' : 'none' }}>
          <SubmenuItem
            onClick={() => {
              handleSubmenuClick('relatorios', 'Diário');
              navigate('/relatoriodiario');
            }}
            style={{ color: submenuSelecionado.item === 'Diário' ? '#B3261E' : '' }}
          >
            Diário
          </SubmenuItem>
          <SubmenuItem
            onClick={() => {
              handleSubmenuClick('relatorios', 'Semanal');
              navigate('/relatoriosemanal');
            }}
            style={{ color: submenuSelecionado.item === 'Semanal' ? '#B3261E' : '' }}
          >
            Semanal
          </SubmenuItem>
        </Submenu>
      </Lista>

      <OpcoesAbaixo>
        <OpcoesAbaixo1>
          <span className="material-symbols-outlined" id="sino">
            schedule
          </span>
          <span className="material-symbols-outlined" id="notificacao">
            notifications
          </span>
        </OpcoesAbaixo1>
        <span className="material-symbols-outlined" id="logout" onClick={handleLogout}>
          logout
        </span>
      </OpcoesAbaixo>

      <ModalLista
        isOpen={modalListaAberto}
        onClose={() => setModalListaAberto(false)}
        onCreate={handleCriarLista}
      />
    </MenuWrapper>
  );
}

export default Menu;
