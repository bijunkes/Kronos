import { React, useState, useEffect } from 'react';
import { Container, Painel, BoxTitulo, BoxTarefa, NomeTarefa, Icones, BoxAdicionar, BoxNomeTarefa, BoxIcones, PainelTarefas } from './style.js';
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
            console.log("chablau: "+[...matrizMap.values()]);
            const verificaConclusao = (atividade) => {
                console.log("LIAWYUuiwquiqwfuiwbf: "+atividade);
                if (atividade.statusAtividade == 1) {
                    todasAtividadesEmKanban.forEach(item => {
                        if (item.classificacao !== 3) {
                            atualizaKanban(item.idAtividadeKanban, 3, capturaData())
                        }
                    })
                    return 3;
                }
                console.log("awrlkhhfguiwvbuiw4eb:  "+matrizMap.get(atividade.Kanban_idAtividadeKanban))
                return parseInt(matrizMap.get(atividade.Kanban_idAtividadeKanban));
            }
            console.log(matrizMap.has(7))
            todasAtividades.forEach(a => {
                console.log(a)
            })
            const atividadesEmKanban = todasAtividades.filter(atv => matrizMap.has(atv.Kanban_idAtividadeKanban)).map(atv => ({
                ...atv,
                coluna: parseInt(matrizMap.get(atv.Kanban_idAtividadeKanban)),
                nome: atv.nomeAtividade,
            }))
            setAtividades(atividadesEmKanban);
            setAtividadesAdicionadas(atividadesEmKanban);


            console.log("todasAtividades:", todasAtividades);
            console.log("todasAtividadesEmKanban:", todasAtividadesEmKanban);
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

    const nulaId = async (atv) => {


        await atualizarIdKanbanAtividade(atv.idAtividade, {
            Kanban_idAtividadeKanban: null,
            Usuarios_username: atv.Usuarios_username,
            idAtividade: atv.idAtividade

        })

    }


    const deletar = async (atividadeId) => {

        setAtividades(prev => prev.filter(atividade => atividade.idAtividade !== atividadeId));
        setAtividadesAdicionadas(prev => prev.filter(atividade => atividade.idAtividade !== atividadeId));
        const atividadeDeletada = atividades.find(a => a.idAtividade == atividadeId);
        const listaAtividades = await listarAtividades()
        listaAtividades.forEach(atv => {
            if (atv.idAtividade == atividadeId) {
                nulaId(atv);
            }
        })
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

    const atividadeEstaConcluida = async (atividadeKanban) => {

        console.log("Atividade KAnben: " + atividadeKanban)
        if (atividadeKanban.coluna == 3) {
            console.log("if funcionando")
            const atividade = atividadeKanban;
            const novoStatus = 1;
            console.log("Atividade: "+atividade)
            try {
                await atualizarAtividade(atividade.idAtividade, {
                    nomeAtividade: atividade.nomeAtividade,
                    descricaoAtividade: atividade.descricaoAtividade,
                    prazoAtividade: formatarDataMySQL(atividade.prazoAtividade),
                    dataConclusao: capturaData(),
                    statusAtividade: novoStatus,
                    Pomodorostatus: atividade.Pomodorostatus,
                    Kanban_idAtividadeKanban: atividade.Kanban_idAtividadeKanban,
                    Eisenhower_idAtividadeEisenhower: atividade.Eisenhower_idAtividadeEisenhower,
                    ListaAtividades_idLista: atividade.ListaAtividades_idLista
                });
                
            } catch (err) {
                console.error('Erro ao atualizar atividade:', err);
                setAtividades(atividades);
                if (atividadeSelecionada?.idAtividade === atividade.idAtividade) {
                    setAtividadeSelecionada(atividade);
                }
            }
        } else if (atividadeKanban.statusAtividade == 1 && atividadeKanban.coluna !== 3){

            console.log("Else if funcionando")
            const atividade = atividadeKanban;
            const novoStatus = 0;
            try {
                await atualizarAtividade(atividade.idAtividade, {
                    nomeAtividade: atividade.nomeAtividade,
                    descricaoAtividade: atividade.descricaoAtividade,
                    prazoAtividade: formatarDataMySQL(atividade.prazoAtividade),
                    dataConclusao: capturaData(),
                    statusAtividade: novoStatus,
                    Pomodorostatus: atividade.Pomodorostatus,
                    Kanban_idAtividadeKanban: atividade.Kanban_idAtividadeKanban,
                    Eisenhower_idAtividadeEisenhower: atividade.Eisenhower_idAtividadeEisenhower,
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
        return;

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

            console.log("Atividade KAnben: " + atividadeAtualizada.Kanban_idAtividadeKanban)

            atualizaKanban(atividadeAtualizada.Kanban_idAtividadeKanban, atividadeAtualizada.coluna, capturaData());
            atividadeEstaConcluida(atividadeAtualizada);

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
            atividadeEstaConcluida(atividadeAtualizada);
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
                            arrow_back
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
                            arrow_back
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
                    <PainelTarefas>{atividades.filter(atividade => atividade.coluna == 1).map(atividade => (
                        <BoxTarefa key={atividade.idAtividade} id={atividade.idAtividade}>
                            <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa>
                            {renderIcons(atividade.coluna, atividade.idAtividade)}
                        </BoxTarefa>
                    ))}</PainelTarefas>

                    <BoxAdicionar onClick={handleClick(1)} id="Adicionar">Adicionar atividade</BoxAdicionar></Painel>
                <Painel id='2'><BoxTitulo>Fazendo</BoxTitulo>
                    <PainelTarefas>{atividades.filter(atividade => atividade.coluna == 2).map(atividade => (
                        <BoxTarefa key={atividade.idAtividade} id={atividade.idAtividade}>
                            <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa>
                            {renderIcons(atividade.coluna, atividade.idAtividade)}
                        </BoxTarefa>
                    ))}</PainelTarefas>
                    <BoxAdicionar onClick={handleClick(2)} id="Adicionar">Adicionar atividade</BoxAdicionar>
                </Painel>
                <Painel id='3'><BoxTitulo>Feito</BoxTitulo>
                    <PainelTarefas>{atividades.filter(atividade => atividade.coluna == 3).map(atividade => (
                        <BoxTarefa key={atividade.idAtividade} id={atividade.idAtividade}>
                            <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa>
                            {renderIcons(atividade.coluna, atividade.idAtividade)}
                        </BoxTarefa>
                    ))}</PainelTarefas>
                    <BoxAdicionar onClick={handleClick(3)} id="Adicionar">Adicionar atividade</BoxAdicionar>
                </Painel>
            </Container >
            {mostrarModal && <ModalTecnicas onClose={handleFecharModal} onAdicionar={adicionarAtividade} onTecnica={"kanban"} />
            }

        </>
    )
}

export default Kanban;