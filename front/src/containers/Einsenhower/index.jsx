
import React, { useState, useEffect } from "react";
import {
    Container,
    NaoImportanteUrgente,
    NaoImportanteNaoUrgente,
    ImportanteNaoUrgente,
    ImportanteUrgente,
    LabelImportante,
    LabelNaoImportante,
    LabelUrgente,
    LabelNaoUrgente,
    Atividade,
    Lista,
    AdicionarTarefa,
    Icones,
    BoxIcones,
    BoxNomeTarefa
} from "./style.js"
import { adicionarAtividadeEmMatriz, atualizarAtividadeEmMatriz, listarAtividadesEmMatriz, listarAtividades, atualizarIdEisenAtividade, deletarAtividadeDeMatriz } from "../../services/api.js";
import ModalTecnicas from "../ModalTecnicas/index.jsx";
import { showOkToast } from "../../components/showToast.jsx";


function Eisenhower() {

    const [mostrarModal, setMostrarModal] = useState(false);
    const [atividades, setAtividades] = useState([]);
    const [atividadesAdicionadas, setAtividadesAdicionadas] = useState([]);
    const [quadranteSelecionado, setQuadranteSelecionado] = useState(null);
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
            const todasAtividadesEmMatriz = await listarAtividadesEmMatriz();

            const todasAtividades = await listarAtividades();
            console.log(todasAtividadesEmMatriz);
            const matrizMap = new Map();
            todasAtividadesEmMatriz.forEach(item => {
                matrizMap.set(item.idAtividadeEisenhower, item.classificacao)
            })
            const atividadesEmMatriz = todasAtividades.filter(atv => matrizMap.has(atv.Eisenhower_idAtividadeEisenhower)).map(atv => ({
                ...atv,
                quadrante: parseInt(matrizMap.get(atv.Eisenhower_idAtividadeEisenhower)),
                nome: atv.nomeAtividade,
            }))
            setAtividades(atividadesEmMatriz);
            setAtividadesAdicionadas(atividadesEmMatriz);

            console.log("todasAtividades:", todasAtividades);
            console.log("todasAtividadesEmMatriz:", todasAtividadesEmMatriz);
            console.log("AtividadesEmMatriz:", atividadesEmMatriz);

            console.log(atividadesEmMatriz);
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

    const handleClick = (quadranteId) => {
        setQuadranteSelecionado(quadranteId);
        setMostrarModal(true);
    };

    const handleFecharModal = () => {
        setMostrarModal(false);
    }
    const proximo = async (id) => {
        setAtividades(prev => {
            const novaLista = prev.map(t =>
                t.idAtividade === id
                    ? {
                        ...t,
                        quadrante:
                            t.quadrante === 1 ? 2 :
                                t.quadrante === 3 ? 4 :
                                    t.quadrante
                    }
                    : t
            )
            const atividadeAtualizada = novaLista.find(t => t.idAtividade === id);


            atualizaMatriz(atividadeAtualizada.Eisenhower_idAtividadeEisenhower, atividadeAtualizada.quadrante, capturaData());

            return novaLista;
        })
    };

    const anterior = async (id) => {
        setAtividades(prev => {
            const novaLista = prev.map(t =>
                t.idAtividade=== id
                    ? {
                        ...t,
                        quadrante:
                            t.quadrante === 2 ? 1 :
                                t.quadrante === 4 ? 3 :
                                    t.quadrante

                    }
                    : t

            )
            const atividadeAtualizada = novaLista.find(t => t.idAtividade === id);


            atualizaMatriz(atividadeAtualizada.Eisenhower_idAtividadeEisenhower, atividadeAtualizada.quadrante, capturaData());

            return novaLista;
        })
    };

    const abaixo = async (id) => {
        setAtividades (prev => {
            const novaLista = prev.map(t =>
                t.idAtividade === id
                    ? {
                        ...t,
                        quadrante:
                            t.quadrante === 1 ? 3 :
                                t.quadrante === 2 ? 4 :
                                    t.quadrante
                    }
                    : t
            )
            const atividadeAtualizada = novaLista.find(t => t.idAtividade === id);


           atualizaMatriz(atividadeAtualizada.Eisenhower_idAtividadeEisenhower, atividadeAtualizada.quadrante, capturaData());

            return novaLista;
        })
    };

    const acima = async (id) => {
        setAtividades(prev => {
            const novaLista = prev.map(t =>
                t.idAtividade === id
                    ? {
                        ...t,
                        quadrante:
                            t.quadrante === 3 ? 1 :
                                t.quadrante === 4 ? 2 :
                                    t.quadrante
                    }
                    : t
            )
            const atividadeAtualizada = novaLista.find(t => t.idAtividade=== id);

            atualizaMatriz(atividadeAtualizada.Eisenhower_idAtividadeEisenhower, atividadeAtualizada.quadrante, capturaData());
            
             return novaLista;
           
        })
        
    };

    const atualizaMatriz = async (id, classificacao, dataAlteracao) => {
        console.log(`id: ${id}; classificação: ${classificacao}`)
        await atualizarAtividadeEmMatriz(id, classificacao, dataAlteracao);
        
    }

    const verificaAtividadeEmLista = (atividadeId) => {

        return atividadesAdicionadas.some((atividade) => atividade.idAtividade === atividadeId)

    }
    const deletar = async (atividadeId) => {
        setAtividades(prev => prev.filter(atividade => atividade.idAtividade !== atividadeId));
        setAtividadesAdicionadas(prev => prev.filter(atividade => atividade.idAtividade !== atividadeId));
        const atividadeDeletada = atividades.find(a => a.idAtividade == atividadeId);
        console.log(atividadeDeletada.Eisenhower_idAtividadeEisenhower);
        await deletarAtividadeDeMatriz(atividadeDeletada.Eisenhower_idAtividadeEisenhower);

    };


    const renderIcons = (iconsType, atividadeId) => {
        if (iconsType === 'icones1') {
            return (
                <>
                    <Icones className="material-symbols-outlined" onClick={() => deletar(atividadeId)}>delete</Icones>
                    <Icones className="material-symbols-outlined" onClick={() => abaixo(atividadeId)}>arrow_downward</Icones>
                    <Icones className="material-symbols-outlined" onClick={() => proximo(atividadeId)}>arrow_right_alt</Icones>
                </>
            );
        } else if (iconsType === 'icones2') {
            return (
                <>
                    <Icones className="material-symbols-outlined" onClick={() => deletar(atividadeId)}>delete</Icones>
                    <Icones className="material-symbols-outlined" onClick={() => anterior(atividadeId)}>arrow_left_alt</Icones>
                    <Icones className="material-symbols-outlined" onClick={() => abaixo(atividadeId)}>arrow_downward</Icones>
                </>
            );
        } else if (iconsType === 'icones3') {
            return (
                <>
                    <Icones className="material-symbols-outlined" onClick={() => deletar(atividadeId)}>delete</Icones>
                    <Icones className="material-symbols-outlined" onClick={() => acima(atividadeId)}>arrow_upward</Icones>
                    <Icones className="material-symbols-outlined" onClick={() => proximo(atividadeId)}>arrow_right_alt</Icones>
                </>
            );
        } else if (iconsType === 'icones4') {
            return (
                <>
                    <Icones className="material-symbols-outlined" onClick={() => deletar(atividadeId)}>delete</Icones>
                    <Icones className="material-symbols-outlined" onClick={() => anterior(atividadeId)}>arrow_left_alt</Icones>
                    <Icones className="material-symbols-outlined" onClick={() => acima(atividadeId)}>arrow_upward</Icones>
                </>
            );
        }
        return null;
    };

    const adicionarAtividade = async (atividade) => {
        if (verificaAtividadeEmLista(atividade.idAtividade)) {
            showOkToast("Atividade já inserida na matriz!", "error");
            setMostrarModal(false);
            return;
        }


        try {

            const res = await adicionarAtividadeEmMatriz({
                classificacao: quadranteSelecionado,
                dataAlteracao: capturaData()
            });
            const idEisen = res.idAtividadeEisenhower;

            const novaAtividade = { ...atividade, quadrante: quadranteSelecionado, nome: atividade.nomeAtividade, Eisenhower_idAtividadeEisenhower: idEisen, Usuarios_username: atividade.Usuarios_username, dataAlteracao: capturaData()};
            console.log(novaAtividade);
            await atualizarIdEisenAtividade(novaAtividade.idAtividade, {
                Eisenhower_idAtividadeEisenhower: novaAtividade.Eisenhower_idAtividadeEisenhower,
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
                {carregando && <p>Carregando...</p>}
                {erro && <p style={{ color: 'red' }}>{erro}</p>}
                <ImportanteUrgente><Lista id="1">{atividades
                    .filter((a) => a.quadrante === 1)
                    .map(
                        (atividade) =>

                            <Atividade key={atividade.idAtividade}>
                                <BoxNomeTarefa>{atividade.nome|| atividade.nomeAtividade}</BoxNomeTarefa>
                                <BoxIcones>{renderIcons(`icones${atividade.quadrante}`, atividade.idAtividade)}</BoxIcones>
                                
                            </Atividade>
                    )}</Lista> <AdicionarTarefa onClick={() => handleClick(1)} id="Adicionar">Adicionar Tarefa</AdicionarTarefa></ImportanteUrgente>

                <ImportanteNaoUrgente>
                    <Lista id="2">{atividades
                        .filter((a) => a.quadrante === 2)
                        .map(
                            (atividade) =>

                                <Atividade key={atividade.idAtividade}>
                                    <BoxNomeTarefa>{atividade.nome|| atividade.nomeAtividade}</BoxNomeTarefa>
                                    <BoxIcones>{renderIcons(`icones${atividade.quadrante}`, atividade.idAtividade)}</BoxIcones>
                                </Atividade>
                        )}</Lista> <AdicionarTarefa onClick={() => handleClick(2)} id="Adicionar">Adicionar Tarefa</AdicionarTarefa>
                </ImportanteNaoUrgente>

                <NaoImportanteUrgente>
                    <Lista id="3">{atividades
                        .filter((a) => a.quadrante === 3)
                        .map(
                            (atividade) =>

                                <Atividade key={atividade.idAtividade}>
                                    <BoxNomeTarefa>{atividade.nome|| atividade.nomeAtividade}</BoxNomeTarefa>
                                    <BoxIcones>{renderIcons(`icones${atividade.quadrante}`, atividade.idAtividade)}</BoxIcones>
                                </Atividade>
                        )}</Lista> <AdicionarTarefa onClick={() => handleClick(3)} id="Adicionar">Adicionar Tarefa</AdicionarTarefa>
                </NaoImportanteUrgente>

                <NaoImportanteNaoUrgente>
                    <Lista id="4">{atividades
                        .filter((a) => a.quadrante === 4)
                        .map(
                            (atividade) =>

                                <Atividade key={atividade.idAtividade}>
                                    <BoxNomeTarefa>{atividade.nome|| atividade.nomeAtividade}</BoxNomeTarefa>
                                    <BoxIcones>{renderIcons(`icones${atividade.quadrante}`, atividade.idAtividade)}</BoxIcones>
                                </Atividade>
                        )}</Lista> <AdicionarTarefa onClick={() => handleClick(4)} id="Adicionar">Adicionar Tarefa</AdicionarTarefa>
                </NaoImportanteNaoUrgente>

                <LabelImportante>Importante</LabelImportante>
                <LabelNaoImportante>Não Importante</LabelNaoImportante>
                <LabelUrgente>Urgente</LabelUrgente>
                <LabelNaoUrgente>Não Urgente</LabelNaoUrgente>

                {mostrarModal && <ModalTecnicas onClose={handleFecharModal}
                    onAdicionar={adicionarAtividade}
                />}
            </Container>

        </>
    )


}

export default Eisenhower;