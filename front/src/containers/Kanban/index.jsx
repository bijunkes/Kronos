import { React, useState, useEffect } from 'react';
import { Container, Painel, BoxTitulo, BoxTarefas, NomeTarefa, Icones, BoxAdicionar, BoxNomeTarefa, BoxIcones } from './style.js';
import ModalTecnicas from "../ModalTecnicas/index.jsx";
import { atualizarAtividade, adicionarAtividadeEmKanban, atualizarAtividadeEmKanban, listarAtividadesEmKanban, listarAtividades, atualizarIdKanbanAtividade, deletarAtividadeDeKanban } from "../../services/api.js";


function Kanban() {

    const [mostrarModal, setMostrarModal] = useState(false)
    const [atividades, setAtividades] = useState([

    ])
    const [atividadesAdicionadas, setAtividadesAdicionadas] = useState([])
    const [colunaSelecionada, setColunaSelecionada] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

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

    const buscarAtividades = async () => {

        try {
            const todasAtividadesEmKanban = await listarAtividadesEmKanban();

            const todasAtividades = await listarAtividades();
            console.log(todasAtividadesEmKanban);
            const matrizMap = new Map();
            todasAtividadesEmKanban.forEach(item => {
                matrizMap.set(item.idAtividadeKanban, item.classificacao)
            })
            const verificaConclusao = (atividade) => {
                console.log(atividade);
                if (atividade.statusAtividade == 1) {
                    atividades.forEach(item => {
                        if (item.idAtividadeKanban == atividade.Kanban_idAtividadeKanban && item.classificacao !== 3) {
                            atualizaKanban(item.idAtividadeKanban, 3, capturaData())
                        }
                    })
                    return 3;
                }
                return parseInt(matrizMap.get(atv.Kanban_idAtividadeKanban));
            }
            const atividadesEmKanban = todasAtividades.filter(atv => matrizMap.has(atv.Kanban_idAtividadeKanban)).map(atv => ({
                ...atv,
                coluna: verificaConclusao(atv),
                nome: atv.nomeAtividade,
            }))
            setAtividades(atividadesEmKanban);
            setAtividadesAdicionadas(atividadesEmKanban);


            console.log("todasAtividades:", todasAtividades);
            console.log("todasAtividadesEmMatriz:", todasAtividadesEmKanban);
            console.log("AtividadesEmKanban:", atividadesEmKanban);
            console.log("Atividades doKanban:", atividadesAdicionadas);

            console.log(atividadesEmKanban);
        } catch (err) {
            console.error('Erro ao carregar todas as atividades', err);
            setErro('Erro ao carregar as atividades.');
        } finally {
            setCarregando(false);
        }
    };



    useEffect(() => {
        buscarAtividades();
    }, []);

    const atualizaKanban = async (id, classificacao, dataAlteracao) => {
        console.log(`id: ${id}; classificação: ${classificacao}`)
        await atualizarAtividadeEmKanban(id, classificacao, dataAlteracao);

    }

    const handleClick = (colunaId) => () => {
        setColunaSelecionada(colunaId);
        setMostrarModal(true);
    }
    const handleFecharModal = () => {
        setMostrarModal(false);
    }

    const verificaAtividadeEmLista = (atividadeId) => {

        return atividadesAdicionadas.some((atividade) => atividade.idAtividade === atividadeId)

    }


    const deletar = async (atividadeId) => {

        setAtividades(prev => prev.filter(atividade => atividade.idAtividade !== atividadeId));
        setAtividadesAdicionadas(prev => prev.filter(atividade => atividade.idAtividade !== atividadeId));
        const atividadeDeletada = atividades.find(a => a.idAtividade == atividadeId);
        console.log(atividadeDeletada.Kanban_idAtividadeKanban);
        await deletarAtividadeDeKanban(atividadeDeletada.Kanban_idAtividadeKanban);

    }
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

    const atividadeConcluida = async (atividadeKanban) => {

        console.log("Atividade KAnben: " + atividadeKanban)
        if (atividadeKanban.coluna == 3) {
            const atividade = atividadeKanban;
            const novaConclusao = !atividade.concluido
                ? atividade.dataConclusao || formatarDataMySQL(new Date())
                : null;
            const novoStatus = 1;
            try {
                await atualizarAtividade(atividade.idAtividade, {
                    nomeAtividade: atividade.nomeAtividade,
                    descricaoAtividade: atividade.descricaoAtividade,
                    prazoAtividade: formatarDataMySQL(atividade.prazoAtividade),
                    dataConclusao: novaConclusao,
                    statusAtividade: novoStatus,
                    ListaAtividades_idLista: atividade.ListaAtividades_idLista
                });
            } catch (err) {
                console.error('Erro ao atualizar atividade:', err);
                setAtividades(atividades);
                if (atividadeSelecionada?.idAtividade === atividade.idAtividade) {
                    setAtividadeSelecionada(atividade);
                }
            }
        }

    }
    const proximo = (atividadeId) => {

        setAtividades((prev) => {
            const novaLista = prev.map(t =>
                t.idAtividade === atividadeId
                    ? {
                        ...t,
                        coluna:
                            t.coluna === 1 ? 2 :
                                t.coluna === 2 ? 3 :
                                    t.coluna

                    }
                    : t

            )
            const atividadeAtualizada = novaLista.find(t => t.idAtividade === atividadeId);

            console.log("Atividade KAnben: " + atividadeAtualizada)

            atualizaKanban(atividadeAtualizada.Kanban_idAtividadeKanban, atividadeAtualizada.coluna, capturaData());
            atividadeConcluida(atividadeAtualizada);

            return novaLista;
        });

    }
    const anterior = (atividadeId) => {

        setAtividades((prev) => {
            const novaLista = prev.map(t =>
                t.idAtividade === atividadeId
                    ? {
                        ...t,
                        coluna:
                            t.coluna === 2 ? 1 :
                                t.coluna === 3 ? 2 :
                                    t.coluna

                    }
                    : t

            )
            const atividadeAtualizada = novaLista.find(t => t.idAtividade === atividadeId);


            atualizaKanban(atividadeAtualizada.Kanban_idAtividadeKanban, atividadeAtualizada.coluna, capturaData());

            return novaLista;
        })


    }
    const renderIcons = (coluna, atividadeId) => {
        switch (coluna) {
            case 1:
                return (
                    <BoxIcones>
                        <Icones className="material-symbols-outlined" onClick={() => deletar(atividadeId)}>
                            delete
                        </Icones>
                        <Icones className="material-symbols-outlined" onClick={() => proximo(atividadeId)}>
                            arrow_forward
                        </Icones>
                    </BoxIcones>
                        
              
                );
            case 2:
                return (
                     <BoxIcones>
                        <Icones className="material-symbols-outlined" onClick={() => deletar(atividadeId)}>
                            delete
                        </Icones>
                        <Icones className="material-symbols-outlined" onClick={() => anterior(atividadeId)}>
                            arrow_left_alt
                        </Icones>
                        <Icones className="material-symbols-outlined" onClick={() => proximo(atividadeId)}>
                            arrow_forward
                        </Icones>
                    </BoxIcones>
                );
            case 3:
                return (
                     <BoxIcones>
                        <Icones className="material-symbols-outlined" onClick={() => deletar(atividadeId)}>
                            delete
                        </Icones>
                        <Icones className="material-symbols-outlined" onClick={() => anterior(atividadeId)}>
                            arrow_left_alt
                        </Icones>
                    </BoxIcones>
                );
            default:
                return null;
        }
    };

    const adicionarAtividade = async (atividade) => {
        if (verificaAtividadeEmLista(atividade.idAtividade)) {
            showOkToast("Atividade já inserida no Kanban!", "error");
            setMostrarModal(false);
            return;
        }
        try {

            
            const res = await adicionarAtividadeEmKanban({
                classificacao: colunaSelecionada,
                dataAlteracao: capturaData()
            });
            const idKanban = res.idAtividadeKanban;

            const novaAtividade = { ...atividade, coluna: colunaSelecionada, nome: atividade.nomeAtividade, Kanban_idAtividadeKanban: idKanban, Usuarios_username: atividade.Usuarios_username, dataAlteracao: capturaData() };

            console.log(novaAtividade);
            await atualizarIdKanbanAtividade(novaAtividade.idAtividade, {
                Kanban_idAtividadeKanban: novaAtividade.Kanban_idAtividadeKanban,
                Usuarios_username: novaAtividade.Usuarios_username,
                idAtividade: novaAtividade.idAtividade

            })
            setAtividades((prev) => [...prev, novaAtividade]);
            setAtividadesAdicionadas((prev) => [...prev, novaAtividade]);
        } catch (err) {
            console.error("Erro ao adicionar ou atualizar atividade: ", err);
        }

        setMostrarModal(false);
    };

    return (
        <>
            <Container>
                <Painel id='1'>
                    <BoxTitulo>A Fazer</BoxTitulo>
                    {atividades.filter(atividade => atividade.coluna === 1).map(atividade => (
                        <BoxTarefas key={atividade.idAtividade} id={atividade.idAtividade}>
                            <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa>
                            {renderIcons(atividade.coluna, atividade.idAtividade)}
                        </BoxTarefas>
                    ))}
                    <BoxAdicionar onClick={handleClick(1)} id="Adicionar">Adicionar Tarefa</BoxAdicionar></Painel>
                <Painel id='2'><BoxTitulo>Fazendo</BoxTitulo>
                    {atividades.filter(atividade => atividade.coluna === 2).map(atividade => (
                        <BoxTarefas key={atividade.idAtividade} id={atividade.idAtividade}>
                            <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa>
                            <BoxIcones>{renderIcons(atividade.coluna, atividade.idAtividade)}</BoxIcones>

                        </BoxTarefas>
                    ))}
                    <BoxAdicionar onClick={handleClick(2)} id="Adicionar">Adicionar Tarefa</BoxAdicionar>
                </Painel>
                <Painel id='3'><BoxTitulo>Feito</BoxTitulo>
                    {atividades.filter(atividade => atividade.coluna === 3).map(atividade => (
                        <BoxTarefas key={atividade.idAtividade} id={atividade.idAtividade}>
                            <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa>
                            <BoxIcones>{renderIcons(atividade.coluna, atividade.idAtividade)}</BoxIcones>
                        </BoxTarefas>
                    ))}
                    <BoxAdicionar onClick={handleClick(3)} id="Adicionar">Adicionar Tarefa</BoxAdicionar>
                </Painel>
            </Container>
            {mostrarModal && <ModalTecnicas onClose={handleFecharModal} onAdicionar={adicionarAtividade} />}

        </>
    )
}

export default Kanban;