import React, { useState, useEffect } from 'react';
import { Container, Excluir, Header, NomeAtividade, Status, Datas, Data, Input, Desc, DescTextarea, Lista, Tecnicas, Tecnica } from './styles.js';
import { atualizarAtividade, deletarAtividade, listarListas } from '../../services/api';
import { showConfirmToast } from '../../components/showToast.jsx';

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

    const listaAtual = listaSelecionada || atividade.ListaAtividades_idLista || listas[0]?.idLista;


    const [tecnicasAtivas, setTecnicasAtivas] = useState({
        pomodoro: !!atividade.Pomodoro_idStatus,
        kanban: !!atividade.Kanban_idAtividadeKanban,
        eisenhower: !!atividade.Eisenhower_idAtividadeEisenhower,
    });

    const toggleTecnica = async (tipo) => {
        const novoEstado = { ...tecnicasAtivas, [tipo]: !tecnicasAtivas[tipo] };
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
        } else {
            setNome('');
            setStatus(0);
            setPrazo('');
            setConclusao('');
            setDescricao('');
        }
    }, [atividade]);


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
                Pomodoro_idStatus: tecnicasAtivas.pomodoro ? 1 : null,
                Kanban_idAtividadeKanban: tecnicasAtivas.kanban ? 1 : null,
                Eisenhower_idAtividadeEisenhower: tecnicasAtivas.eisenhower ? 1 : null,
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
            <Tecnica
                tipo="pomodoro"
                ativo={tecnicasAtivas.pomodoro}
                onClick={() => toggleTecnica("pomodoro")}
            >
                Pomodoro
            </Tecnica>
            <Tecnica
                tipo="kanban"
                ativo={tecnicasAtivas.kanban}
                onClick={() => toggleTecnica("kanban")}
            >
                Kanban
            </Tecnica>
            <Tecnica
                tipo="eisenhower"
                ativo={tecnicasAtivas.eisenhower}
                onClick={() => toggleTecnica("eisenhower")}
            >
                Eisenhower
            </Tecnica>

        </Container>
    );
}

export default AtividadeSelecionada;