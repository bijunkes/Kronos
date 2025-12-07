import React, { useState, useEffect, useRef } from 'react';
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
  deletarLista,
  getPerfil
} from '../../services/api.js';

import ModalLista from '../../containers/ModalLista/index.jsx';

function Menu() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nome: localStorage.getItem('user_nome') || '',
    username: ''
  });

  const [iconUrl, setIconUrl] = useState(localStorage.getItem('user_icon_url') || null);
  const [imgVer, setImgVer] = useState(0);
  const [displaySrc, setDisplaySrc] = useState(iconUrl || defaultUserImage);
  const objectUrlRef = useRef(null);
  const [modalListaAberto, setModalListaAberto] = useState(false);
  const [listas, setListas] = useState([]);
  const [submenuAberto, setSubmenuAberto] = useState('');
  const [submenuSelecionado, setSubmenuSelecionado] = useState({ pai: '', item: '' });

  const [temNotificacoes, setTemNotificacoes] = useState(false);


  const withVersion = (url, ver) => {
    if (!url) return null;
    return `${url}${url.includes('?') ? '&' : '?'}v=${ver}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const perfil = await getPerfil();
        setUsuario({ nome: perfil.nome || '', username: perfil.username || '' });

        if (perfil.icon) {
          setIconUrl(perfil.icon);
          localStorage.setItem('user_icon_url', perfil.icon);
        } else {
          setIconUrl(null);
          localStorage.removeItem('user_icon_url');
        }
        setImgVer((v) => v + 1);
      } catch (err) {
        console.error('Erro ao buscar usuário no menu:', err?.response?.data || err);
      }
    })();
  }, []);

  useEffect(() => {
    const onProfile = (e) => {
      const d = e?.detail || {};
      setUsuario((u) => ({
        nome: d.nome ?? u.nome,
        username: d.username ?? u.username
      }));

      if ('icon' in d) {
        if (d.icon) {
          setIconUrl(d.icon);
          localStorage.setItem('user_icon_url', d.icon);
        } else {
          setIconUrl(null);
          localStorage.removeItem('user_icon_url');
        }
        setImgVer((v) => v + 1);
      }

      if (d.nome !== undefined) localStorage.setItem('user_nome', d.nome || '');
    };

    window.addEventListener('user:profile', onProfile);
    return () => window.removeEventListener('user:profile', onProfile);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'user_icon_url') {
        setIconUrl(e.newValue || null);
        setImgVer((v) => v + 1);
      }
      if (e.key === 'user_nome') {
        setUsuario((u) => ({ ...u, nome: e.newValue || '' }));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    if (!iconUrl) {
      setDisplaySrc(defaultUserImage);
      return;
    }

    const cacheBusted = withVersion(iconUrl, imgVer);
    setDisplaySrc(cacheBusted);

    (async () => {
      try {
        const resp = await fetch(cacheBusted, { cache: 'reload' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob = await resp.blob();
        const objUrl = URL.createObjectURL(blob);
        objectUrlRef.current = objUrl;
        setDisplaySrc(objUrl);
      } catch (e) {
      }
    })();

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [iconUrl, imgVer]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; 

    const url = `${import.meta.env.VITE_API_URL}/lembretes/eventos?token=${encodeURIComponent(token)}`;
    const evtSource = new EventSource(url);

    evtSource.addEventListener("ping", (e) => {
      console.log("SSE conectado:", e.data);
    });

    evtSource.addEventListener("lembreteCriado", () => {
      setTemNotificacoes(true);
    });

    evtSource.addEventListener("erro", (e) => {
      console.warn("Evento de erro SSE:", e.data);
    });

    evtSource.onerror = (err) => {
      console.warn("Erro SSE:", err);
    };

    return () => evtSource.close();
  }, []);

  const handleClick = (item, temRota = true) => {
    if (submenuAberto === item) {
      setSubmenuAberto('');
      setSubmenuSelecionado({ pai: '', item: '' });
      navigate('/home');
    } else {
      setSubmenuAberto(item);
      setSubmenuSelecionado({ pai: '', item: '' });
      if (temRota) navigate('/' + item);
    }
  };

  const handleSubmenuClick = (pai, item, idLista = null) => {
    if (submenuSelecionado.pai === pai && submenuSelecionado.item === item) {
      setSubmenuSelecionado({ pai: '', item: '' });
      return;
    }

    setSubmenuSelecionado({ pai, item });

    if (pai === 'listas') {
      setSubmenuAberto('listas');
      const listaSlug = encodeURIComponent(item);
      navigate(`/listas/${listaSlug}`);
    } else if (pai === 'tecnicas') {
      navigate(`/${item.toLowerCase()}`);
    } else if (pai === 'relatorios') {
      navigate(`/relatorio${item.toLowerCase()}`);
    }
  };

  const abrirModal = () => setModalListaAberto(true);
  const fecharModal = () => setModalListaAberto(false);

  const atualizarListas = async () => {
    try {
      const listas = await listarListas();
      const ordenadas = [...listas].sort((a, b) =>
        a.nomeLista.localeCompare(b.nomeLista, 'pt-BR')
      );
      setListas(ordenadas);

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
      toast.error(msg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_icon_url');
    window.location.href = '/login';
  };

  const handleCronometro = () => {
    if (location.pathname === "/cronometro") {
      navigate("/home"); 
    } else {
      navigate("/cronometro"); 
    }
  };

  const handleLembretes = () => {
    setTemNotificacoes(false);

    if (location.pathname === "/lembretes") {
      navigate("/home");
    } else {
      navigate("/lembretes");
    }
  };

  return (
    <MenuWrapper>
      <Usuario>
        <IconUsuario
          onClick={() => handleClick('perfil', true)}
        >
          <img
            key={displaySrc}
            src={displaySrc}
            alt="Icon usuário"
            onError={() => {
              setDisplaySrc(defaultUserImage);
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              borderRadius: '50%'
            }}
          />
        </IconUsuario>

        <InfoUsuario style={{ cursor: 'default' }}>
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
          style={{
            color:
              submenuAberto === 'listas' && submenuSelecionado.pai !== 'listas'
                ? '#AF52DE'
                : submenuSelecionado.pai === 'listas' && submenuSelecionado.item
                  ? ''
                  : submenuAberto === 'listas'
                    ? '#AF52DE'
                    : ''
          }}
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
          <span className="material-symbols-outlined" id="sino" onClick={handleCronometro} >
            schedule
          </span>
          <span className="material-symbols-outlined" id="notificacao" onClick={handleLembretes}>
            {temNotificacoes ? "notifications_unread" : "notifications"}
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
