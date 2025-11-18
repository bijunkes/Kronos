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
} from '../Atividades/styles.js';
import { listarTodasAtividades, atualizarAtividade } from '../../services/api.js';
import AtividadeSelecionada from '../AtividadeSelecionada/index.jsx';

function Hoje() {
  const [atividades, setAtividades] = useState([]);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
  const [filtro, setFiltro] = useState("");

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

  const formatarDataMySQL = (data) => {
    if (!data) return null;
    if (typeof data === 'string' && data.length === 10) return `${data} 00:00:00`;
    const d = new Date(data);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  };

  const carregarAtividadesHoje = async () => {
    try {
      const todas = await listarTodasAtividades();

      const hoje = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];

      const filtradas = todas
        .filter(a => {
          if (!a.prazoAtividade) return false;
          const match = a.prazoAtividade.match(/\d{4}-\d{2}-\d{2}/);
          const dataAtividade = match ? match[0] : null;
          return dataAtividade === hoje;
        })
        .map(a => ({
          ...a,
          concluido: a.statusAtividade === 1
        }));

      setAtividades(ordenarAtividades(filtradas));

      if (
        atividadeSelecionada &&
        !filtradas.some(a => a.idAtividade === atividadeSelecionada.idAtividade)
      ) {
        setAtividadeSelecionada(null);
      }
    } catch (err) {
      console.error("Erro ao carregar atividades de hoje:", err);
    }
  };

  useEffect(() => {
    carregarAtividadesHoje();
  }, []);

  const toggleConcluido = async (index) => {
    const atividade = atividades[index];
    if (!atividade) return;

    const novaConclusao = !atividade.concluido
      ? atividade.dataConclusao || formatarDataMySQL(new Date())
      : null;
    const novoStatus = !atividade.concluido ? 1 : 0;

    const novaAtividade = {
      ...atividade,
      concluido: !atividade.concluido,
      dataConclusao: novaConclusao,
      statusAtividade: novoStatus
    };

    const novasAtividades = [
      ...atividades.slice(0, index),
      novaAtividade,
      ...atividades.slice(index + 1)
    ];
    setAtividades(ordenarAtividades(novasAtividades));

    if (atividadeSelecionada?.idAtividade === atividade.idAtividade) {
      setAtividadeSelecionada(novaAtividade);
    }

    try {
      await atualizarAtividade(atividade.idAtividade, {
        nomeAtividade: atividade.nomeAtividade,
        descricaoAtividade: atividade.descricaoAtividade,
        prazoAtividade: formatarDataMySQL(atividade.prazoAtividade),
        dataConclusao: novaConclusao,
        statusAtividade: novoStatus,
        ListaAtividades_idLista: atividade.ListaAtividades_idLista
      });

      await carregarAtividadesHoje();
    } catch (err) {
      console.error('Erro ao atualizar atividade:', err);
      await carregarAtividadesHoje();
    }
  };

  const atividadesFiltradas = (atividades || []).filter((a) =>
    (a.nomeAtividade || '').toLowerCase().startsWith(filtro.toLowerCase())
  );

  return (
    <Background>
      <ContainerLista>
        <Header>
          <NomeLista>Hoje</NomeLista>
        </Header>

        <Conteudo>
          <AreaAtividades>
            {atividadesFiltradas.length === 0 && (
              <div style={{ padding: '1rem', color: '#888' }}>
                Nenhuma atividade para hoje.
              </div>
            )}
            {atividadesFiltradas.map((a, index) => {
              const isSelecionada = atividadeSelecionada?.idAtividade === a.idAtividade;
              return (
                <Atividade
                  key={a.idAtividade || index}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleConcluido(index);
                      }}
                    >
                      {a.concluido ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                    {a.nomeAtividade}
                  </div>
                  <Prazo>
                    {a.prazoAtividade
                      ? new Date(a.prazoAtividade.replace(' ', 'T')).toLocaleDateString()
                      : 'Sem prazo'}
                  </Prazo>
                </Atividade>
              );
            })}
          </AreaAtividades>
        </Conteudo>

        <Pesquisar>
          <span className="material-symbols-outlined">search</span>
          <Input
            type="text"
            placeholder="Pesquisar..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </Pesquisar>
      </ContainerLista>

      <Parte2>
        <AtividadeSelecionada
          atividade={atividadeSelecionada}
          onClose={() => setAtividadeSelecionada(null)}
          onAtualizarAtividade={async (atividadeAtualizada) => {
            if (!atividadeAtualizada) {
              setAtividadeSelecionada(null);
              setAtividades(prev =>
                prev.filter(a => a.idAtividade !== atividadeSelecionada?.idAtividade)
              );
              return;
            }

            setAtividades(prev => ordenarAtividades(
              prev.map(a =>
                a.idAtividade === atividadeAtualizada.idAtividade
                  ? { ...atividadeAtualizada, concluido: !!atividadeAtualizada.dataConclusao }
                  : a
              )
            ));
            setAtividadeSelecionada({ ...atividadeAtualizada, concluido: !!atividadeAtualizada.dataConclusao });

            await carregarAtividadesHoje();
          }}
        />
      </Parte2>
    </Background>
  );
}

export default Hoje;
