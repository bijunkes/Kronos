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
import { listarAtividadesPorLista, listarListas, listarTodasAtividades, atualizarAtividade, deletarAtividadeDeMatriz, atualizarAtividadeEmKanban } from '../../services/api.js';
import ModalCriarAtividade from '../ModalCriarAtividade/index.jsx';
import AtividadeSelecionada from '../AtividadeSelecionada/index.jsx';

function Atividades() {
    const [idLista, setIdLista] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [filtro, setFiltro] = useState("");
    const [listaSelecionada, setListaSelecionada] = useState('');

    useEffect(() => {
        const carregarAtividades = async () => {
            try {
                const todasAtividades = await listarTodasAtividades();
                const todasComConcluido = todasAtividades.map(a => ({
                    ...a,
                    concluido: a.statusAtividade === 1,
                }));
                setAtividades(ordenarAtividades(todasComConcluido));

                const listas = await listarListas();
                const listaPadrao = listas.find(l => l.nomeLista === "Atividades");
                if (listaPadrao) setIdLista(listaPadrao.idLista);

            } catch (err) {
                console.error("Erro ao carregar atividades ou lista padrão", err);
            }
        };
        carregarAtividades();
    }, []);

    const formatarDataMySQL = (data) => {
        if (!data) return null;
        if (data.length === 10) return `${data} 00:00:00`;

        const d = new Date(data);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = d.getHours();
        const mi = d.getMinutes();
        const ss = d.getSeconds();
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    };

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

    const capturaData = () => {
        const dataAtual = new Date();

        const formato = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const dataFormatada = dataAtual.toLocaleString('sv-SE', formato);
        console.log(dataFormatada)
        return dataFormatada.replace(', ', '');
    }

    const toggleConcluido = async (index) => {

        const atividade = atividades[index];
        const novaConclusao = !atividade.concluido
            ? atividade.dataConclusao || capturaData()
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

        console.log("Data de conclusão: " + novaConclusao);

        if (atividadeSelecionada?.idAtividade === atividade.idAtividade) {
            setAtividadeSelecionada(novaAtividade);
        }

        try {
            if (atividade.Eisenhower_idAtividadeEisenhower !== null) { await deletarAtividadeDeMatriz(atividade.Eisenhower_idAtividadeEisenhower); }




            await atualizarAtividade(atividade.idAtividade, {
                nomeAtividade: atividade.nomeAtividade,
                descricaoAtividade: atividade.descricaoAtividade,
                prazoAtividade: atividade.prazoAtividade,
                statusAtividade: novoStatus,
                dataConclusao: novaConclusao,
                ListaAtividades_idLista: listaSelecionada || atividade.ListaAtividades_idLista,
                Pomodorostatus: null,
                Kanban_idAtividadeKanban: atividade.Kanban_idAtividadeKanban,
                Eisenhower_idAtividadeEisenhower: null
            });
            if (novoStatus == 0 && atividade.Kanban_idAtividadeKanban !== null) {
                console.log("aaiiaoiaoiosioaispoia")
                await atualizarAtividadeEmKanban(atividade.Kanban_idAtividadeKanban, 1, formatarDataMySQL(new Date()))

            }

        } catch (err) {
            console.error('Erro ao atualizar atividade:', err);
            setAtividades(atividades);
            if (atividadeSelecionada?.idAtividade === atividade.idAtividade) {
                setAtividadeSelecionada(atividade);
            }
        }
    };

    const atividadesFiltradas = atividades.filter((a) =>
        (a.nomeAtividade || '').toLowerCase().startsWith(filtro.toLowerCase())
    );

    return (
        <Background>
            <ContainerLista>
                <Header>
                    <NomeLista style={{cursor: 'default'}}>Atividades</NomeLista>
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
                                    onClick={() =>
                                        setAtividadeSelecionada(isSelecionada ? null : a)
                                    }
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
                    <span style={{cursor: 'default'}} className="material-symbols-outlined">search</span>
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
                        if (idLista) {
                            const dados = await listarAtividadesPorLista(idLista);
                            const dadosComConcluido = dados.map(a => ({
                                ...a,
                                concluido: a.statusAtividade === 1
                            }));
                            setAtividades(ordenarAtividades(dadosComConcluido));
                        }
                    }}
                />
            )}

            <Parte2>
                <AtividadeSelecionada
                    atividade={atividadeSelecionada}
                    onClose={() => setAtividadeSelecionada(null)}
                    onAtualizarAtividade={(atividadeAtualizada) => {
                        if (!atividadeAtualizada) {
                            setAtividadeSelecionada(null);
                            setAtividades(prev => prev.filter(a => a.idAtividade !== (atividadeSelecionada?.idAtividade)));
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
                    }}
                />
            </Parte2>
        </Background>
    );
}

export default Atividades;
