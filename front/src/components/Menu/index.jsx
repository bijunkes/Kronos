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
} from './styles';

function Menu() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({nome: '', username: ''});
  const [submenuAberto, setSubmenuAberto] = useState('');
  const [submenuSelecionado, setSubmenuSelecionado] = useState({ pai: '', item: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('http://localhost:3000/perfil', {
      headers: {Authorization: `Bearer ${token}`}
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
    setSubmenuSelecionado({ pai: '', item: '' });
  };

  const handleSubmenuClick = (pai, item) => {
    setSubmenuSelecionado({ pai, item });
  };

  return (
    <MenuWrapper>
      <Usuario>
        <IconUsuario />
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
            {submenuAberto === 'semana' ? 'calendar_today' : 'calendar_month'}
          </span>
          Semana
        </ItemMenor>

        <ItemMenor style={{ color: submenuAberto === 'tarefas' ? '#007AFF' : '' }} onClick={() => handleClick('tarefas', true)}>
          <span className="material-symbols-outlined">
            {submenuAberto === 'tarefas' ? 'folder_open' : 'folder'}
          </span>
          Tarefas
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
              <BotaoAdicionar>+</BotaoAdicionar>
            )}
          </ListasHeader>
        </ItemMaior>
        <Submenu style={{ display: submenuAberto === 'listas' ? 'block' : 'none' }}>
          <SubmenuItem
            onClick={() => handleSubmenuClick('listas', 'Lista 1')}
            style={{ color: submenuSelecionado.item === 'Lista 1' ? '#AF52DE' : '' }}
          >
            Lista 1
          </SubmenuItem>
        </Submenu>

        <ItemMaior
          style={{ color: submenuAberto === 'tecnicas' && submenuSelecionado.pai !== 'tecnicas' ? '#D732A8' : '' }}
          onClick={() => handleClick('tecnicas', false)}
        >
          Técnicas
        </ItemMaior>
        <Submenu style={{ display: submenuAberto === 'tecnicas' ? 'block' : 'none' }}>
          <SubmenuItem
            onClick={() => handleSubmenuClick('tecnicas', 'Pomodoro')}
            style={{ color: submenuSelecionado.item === 'Pomodoro' ? '#B3261E' : '' }}
          >
            Pomodoro
          </SubmenuItem>
          <SubmenuItem
            onClick={() => handleSubmenuClick('tecnicas', 'Kanban')}
            style={{ color: submenuSelecionado.item === 'Kanban' ? '#007AFF' : '' }}
          >
            Kanban
          </SubmenuItem>
          <SubmenuItem
            onClick={() => handleSubmenuClick('tecnicas', 'Eisenhower')}
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
            onClick={() => handleSubmenuClick('relatorios', 'Diário')}
            style={{ color: submenuSelecionado.item === 'Diário' ? '#B3261E' : '' }}
          >
            Diário
          </SubmenuItem>
          <SubmenuItem
            onClick={() => handleSubmenuClick('relatorios', 'Semanal')}
            style={{ color: submenuSelecionado.item === 'Semanal' ? '#B3261E' : '' }}
          >
            Semanal
          </SubmenuItem>
        </Submenu>
      </Lista>
    </MenuWrapper>
  );
}

export default Menu;
