import { useParams, useNavigate } from 'react-router-dom';
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
import { deletarLista, listarAtividadesPorLista, listarListas, atualizarAtividade } from '../../services/api.js';
import ModalCriarAtividade from '../ModalCriarAtividade/index.jsx';
import AtividadeSelecionada from '../AtividadeSelecionada/index.jsx';
import { showConfirmToast } from '../../components/showToast.jsx';

function Lista() {
    const navigate = useNavigate();
    const { nomeLista } = useParams();

    const [idLista, setIdLista] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        const carregarLista = async () => {
            try {
                const listas = await listarListas();
                const lista = listas.find(l => l.nomeLista === nomeLista);
                if (lista) {
                    setIdLista(lista.idLista);
                    await atualizarAtividades(lista.idLista);
                }
            } catch (err) {
                console.error("Erro ao buscar lista pelo nome", err);
            }
        };
        carregarLista();
    }, [nomeLista]);

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

    const atualizarAtividades = async (id) => {
        if (!id) return;
        try {
            const dados = await listarAtividadesPorLista(id);
            const dadosComConcluido = dados.map(a => ({
                ...a,
                concluido: a.statusAtividade === 1
            }));
            setAtividades(ordenarAtividades(dadosComConcluido));
        } catch (err) {
            console.error("Erro ao buscar atividades da lista", err);
            setAtividades([]);
        }
    };

    const handleExcluir = async () => {
        if (!idLista) return;

        const ok = await showConfirmToast(
        'Tem certeza que deseja excluir esta lista? As atividades dentro da lista também serão excluídas e não serão contabilizadas nos relatórios ',
         { confirmLabel: 'Excluir', cancelLabel: 'Cancelar' }
    );

    if (!ok) return;

    try {
        await deletarLista(idLista);
        window.dispatchEvent(new Event('listasAtualizadas'));
        navigate('/home');
    } catch (err) {
        console.error('Erro ao deletar lista', err);
        alert('Não foi possível deletar a lista');
     }
    };

    const toggleConcluido = async (index) => {
        const atividade = atividades[index];
        const novaConclusao = !atividade.concluido
            ? new Date().toISOString().slice(0, 19).replace('T', ' ')
            : null;
        const novoStatus = !atividade.concluido ? 1 : 0;

        const novaAtividade = { ...atividade, concluido: !atividade.concluido, dataConclusao: novaConclusao, statusAtividade: novoStatus };
        const novasAtividades = [...atividades.slice(0, index), novaAtividade, ...atividades.slice(index + 1)];
        setAtividades(ordenarAtividades(novasAtividades));

        if (atividadeSelecionada?.idAtividade === atividade.idAtividade) setAtividadeSelecionada(novaAtividade);

        try {
            const payload = {
                nomeAtividade: atividade.nomeAtividade || "",
                descricaoAtividade: atividade.descricaoAtividade || "",
                prazoAtividade: atividade.prazoAtividade
                    ? atividade.prazoAtividade.slice(0, 19).replace('T', ' ')
                    : new Date().toISOString().slice(0, 19).replace('T', ' '),
                dataConclusao: novaConclusao,
                statusAtividade: novoStatus,
                ListaAtividades_idLista: idLista,
                ListaAtividades_Usuarios_username: atividade.ListaAtividades_Usuarios_username || atividade.Usuarios_username,
                Usuarios_username: atividade.Usuarios_username || atividade.ListaAtividades_Usuarios_username,
            };
            await atualizarAtividade(atividade.idAtividade, payload);
        } catch (err) {
            console.error('Erro ao atualizar atividade:', err);
            setAtividades(atividades);
            if (atividadeSelecionada?.idAtividade === atividade.idAtividade) setAtividadeSelecionada(atividade);
        }
    };

    const handleAtividadeCriada = async () => {
        if (!idLista) return;
        await atualizarAtividades(idLista);
    };

    const atividadesFiltradas = atividades.filter((a) =>
        (a.nomeAtividade || '').toLowerCase().startsWith(filtro.toLowerCase())
    );

    return (
        <Background>
            <ContainerLista>
                <Header>
                    <NomeLista>{nomeLista}</NomeLista>
                    <Botoes>
                        <span className="material-symbols-outlined" id="delete" onClick={handleExcluir}>delete</span>
                        <span className="material-symbols-outlined" id="add" onClick={() => setMostrarModal(true)}>add</span>
                    </Botoes>
                </Header>

                <Conteudo>
                    <AreaAtividades>
                        {atividadesFiltradas.map((a, index) => {
                            const isSelecionada = atividadeSelecionada?.idAtividade === a.idAtividade;
                            return (
                                <Atividade
                                    key={a.idAtividade || index}
                                    onClick={() => setAtividadeSelecionada(isSelecionada ? null : a)}
                                    style={{ backgroundColor: isSelecionada ? 'var(--cinza-claro)' : 'var(--fundo-menu-ativo)' }}
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
                                    <Prazo>{a.prazoAtividade ? new Date(a.prazoAtividade.replace(" ", "T")).toLocaleDateString() : "Sem prazo"}</Prazo>
                                </Atividade>
                            );
                        })}
                    </AreaAtividades>
                </Conteudo>

                <Pesquisar>
                    <span className="material-symbols-outlined">search</span>
                    <Input type="text" placeholder="Pesquisar..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
                </Pesquisar>
            </ContainerLista>

            <ModalCriarAtividade isOpen={mostrarModal} onClose={() => setMostrarModal(false)} listaId={idLista} onAtividadeCriada={handleAtividadeCriada} />

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

                        setAtividades(prev => {
                            if (atividadeAtualizada.ListaAtividades_idLista !== idLista) return prev.filter(a => a.idAtividade !== atividadeAtualizada.idAtividade);
                            return ordenarAtividades(prev.map(a =>
                                a.idAtividade === atividadeAtualizada.idAtividade
                                    ? { ...atividadeAtualizada, concluido: !!atividadeAtualizada.dataConclusao }
                                    : a
                            ));
                        });

                        if (atividadeAtualizada.ListaAtividades_idLista === idLista) setAtividadeSelecionada({ ...atividadeAtualizada, concluido: !!atividadeAtualizada.dataConclusao });
                        else setAtividadeSelecionada(null);
                    }}
                />
            </Parte2>
        </Background>
    );
}

export default Lista;
