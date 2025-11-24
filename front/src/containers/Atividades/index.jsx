import React, { useEffect, useState } from 'react';
import {
  Background,
  ContainerLista,
  Conteudo,
  Header,
  NomeLista,
  Botoes,
  AreaAtividades,
  Atividade,
  Prazo,
  Parte2,
  Pesquisar,
  Input
} from './styles.js';
import { 
  listarTodasAtividades, 
  listarListas, 
  atualizarAtividade, 
  deletarAtividadeDeMatriz, 
  atualizarAtividadeEmKanban, 
  obterUltimaSessaoPomodoro, 
  salvarAtividadesSessao 
} from '../../services/api.js';
import ModalCriarAtividade from '../ModalCriarAtividade/index.jsx';
import AtividadeSelecionada from '../AtividadeSelecionada/index.jsx';

function Atividades() {
  const [idLista, setIdLista] = useState(null);
  const [atividades, setAtividades] = useState([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtro, setFiltro] = useState("");

  // Função para ordenar atividades
  const ordenarAtividades = (lista) => {
    return [...lista].sort((a, b) => {
      if (a.concluido !== b.concluido) return a.concluido ? 1 : -1;
      const dataA = a.prazoAtividade ? new Date(a.prazoAtividade) : null;
      const dataB = b.prazoAtividade ? new Date(b.prazoAtividade) : null;
      if (!dataA && !dataB) return 0;
      if (!dataA) return 1;
      if (!dataB) return -1;
      return dataA - dataB;
    });
  };

  // Formata data para MySQL
  const formatarDataMySQL = (data) => {
    if (!data) return null;
    const d = new Date(data);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  };

  // Recarrega todas as atividades do backend
  const carregarAtividades = async () => {
    try {
      const todas = await listarTodasAtividades();
      const todasComConcluido = todas.map(a => ({
        ...a,
        concluido: a.statusAtividade === 1,
      }));
      setAtividades(ordenarAtividades(todasComConcluido));

      // Atualiza a atividade selecionada, se existir
      if (atividadeSelecionada) {
        const atualizada = todas.find(a => a.idAtividade === atividadeSelecionada.idAtividade);
        setAtividadeSelecionada(atualizada || null);
      }
    } catch (err) {
      console.error("Erro ao carregar atividades:", err);
    }
  };

  // Carrega lista padrão e atividades no início
  useEffect(() => {
    const init = async () => {
      try {
        const listas = await listarListas();
        const listaPadrao = listas.find(l => l.nomeLista === "Atividades");
        if (listaPadrao) setIdLista(listaPadrao.idLista);
        await carregarAtividades();
      } catch (err) {
        console.error("Erro ao inicializar listas:", err);
      }
    };
    init();
  }, []);

  // Toggle concluir atividade
  const toggleConcluido = async (index) => {
    const atividade = atividades[index];
    if (!atividade) return;

    const novaConclusao = !atividade.concluido ? formatarDataMySQL(new Date()) : null;
    const novoStatus = !atividade.concluido ? 1 : 0;

    try {
      // Remove do Pomodoro se necessário
      if (atividade.Pomodoro_idStatus) {
        const sessao = await obterUltimaSessaoPomodoro();
        if (sessao?.idStatus) {
          const filtradas = (sessao.atividadesVinculadas || []).filter(id => id !== atividade.idAtividade);
          await salvarAtividadesSessao(sessao.idStatus, filtradas.map(id => ({ idAtividade: id })));
        }
      }

      // Atualiza atividade no backend
      await atualizarAtividade(atividade.idAtividade, {
        nomeAtividade: atividade.nomeAtividade,
        descricaoAtividade: atividade.descricaoAtividade,
        prazoAtividade: atividade.prazoAtividade,
        statusAtividade: novoStatus,
        dataConclusao: novaConclusao,
        ListaAtividades_idLista: idLista,
        Pomodorostatus: null,
        Kanban_idAtividadeKanban: atividade.Kanban_idAtividadeKanban,
        Eisenhower_idAtividadeEisenhower: null
      });

      // Atualiza Kanban se necessário
      if (novoStatus === 0 && atividade.Kanban_idAtividadeKanban) {
        await atualizarAtividadeEmKanban(atividade.Kanban_idAtividadeKanban, 1, formatarDataMySQL(new Date()));
      }

      // Recarrega todas as atividades do backend
      await carregarAtividades();
    } catch (err) {
      console.error("Erro ao atualizar atividade:", err);
    }
  };

  const atividadesFiltradas = atividades.filter(a =>
    (a.nomeAtividade || '').toLowerCase().startsWith(filtro.toLowerCase())
  );

  return (
    <Background>
      <ContainerLista>
        <Header>
          <NomeLista style={{ cursor: 'default' }}>Atividades</NomeLista>
          <Botoes>
            <span
              className="material-symbols-outlined"
              id="add"
              onClick={() => idLista && setMostrarModal(true)}
            >
              add
            </span>
          </Botoes>
        </Header>

        <Conteudo>
          <AreaAtividades>
            {atividadesFiltradas.map((a, index) => {
              const isSelecionada = atividadeSelecionada?.idAtividade === a.idAtividade;
              return (
                <Atividade
                  key={a.idAtividade || index}
                  concluido={a.concluido}
                  onClick={() => setAtividadeSelecionada(isSelecionada ? null : a)}
                  style={{
                    backgroundColor: isSelecionada
                      ? 'var(--cinza-claro)'
                      : 'var(--fundo-menu-ativo)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '20px', cursor: 'pointer' }}
                      onClick={(e) => { e.stopPropagation(); toggleConcluido(index); }}
                    >
                      {a.concluido ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                    {a.nomeAtividade}
                  </div>
                  <Prazo>
                    {a.prazoAtividade ? new Date(a.prazoAtividade.replace(' ', 'T')).toLocaleDateString() : 'Sem prazo'}
                  </Prazo>
                </Atividade>
              );
            })}
          </AreaAtividades>
        </Conteudo>

        <Pesquisar>
          <span style={{ cursor: 'default' }} className="material-symbols-outlined">search</span>
          <Input
            type="text"
            placeholder="Pesquisar..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </Pesquisar>
      </ContainerLista>

      {idLista && (
        <ModalCriarAtividade
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          listaId={idLista}
          onAtividadeCriada={async () => {
            setMostrarModal(false);
            await carregarAtividades();
          }}
        />
      )}

      <Parte2>
        <AtividadeSelecionada
          atividade={atividadeSelecionada}
          onClose={() => setAtividadeSelecionada(null)}
          onAtualizarAtividade={async () => {
            await carregarAtividades();
          }}
        />
      </Parte2>
    </Background>
  );
}

export default Atividades;
