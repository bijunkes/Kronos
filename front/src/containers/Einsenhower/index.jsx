
import React, { useState } from "react";
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
    Icones
} from "./style.js"
import ModalTecnicas from "../ModalTecnicas/index.jsx";
import { showOkToast } from "../../components/showToast.jsx";


function Eisenhower() {

    const [mostrarModal, setMostrarModal] = useState(false)
    const [atividades, setAtividades] = useState([])
    const [atividadesAdicionadas, setAtividadesAdicionadas] = useState([])


    const [quadranteSelecionado, setQuadranteSelecionado] = useState(null);

    const handleClick = (quadranteId) => {
        setQuadranteSelecionado(quadranteId);
        setMostrarModal(true);
    };

    const handleFecharModal = () => {
        setMostrarModal(false);
    }
    const proximo = (id) => {
        setAtividades(prev =>
            prev.map(t =>
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
        );
    };

    const anterior = (id) => {
        setAtividades(prev =>
            prev.map(t =>
                t.idAtividade === id
                    ? {
                        ...t,
                        quadrante:
                            t.quadrante === 2 ? 1 :
                                t.quadrante === 4 ? 3 :
                                    t.quadrante
                    }
                    : t
            )
        );
    };

    const abaixo = (id) => {
        setAtividades(prev =>
            prev.map(t =>
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
        );
    };

    const acima = (id) => {
        setAtividades(prev =>
            prev.map(t =>
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
        );
    };
    const verificaAtividadeEmLista = (atividadeId) => {

        return atividadesAdicionadas.some((atividade) => atividade.idAtividade === atividadeId)

    }


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

    const adicionarAtividade = (atividade) => {
        if (verificaAtividadeEmLista(atividade.idAtividade)) {
            showOkToast("Atividade já inserida na matriz!", "error");
            setMostrarModal(false);
            return;
        }

        const novaAtividade = { ...atividade, quadrante: quadranteSelecionado, nome: atividade.nomeAtividade };


        setAtividades((prev) => [...prev, novaAtividade]);
        setAtividadesAdicionadas((prev) => [...prev, novaAtividade]);

        setMostrarModal(false);
    };


    return (
        <>
            <Container>

                <ImportanteUrgente><Lista id="1">{atividades
                    .filter((a) => a.quadrante === 1)
                    .map(
                        (atividade) =>
                            
                                <Atividade key={atividade.idAtividade}>
                                    {atividade.nome}

                                    {renderIcons(`icones${atividade.quadrante}`, atividade.idAtividade)}
                                </Atividade>
                    )}</Lista> <AdicionarTarefa onClick={() => handleClick(1)} id="Adicionar">Adicionar Tarefa</AdicionarTarefa></ImportanteUrgente>
                <ImportanteNaoUrgente>
                    <Lista id="2">{atividades
                        .filter((a) => a.quadrante === 2)
                        .map(
                            (atividade) =>
                                 
                                    <Atividade key={atividade.idAtividade}>
                                        {atividade.nome}

                                        {renderIcons(`icones${atividade.quadrante}`, atividade.idAtividade)}
                                    </Atividade>
                        )}</Lista> <AdicionarTarefa onClick={() => handleClick(2)} id="Adicionar">Adicionar Tarefa</AdicionarTarefa>
                </ImportanteNaoUrgente>

                <NaoImportanteUrgente>
                    <Lista id="3">{atividades
                        .filter((a) => a.quadrante === 3)
                        .map(
                            (atividade) =>
                                 
                                    <Atividade key={atividade.idAtividade}>
                                        {atividade.nome}

                                        {renderIcons(`icones${atividade.quadrante}`, atividade.idAtividade)}
                                    </Atividade>
                        )}</Lista> <AdicionarTarefa onClick={() => handleClick(3)} id="Adicionar">Adicionar Tarefa</AdicionarTarefa>
                </NaoImportanteUrgente>
                <NaoImportanteNaoUrgente>
                    <Lista id="4">{atividades
                        .filter((a) => a.quadrante === 4)
                        .map(
                            (atividade) =>
                               
                                    <Atividade key={atividade.idAtividade}>
                                        {atividade.nome}

                                        {renderIcons(`icones${atividade.quadrante}`, atividade.idAtividade)}
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