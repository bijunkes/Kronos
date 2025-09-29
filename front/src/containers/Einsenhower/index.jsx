
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


function Eisenhower() {

    const [mostrarModal, setMostrarModal] = useState(false)
    const [atividades, setAtividades] = useState([])


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
                    t.id === id
                        ? { ...t, quadrante: t.quadrante === 1 ? 2 : 3 } // Q1→Q2, Q3→Q4
                        : t
                )
            );
        };
    
        const anterior = (id) => {
            setAtividades(prev =>
                prev.map(t =>
                    t.id === id
                        ? { ...t, quadrante: t.quadrante === 2 ? 1 : 4 } // Q2→Q1, Q4→Q3
                        : t
                )
            );
        };
    
        const abaixo = (id) => {
            setAtividades(prev =>
                prev.map(t =>
                    t.id === id
                        ? { ...t, quadrante: t.quadrante === 1 ? 3 : 2 } // Q1→Q3, Q2→Q4
                        : t
                )
            );
        };
    
        const acima = (id) => {
            setAtividades(prev =>
                prev.map(t =>
                    t.id === id
                        ? { ...t, quadrante: t.quadrante === 3 ? 1 : 4 } // Q3→Q1, Q4→Q2
                        : t
                )
            );
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

    
    return (
        <>
            <Container>

                <ImportanteUrgente><Lista id="1">{atividades
                    .filter((a) => a.quadrante === 1)
                    .map((atividade) => (
                        
                        <Atividade key={atividade.id}>
                            {atividade.nome}
                            
                            {renderIcons(atividade.icons, atividade.id)}
                        </Atividade>
                    ))}</Lista> <AdicionarTarefa onClick={() => handleClick(1)} id="Adicionar">Adicionar Tarefa</AdicionarTarefa></ImportanteUrgente>
                <ImportanteNaoUrgente>
                    <Lista id="2">{atividades
                        .filter((a) => a.quadrante === 2)
                        .map((atividade) => (
                            <Atividade key={atividade.id}>
                                {atividade.nome}
                                {renderIcons(atividade.icons, atividade.id)}
                            </Atividade>
                        ))}</Lista> <AdicionarTarefa onClick={() => handleClick(2)} id="Adicionar">Adicionar Tarefa</AdicionarTarefa>
                </ImportanteNaoUrgente>

                <NaoImportanteUrgente>
                    <Lista id="3">{atividades
                        .filter((a) => a.quadrante === 3)
                        .map((atividade) => (
                            <Atividade key={atividade.id}>
                                {atividade.nome}
                                {renderIcons(atividade.icons, atividade.id)}
                            </Atividade>
                        ))}</Lista> <AdicionarTarefa onClick={() => handleClick(3)} id="Adicionar">Adicionar Tarefa</AdicionarTarefa>
                </NaoImportanteUrgente>
                <NaoImportanteNaoUrgente>
                    <Lista id="4">{atividades
                        .filter((a) => a.quadrante === 4)
                        .map((atividade) => (
                            <Atividade key={atividade.id}>
                                {atividade.nome}
                                {renderIcons(atividade.icons, atividade.id)}
                            </Atividade>
                        ))}</Lista> <AdicionarTarefa onClick={() => handleClick(4)} id="Adicionar">Adicionar Tarefa</AdicionarTarefa>
                </NaoImportanteNaoUrgente>

                <LabelImportante>Importante</LabelImportante>
                <LabelNaoImportante>Não Importante</LabelNaoImportante>
                <LabelUrgente>Urgente</LabelUrgente>
                <LabelNaoUrgente>Não Urgente</LabelNaoUrgente>

                {mostrarModal && <ModalTecnicas onClose={handleFecharModal}
                    onAdicionar={(atividade) => {
                        setAtividades((prev) => [
                            ...prev,
                            { ...atividade, quadrante: quadranteSelecionado, icons:"icones"+quadranteSelecionado }
                        ]);
                        setMostrarModal(false);
                    }} />}
            </Container>

        </>
    )


}

export default Eisenhower;