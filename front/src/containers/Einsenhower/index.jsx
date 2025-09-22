
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

    const renderIcons = (iconsType, tarefaId) => {
        if (iconsType === 'icones1') {
            return (
                <>
                    <Icones className="material-symbols-outlined" onClick={() => deletar(tarefaId)}>delete</Icones>
                    <Icones className="material-symbols-outlined" onClick={() => proximo(tarefaId)}>arrow_forward</Icones>
                </>
            );
        } else if (iconsType === 'icones2') {
            return (
                <>
                    <Icones className="material-symbols-outlined" onClick={() => deletar(tarefaId)}>delete</Icones>
                    <Icones className="material-symbols-outlined" onClick={() => anterior(tarefaId)}>arrow_left_alt</Icones>
                    <Icones className="material-symbols-outlined" onClick={() => proximo(tarefaId)}>arrow_forward</Icones>
                </>
            );
        } else if (iconsType === 'icones3') {
            return (
                <>
                    <Icones className="material-symbols-outlined" onClick={() => deletar(tarefaId)}>delete</Icones>
                    <Icones className="material-symbols-outlined" onClick={() => anterior(tarefaId)}>arrow_left_alt</Icones>
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
                            { ...atividade, quadrante: quadranteSelecionado }
                        ]);
                        setMostrarModal(false);
                    }} />}
            </Container>

        </>
    )


}

export default Eisenhower;