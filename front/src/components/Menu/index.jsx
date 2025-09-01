import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import { criarLista, listarListas, deletarLista } from '../../services/api.js';
import ModalLista from '../../containers/ModalLista/index.jsx';

function Menu() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({ nome: '', username: '' });

  const [modalListaAberto, setModalListaAberto] = useState(false);
  const [listas, setListas] = useState([]);

  const [submenuAberto, setSubmenuAberto] = useState('');
  const [submenuSelecionado, setSubmenuSelecionado] = useState({ pai: '', item: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('http://localhost:3000/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsuario(res.data))
      .catch(err => console.error('Erro ao buscar usuário:', err));
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
      setSubmenuSelecionado({pai: '', item: ''});
      setSubmenuAberto('listas');
      navigate('/listas');
      return;
    }
    setSubmenuSelecionado({pai, item});
    if (pai === 'listas') {
      const listaSlug = encodeURIComponent(item);
      navigate(`/listas/${listaSlug}`);
    }
  };

  const abrirModal = () => setModalListaAberto(true);
  const fecharModal = () => {
    setNovaLista('');
    setModalListaAberto(false);
  };

  const atualizarListas = async () => {
    try {
      const listas = await listarListas();
      setListas(listas);
    } catch (err) {
      console.error("Erro ao buscar listas:", err)
    }
  }

  useEffect(() => {
    if (submenuAberto === 'listas') {
      atualizarListas()
    }
  }, [submenuAberto])

  const handleCriarLista = async (nome) => {
    if (listas.some(lista => lista.nomeLista.toLowerCase() === nome.toLowerCase())){
      alert("Lista existe. Tente outro nome.");
      return;
    }
    try {
      await criarLista(nome);
      atualizarListas();
      fecharModal();
    } catch (err) {
      console.error("Erro ao criar lista:", err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <MenuWrapper>
      <Usuario>
        <IconUsuario onClick={() => {
          setSubmenuAberto('');
          setSubmenuSelecionado({ pai: '', item: '' });
          navigate(`/${usuario.username}`);
        }}>
          <img src={defaultUserImage} alt="Icon usuário" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </IconUsuario>
        <InfoUsuario>
          <NomeUsuario>{usuario.nome}</NomeUsuario>
          <Username>@{usuario.username}</Username>
        </InfoUsuario>
      </Usuario>

      <Lista>
        <ItemMenor style={{ color: submenuAberto === 'hoje' ? '#FFCC00' : '' }} onClick={() => handleClick('hoje', true)}>
          <span className="material-symbols-outlined">
            {submenuAberto === 'hoje' ? 'wb_sunny' : 'light_mode'}
          </span>
          Hoje
        </ItemMenor>

        <ItemMenor style={{ color: submenuAberto === 'semana' ? '#34C759' : '' }} onClick={() => handleClick('semana', true)}>
          <span className="material-symbols-outlined">
            {submenuAberto === 'semana' ? 'calendar_month' : 'calendar_today'}
          </span>
          Semana
        </ItemMenor>

        <ItemMenor style={{ color: submenuAberto === 'atividades' ? '#007AFF' : '' }} onClick={() => handleClick('atividades', true)}>
          <span className="material-symbols-outlined">
            {submenuAberto === 'atividades' ? 'folder_open' : 'folder'}
          </span>
          Atividades
        </ItemMenor>
      </Lista>

      <Lista>
        <ItemMaior
          style={{ color: submenuAberto === 'listas' && submenuSelecionado.pai !== 'listas' ? '#AF52DE' : '' }}
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
          {listas.map((lista) => (
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
          style={{ color: submenuAberto === 'tecnicas' && submenuSelecionado.pai !== 'tecnicas' ? '#D732A8' : '' }}
          onClick={() => handleClick('tecnicas', false)}
        >
          Técnicas
        </ItemMaior>
        <Submenu style={{ display: submenuAberto === 'tecnicas' ? 'block' : 'none' }}>
          <SubmenuItem
            onClick={() => { handleSubmenuClick('tecnicas', 'Pomodoro'); navigate('/pomodoro') }}
            style={{ color: submenuSelecionado.item === 'Pomodoro' ? '#B3261E' : '' }}
          >
            Pomodoro
          </SubmenuItem>
          <SubmenuItem
            onClick={() => { handleSubmenuClick('tecnicas', 'Kanban'); navigate('/kanban') }}
            style={{ color: submenuSelecionado.item === 'Kanban' ? '#007AFF' : '' }}
          >
            Kanban
          </SubmenuItem>
          <SubmenuItem
            onClick={() => { handleSubmenuClick('tecnicas', 'Eisenhower'); navigate('/eisenhower') }}
            style={{ color: submenuSelecionado.item === 'Eisenhower' ? '#FFCC00' : '' }}
          >
            Eisenhower
          </SubmenuItem>
        </Submenu>

        <ItemMaior
          style={{ color: submenuAberto === 'relatorios' && submenuSelecionado.pai !== 'relatorios' ? '#B3261E' : '' }}
          onClick={() => handleClick('relatorios', false)}
        >
          Relatórios
        </ItemMaior>
        <Submenu style={{ display: submenuAberto === 'relatorios' ? 'block' : 'none' }}>
          <SubmenuItem
            onClick={() => { handleSubmenuClick('relatorios', 'Diário'); navigate('/relatoriodiario') }}
            style={{ color: submenuSelecionado.item === 'Diário' ? '#B3261E' : '' }}
          >
            Diário
          </SubmenuItem>
          <SubmenuItem
            onClick={() => { handleSubmenuClick('relatorios', 'Semanal'); navigate('/relatoriosemanal') }}
            style={{ color: submenuSelecionado.item === 'Semanal' ? '#B3261E' : '' }}
          >
            Semanal
          </SubmenuItem>
        </Submenu>
      </Lista>
      <OpcoesAbaixo>
        <OpcoesAbaixo1>
          <span class="material-symbols-outlined">
            schedule
          </span>
          <span class="material-symbols-outlined">
            notifications
          </span>
        </OpcoesAbaixo1>
        <span class="material-symbols-outlined" onClick={handleLogout}>
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
