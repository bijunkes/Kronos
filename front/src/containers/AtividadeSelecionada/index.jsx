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
        // toggleTecnica(tipo);
        alterarAtividadeEmTecnica(tipo, atividade);
    }

    const toggleTecnica = async (tipo) => {
        const novoEstado = { ...tecnicasAtivas, [tipo]: !tecnicasAtivas[tipo] };
        const atv = atividade
        setTecnicasAtivas(novoEstado);
        try {
            await atualizarAtividade(atividade.idAtividade, {
                Pomodoro_idStatus: novoEstado.pomodoro ? 1 : null,
                Kanban_idAtividadeKanban: novoEstado.kanban ? 1 : null,
                Eisenhower_idAtividadeEisenhower: novoEstado.eisenhower ? 1 : null,
            });
        } catch (err) {
            console.error("Erro ao atualizar técnicas:", err);
        }

    };

    useEffect(() => {
        const carregarListas = async () => {
            try {
                const dados = await listarListas();
                setListas(dados);
            } catch (err) {
            }
        };
        carregarListas();
    }, []);

    useEffect(() => {
        if (atividade) {
            setNome(atividade.nomeAtividade || '');
            setStatus(Number(atividade.statusAtividade) || 0);
            setPrazo(atividade.prazoAtividade || '');
            setConclusao(atividade.dataConclusao || '');
            setDescricao(atividade.descricaoAtividade || '');
            setListaSelecionada(atividade.ListaAtividades_idLista || listas[0]?.idLista); // ✅ atualizar
        } else {
            setNome('');
            setStatus(0);
            setPrazo('');
            setConclusao('');
            setDescricao('');
            setListaSelecionada(listas[0]?.idLista || '');
        }
    }, [atividade, listas]);


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
                        showOkToast('Atividade adicionada em Não importante e Não urgente')

                    } catch (err) {
                        console.error("Erro ao adicionar ou atualizar atividade: ", err);
                    }
                    return;

                }
            }

            else {
                await excluirDeTecnicas("eisenhower", atividade)
                await atualizarIdEisenAtividade(atividad.idAtividade, {
                    Eisenhower_idAtividadeEisenhower: null,
                    Usuarios_username: atividad.Usuarios_username,
                    idAtividade: atividad.idAtividade

                })
                showOkToast('Atividade retirada de Eisenhower')

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

                        console.log("CHEGOU AQUI")
                        await atualizarIdKanbanAtividade(atividad.idAtividade, {
                            Kanban_idAtividadeKanban: idKanban,
                            Usuarios_username: atividad.Usuarios_username,
                            idAtividade: atividad.idAtividade

                        })
                        console.log("PASSOU DALI")
                    } catch (err) {
                        console.error("Erro ao adicionar ou atualizar atividade: ", err);
                    }

                    return;

                }
            }

            else {
                await excluirDeTecnicas("kanban", atividade)
                await atualizarIdKanbanAtividade(atividad.idAtividade, {
                    Kanban_idAtividadeKanban: null,
                    Usuarios_username: atividad.Usuarios_username,
                    idAtividade: atividad.idAtividade

                })
                showOkToast('Atividade retirada de Kanban')
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
                    showOkToast("Erro: atividade inválida");
                    return;
                }

                if (tecnicasAtivas.pomodoro) {
                    await removerAtividadeDoPomodoro(atividad.idAtividade);

                    setTecnicasAtivas(prev => ({ ...prev, pomodoro: false }));
                    onAtualizarAtividade?.({ ...atividade, Pomodoro_idStatus: null });

                    showOkToast("Atividade removida do Pomodoro!");
                    return;
                }

                const res = await salvarAtividadesSessao(idSessao, [{ idAtividade: atividad.idAtividade }]);

                setTecnicasAtivas(prev => ({ ...prev, pomodoro: true }));
                onAtualizarAtividade?.({ ...atividade, Pomodoro_idStatus: idSessao });

                showOkToast("Atividade adicionada ao Pomodoro!");

            } catch (err) {
                console.error("Erro ao adicionar/remover do Pomodoro:", err);
                showOkToast("Erro ao adicionar/remover atividade");
            }

            return;
        }
    };

    const excluirDeTecnicas = async (tipo, atividade) => {
        if (tipo == "kanban") {
            const listaKanban = await listarAtividadesEmKanban();
            console.log(listaKanban);
            const atividadeDeletada = listaKanban.find(a => a.idAtividadeKanban == atividade.Kanban_idAtividadeKanban);
            if (!atividadeDeletada) {
                console.warn("Atividade não encontrada no Kanban:", atividade.Kanban_idAtividadeKanban);
                return;
            }
            console.log("Excluindo do Kanban:", atividadeDeletada.idAtividadeKanban);
            await deletarAtividadeDeKanban(atividadeDeletada.idAtividadeKanban);
        } else if (tipo == "eisenhower") {
            const listaMatriz = await listarAtividadesEmMatriz();
            console.log(listaMatriz);
            const atividadeDeletada = listaMatriz.find(a => a.idAtividadeEisenhower == atividade.Eisenhower_idAtividadeEisenhower);
            if (!atividadeDeletada) {
                console.warn("Atividade não encontrada na Matriz:", atividade.Eisenhower_idAtividadeEisenhower);
                return;
            }
            console.log("Excluindo da Matriz:", atividadeDeletada.idAtividadeEisenhower);
            await deletarAtividadeDeMatriz(atividadeDeletada.idAtividadeEisenhower);
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

            await removerAtividadeDoPomodoro(atividade.idAtividade);

            if (atividade.Kanban_idAtividadeKanban !== null) {
                await excluirDeTecnicas("kanban", atividade)
            }
            if (atividade.Eisenhower_idAtividadeEisenhower !== null) {
                await excluirDeTecnicas("eisenhower", atividade)
            }
            await deletarAtividade(atividade.idAtividade);
            onAtualizarAtividade?.(null);
        } catch (err) {
            console.error('Erro ao excluir atividade', err);
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
                            await atualizarCampo({
                                dataConclusao: formatarDataMySQL(novaData),
                                statusAtividade: novoStatus,
                            });
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