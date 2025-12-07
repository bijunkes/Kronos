import React, { useState, useEffect } from 'react';
import { Container, Excluir, Header, NomeAtividade, Status, Datas, Data, Input, Desc, DescTextarea, Lista, Tecnicas, Tecnica, Pomodoro } from './styles.js';
import { atualizarIdKanbanAtividade, atualizarIdEisenAtividade, adicionarAtividadeEmKanban, adicionarAtividadeEmMatriz, atualizarAtividade, deletarAtividade, listarListas, listarAtividadesEmMatriz, listarAtividadesEmKanban, deletarAtividadeDeKanban, deletarAtividadeDeMatriz, obterUltimaSessaoPomodoro, salvarAtividadesSessao, criarSessaoPomodoro } from '../../services/api';
import { showConfirmToast, showOkToast } from '../../components/showToast.jsx';

function AtividadeSelecionada({ atividade, onAtualizarAtividade }) {
    if (!atividade) return null;
    const LIMITE_DESC = 500;

    const [nome, setNome] = useState(atividade.nomeAtividade || '');
    const [status, setStatus] = useState(Number(atividade.statusAtividade) || 0);
    const [prazo, setPrazo] = useState(atividade.prazoAtividade || '');
    const [conclusao, setConclusao] = useState(atividade.dataConclusao || '');
    const [descricao, setDescricao] = useState(atividade.descricaoAtividade || '');
    const [listas, setListas] = useState([]);
    const [listaSelecionada, setListaSelecionada] = useState(atividade.ListaAtividades_idLista || '');
    const [err, setErr] = useState('');

    const listaAtual = listaSelecionada || atividade.ListaAtividades_idLista || listas[0]?.idLista;

    const [tecnicasAtivas, setTecnicasAtivas] = useState({
        pomodoro: !!atividade.Pomodoro_idStatus,
        kanban: !!atividade.Kanban_idAtividadeKanban,
        eisenhower: !!atividade.Eisenhower_idAtividadeEisenhower,
    });

    const botaoTecnicas = (tipo) => {

        alterarAtividadeEmTecnica(tipo, atividade);
    }

    useEffect(() => {
        const carregarListas = async () => {
            try {
                const dados = await listarListas();

                const ordenadas = [...dados].sort((a, b) => {
                    if (a.nomeLista === "Atividades") return -1;
                    if (b.nomeLista === "Atividades") return 1;

                    return a.nomeLista.localeCompare(b.nomeLista, 'pt-BR', { numeric: true });
                });

                setListas(ordenadas);
            } catch (err) { }
        };
        carregarListas();
    }, []);

    useEffect(() => {
        if (!atividade) return;

        setNome(atividade.nomeAtividade || '');
        setStatus(Number(atividade.statusAtividade) || 0);
        setPrazo(atividade.prazoAtividade || '');
        setConclusao(atividade.dataConclusao || '');
        setDescricao(atividade.descricaoAtividade || '');
        setListaSelecionada(atividade.ListaAtividades_idLista || listas[0]?.idLista);
        setTecnicasAtivas({
            pomodoro: !!atividade.Pomodoro_idStatus,
            kanban: !!atividade.Kanban_idAtividadeKanban,
            eisenhower: !!atividade.Eisenhower_idAtividadeEisenhower,
        });
    }, [atividade, listas]);


    useEffect(() => {
        if (!atividade) return;

        setTecnicasAtivas({
            pomodoro: !!atividade.Pomodoro_idStatus,
            kanban: !!atividade.Kanban_idAtividadeKanban,
            eisenhower: !!atividade.Eisenhower_idAtividadeEisenhower,
        });
    }, [atividade]);

    useEffect(() => {
        const carregarUltimaSessao = async () => {
            try {
                const sessao = await obterUltimaSessaoPomodoro();
                if (!sessao) return;

                const vinculadas = sessao.atividadesVinculadas ?? [];
                const isLinked = vinculadas.includes?.(atividade.idAtividade) ||
                    vinculadas.some?.(a => a?.idAtividade === atividade.idAtividade);

                setTecnicasAtivas(prev => ({ ...prev, pomodoro: !!isLinked }));
            } catch (err) {
                console.error("Erro ao carregar última sessão (AtividadeSelecionada):", err);
            }
        };

        if (atividade?.idAtividade) carregarUltimaSessao();
    }, [atividade]);

    const removerAtividadeDoPomodoro = async (atividadeId) => {
        try {
            const sessao = await obterUltimaSessaoPomodoro();
            if (!sessao || !sessao.idStatus) return;

            const idSessao = sessao.idStatus;

            const atuais = Array.isArray(sessao.atividadesVinculadas)
                ? sessao.atividadesVinculadas
                : [];

            const filtradas = atuais.filter(id => id !== atividadeId);

            await salvarAtividadesSessao(idSessao, filtradas.map(id => ({ idAtividade: id })));

            return true;
        } catch (err) {
            console.error("Erro ao remover atividade do Pomodoro:", err);
            return false;
        }
    };

    const capturaData = () => {
        const dataAtual = new Date();

        let min = dataAtual.getMinutes();
        let seg = dataAtual.getSeconds();
        let h = dataAtual.getHours();
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        let ano = dataAtual.getFullYear();

        return `${ano}-${mes}-${dia} ${h}:${min}:${seg}`
    }

    const alterarAtividadeEmTecnica = async (tipo, atividad) => {

        if (tipo == "eisenhower") {
            if (atividad.Eisenhower_idAtividadeEisenhower == null) {
                const novoEstado = { ...tecnicasAtivas, [tipo]: !tecnicasAtivas[tipo] };
                setTecnicasAtivas(novoEstado);
                if (atividad.statusAtividade == 1) {
                    showOkToast('Não é possível adicionar atividades concluídas em técnicas', err)
                } else {
                    try {

                        const res = await adicionarAtividadeEmMatriz({
                            classificacao: 4,
                            dataAlteracao: capturaData()
                        });
                        const idEisen = res.idAtividadeEisenhower;
                        await atualizarIdEisenAtividade(atividad.idAtividade, {
                            Eisenhower_idAtividadeEisenhower: idEisen,
                            Usuarios_username: atividad.Usuarios_username,
                            idAtividade: atividad.idAtividade

                        })
                        setTecnicasAtivas(prev => ({ ...prev, eisenhower: true }));
                        const atividadeAtualizadaE = { ...atividade, Eisenhower_idAtividadeEisenhower: idEisen };
                        onAtualizarAtividade?.(atividadeAtualizadaE);

                        showOkToast('Atividade adicionada em Não importante e Não urgente')

                    } catch (err) {
                        console.error("Erro ao adicionar ou atualizar atividade: ", err);
                    }
                    return;

                }
            }

            else {

                try {
                    await excluirDeTecnicas("eisenhower", atividad);
                } catch (err) {
                    console.error("Erro ao excluir da matriz:", err);
                }

                try {
                    await atualizarIdEisenAtividade(atividad.idAtividade, {
                        Eisenhower_idAtividadeEisenhower: null,
                        Usuarios_username: atividad.Usuarios_username,
                        idAtividade: atividad.idAtividade

                    });
                    setTecnicasAtivas(prev => ({ ...prev, eisenhower: false }));
                    const atividadeAtualizadaE = { ...atividade, Eisenhower_idAtividadeEisenhower: null };
                    onAtualizarAtividade?.(atividadeAtualizadaE);
                    showOkToast('Atividade retirada de Eisenhower');
                } catch (err) {
                    console.error("Erro ao atualizar id Eisenhower:", err);
                }

                return;
            }
        } else if (tipo == "kanban") {
            if (atividad.Kanban_idAtividadeKanban == null) {

                if (atividad.statusAtividade == 1) {
                    showOkToast('Não é possível adicionar atividades concluídas em técnicas', err)
                } else {
                    try {
                        const res = await adicionarAtividadeEmKanban({
                            classificacao: 1,
                            dataAlteracao: capturaData()
                        });
                        const idKanban = res.idAtividadeKanban;


                        await atualizarIdKanbanAtividade(atividad.idAtividade, {
                            Kanban_idAtividadeKanban: idKanban,
                            Usuarios_username: atividad.Usuarios_username,
                            idAtividade: atividad.idAtividade

                        })
                        setTecnicasAtivas(prev => ({ ...prev, kanban: true }));
                        const atividadeAtualizadaK = { ...atividade, Kanban_idAtividadeKanban: idKanban };
                        onAtualizarAtividade?.(atividadeAtualizadaK);
                        showOkToast('Atividade adicionada na coluna A Fazer')

                    } catch (err) {
                        console.error("Erro ao adicionar ou atualizar atividade: ", err);
                    }

                    return;

                }
            }

            else {

                try {
                    await excluirDeTecnicas("kanban", atividad);
                } catch (err) {
                    console.error("Erro ao excluir do kanban:", err);
                }

                try {
                    await atualizarIdKanbanAtividade(atividad.idAtividade, {
                        Kanban_idAtividadeKanban: null,
                        Usuarios_username: atividad.Usuarios_username,
                        idAtividade: atividad.idAtividade

                    });
                    setTecnicasAtivas(prev => ({ ...prev, kanban: false }));
                    const atividadeAtualizadaK = { ...atividade, Kanban_idAtividadeKanban: null };
                    onAtualizarAtividade?.(atividadeAtualizadaK);
                    showOkToast('Atividade retirada de Kanban');
                } catch (err) {
                    console.error("Erro ao atualizar id Kanban:", err);
                }

                return;
            }
        } else if (tipo === "pomodoro") {
            if (atividad.statusAtividade == 1) {
                showOkToast("Não é possível adicionar atividades concluídas à técnica Pomodoro");
                return;
            }
            try {
                let sessao;

                try {
                    sessao = await obterUltimaSessaoPomodoro();
                } catch (err) {
                    sessao = await criarSessaoPomodoro();
                }

                const idSessao = sessao.idStatus;

                if (!atividad?.idAtividade) {
                    console.error("ERRO: atividade.idAtividade undefined:", atividad);

                    return;
                }

                if (tecnicasAtivas.pomodoro) {
                    await removerAtividadeDoPomodoro(atividad.idAtividade);

                    setTecnicasAtivas(prev => ({ ...prev, pomodoro: false }));
                    onAtualizarAtividade?.({ ...atividade, Pomodoro_idStatus: null });

                    showOkToast("Atividade removida do Pomodoro");
                    return;
                }

                const res = await salvarAtividadesSessao(idSessao, [{ idAtividade: atividad.idAtividade }]);

                setTecnicasAtivas(prev => ({ ...prev, pomodoro: true }));
                onAtualizarAtividade?.({ ...atividade, Pomodoro_idStatus: idSessao });

                showOkToast("Atividade adicionada ao Pomodoro");

            } catch (err) {
                console.error("Erro ao adicionar/remover do Pomodoro:", err);

            }

            return;
        }
    };

    const excluirDeTecnicas = async (tipo, atividadeParam) => {
        try {
            if (!atividadeParam?.idAtividade) return false;

            if (tipo === "kanban") {
                const listaKanban = await listarAtividadesEmKanban();
                const item = listaKanban.find(k => k.idAtividade === atividadeParam.idAtividade || k.Kanban_idAtividadeKanban === atividadeParam.Kanban_idAtividadeKanban);

                if (!item) {
                    console.warn("Entrada do Kanban não encontrada para a atividade", atividadeParam.idAtividade);
                    return false;
                }

                await deletarAtividadeDeKanban(item.idAtividadeKanban);
                setTecnicasAtivas(prev => ({ ...prev, kanban: false }));
                return true;
            }

            if (tipo == "eisenhower") {

                if (!tecnicasAtivas.eisenhower) {
                    if (atividad.statusAtividade == 1) {
                        showOkToast('Não é possível adicionar atividades concluídas em técnicas', err)
                        return;
                    }

                    try {
                        const res = await adicionarAtividadeEmMatriz({
                            classificacao: 4,
                            dataAlteracao: capturaData()
                        });

                        const idEisen = res.idAtividadeEisenhower;

                        await atualizarIdEisenAtividade(atividad.idAtividade, {
                            Eisenhower_idAtividadeEisenhower: idEisen,
                            Usuarios_username: atividad.Usuarios_username,
                            idAtividade: atividad.idAtividade
                        });

                        setTecnicasAtivas(prev => ({ ...prev, eisenhower: true }));
                        onAtualizarAtividade?.({
                            ...atividade,
                            Eisenhower_idAtividadeEisenhower: idEisen
                        });

                        showOkToast('Atividade adicionada em Não importante e Não urgente');
                        return;

                    } catch (err) {
                        console.error("Erro ao adicionar ou atualizar atividade: ", err);
                        return;
                    }
                }

                if (tecnicasAtivas.eisenhower) {
                    try {
                        await excluirDeTecnicas("eisenhower", atividad);
                    } catch (err) {
                        console.error("Erro ao excluir da matriz:", err);
                    }

                    try {
                        await atualizarIdEisenAtividade(atividad.idAtividade, {
                            Eisenhower_idAtividadeEisenhower: null,
                            Usuarios_username: atividad.Usuarios_username,
                            idAtividade: atividad.idAtividade
                        });

                        setTecnicasAtivas(prev => ({ ...prev, eisenhower: false }));
                        onAtualizarAtividade?.({
                            ...atividade,
                            Eisenhower_idAtividadeEisenhower: null
                        });

                        showOkToast('Atividade retirada de Eisenhower');
                    } catch (err) {
                        console.error("Erro ao atualizar id Eisenhower:", err);
                    }
                    return;
                }
            }

            return false;
        } catch (err) {
            console.error("Erro em excluirDeTecnicas:", err);
            return false;
        }
    };


    const formatarDataMySQL = (data) => {
        if (!data) return null;

        if (data.length === 10) return `${data} 00:00:00`;

        const d = new Date(data);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    };

    const handleExcluir = async () => {
        if (!atividade) return;

        const ok = await showConfirmToast(
            'Tem certeza que deseja excluir esta atividade? Ela não será contabilizada nos relatórios',
            { confirmLabel: 'Excluir', cancelLabel: 'Cancelar' }
        );
        if (!ok) return;

        try {
            await removerAtividadeDoPomodoro(atividade.idAtividade).catch(err => {
                console.warn("Erro ao remover do Pomodoro (continuando):", err);
            });

            const promises = [];

            if (atividade.Kanban_idAtividadeKanban !== null || atividade.Kanban_idAtividadeKanban === 0 || atividade.Kanban_idAtividadeKanban) {
                promises.push(
                    excluirDeTecnicas("kanban", atividade).catch(err => {
                        console.warn("Falha ao excluir do Kanban (continuando):", err);
                        return false;
                    })
                );
            }

            if (atividade.Eisenhower_idAtividadeEisenhower !== null || atividade.Eisenhower_idAtividadeEisenhower === 0 || atividade.Eisenhower_idAtividadeEisenhower) {
                promises.push(
                    excluirDeTecnicas("eisenhower", atividade).catch(err => {
                        console.warn("Falha ao excluir da Matriz (continuando):", err);
                        return false;
                    })
                );
            }

            await Promise.all(promises);

            await deletarAtividade(atividade.idAtividade);

            onAtualizarAtividade?.(null);
        } catch (err) {
            console.error('Erro ao excluir atividade completamente:', err);
        }
    };


    const handleMoverLista = async (e) => {
        const novaListaId = e.target.value;
        setListaSelecionada(novaListaId);

        try {
            await atualizarAtividade(atividade.idAtividade, {
                nomeAtividade: nome.trim() || atividade.nomeAtividade,
                descricaoAtividade: descricao.trim() || null,
                prazoAtividade: formatarDataMySQL(prazo),
                dataConclusao: formatarDataMySQL(conclusao),
                statusAtividade: status === 'Concluído' ? 1 : 0,
                ListaAtividades_idLista: novaListaId,
                Pomodoro_idStatus: tecnicasAtivas.pomodoro ? 1 : null,
                Kanban_idAtividadeKanban: tecnicasAtivas.kanban ? 1 : null,
                Eisenhower_idAtividadeEisenhower: tecnicasAtivas.eisenhower ? 1 : null,
            });

            onAtualizarAtividade?.({
                ...atividade,
                ListaAtividades_idLista: novaListaId
            });
        } catch (err) {
            console.log(err);
        }
    };

    const atualizarCampo = async (camposAtualizados) => {
        try {
            const dadosParaAtualizar = {
                nomeAtividade: nome.trim(),
                descricaoAtividade: descricao.trim() || null,
                prazoAtividade: formatarDataMySQL(prazo),
                dataConclusao: formatarDataMySQL(conclusao),
                statusAtividade: status === 'Concluído' ? 1 : 0,
                ListaAtividades_idLista: listaAtual,
                ...camposAtualizados,
            };

            await atualizarAtividade(atividade.idAtividade, dadosParaAtualizar);

            onAtualizarAtividade?.({ ...atividade, ...camposAtualizados });
        } catch (err) {
            console.error("Erro ao atualizar atividade:", err);
        }
    };

    return (
        <Container>
            <Header>
                <NomeAtividade
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            atualizarCampo({ nomeAtividade: nome });
                        }
                    }}
                    onBlur={() => atualizarCampo({ nomeAtividade: nome })}
                />
                <Excluir
                    className="material-symbols-outlined"
                    onClick={handleExcluir}
                >
                    delete
                </Excluir>
            </Header>
            <Status>{status === 1 ? 'Concluído' : 'A concluir'}</Status>
            <Datas>
                <Data>
                    <span>Prazo: </span>
                    <Input
                        type="date"
                        value={prazo ? prazo.slice(0, 10) : ''}
                        onChange={async (e) => {
                            const novaData = e.target.value;
                            setPrazo(novaData);
                            await atualizarCampo({
                                prazoAtividade: formatarDataMySQL(novaData),
                            });
                        }}
                    />
                </Data>
                <Data>
                    <span>Conclusão: </span>
                    <Input
                        type="date"
                        value={conclusao ? conclusao.slice(0, 10) : ''}
                        onChange={async (e) => {
                            const novaData = e.target.value;
                            setConclusao(novaData);
                            const novoStatus = novaData ? 1 : 0;
                            setStatus(novoStatus);
                            console.log("oi")

                            await atualizarCampo({
                                dataConclusao: formatarDataMySQL(novaData),
                                statusAtividade: novoStatus,
                            });

                            if (novoStatus === 1 && tecnicasAtivas.pomodoro) {
                                const ok = await removerAtividadeDoPomodoro(atividade.idAtividade);

                                if (ok) {
                                    setTecnicasAtivas(prev => ({ ...prev, pomodoro: false }));
                                    onAtualizarAtividade?.({ ...atividade, Pomodoro_idStatus: null });

                                    showOkToast("Atividade concluída e removida do Pomodoro");
                                }
                            }
                        }}

                    />
                </Data>
            </Datas>
            <Desc>
                Descrição:
                <DescTextarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    onBlur={() => atualizarCampo({ descricaoAtividade: descricao })}
                />
                <div style={{
                    textAlign: 'right',
                    fontSize: '12px',
                    color: descricao.length >= LIMITE_DESC ? 'red' : 'gray'
                }}>
                    {descricao.length} / {LIMITE_DESC}
                </div>
            </Desc>
            <Lista>
                <select value={listaSelecionada} onChange={handleMoverLista}>
                    {listas.map((l) => (
                        <option key={l.idLista} value={l.idLista}>
                            {l.nomeLista}
                        </option>
                    ))}
                </select>

            </Lista>
            <Tecnicas>
                Técnicas
            </Tecnicas>
            <Pomodoro
                $tipo="pomodoro"
                $ativo={tecnicasAtivas.pomodoro}
                onClick={() => botaoTecnicas("pomodoro")}
            >
                Pomodoro
            </Pomodoro>
            <Tecnica
                tipo="kanban"
                id='kanban'
                ativo={tecnicasAtivas.kanban}
                onClick={() => botaoTecnicas("kanban")}
                onDoubleClick={async () => await excluirDeTecnicas("kanban", atividade)}
            >
                Kanban
            </Tecnica>
            <Tecnica
                tipo="eisenhower"
                id='eisenhower'
                ativo={tecnicasAtivas.eisenhower}
                onClick={() => botaoTecnicas("eisenhower")}
                onDoubleClick={async () => await excluirDeTecnicas("eisenhower", atividade)}


            >
                Eisenhower
            </Tecnica>


        </Container>

    );
}
export default AtividadeSelecionada;