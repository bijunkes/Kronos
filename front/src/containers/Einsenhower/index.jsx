
import React, { useState } from "react";
import {Container,
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
    const [frutas] = useState([ 
        {nome: 'Laranja', icons: 'icones1', id: 1},
        {nome: 'Maçã', icons: 'icones2', id: 2}, 
        {nome: 'Morango', icons: 'icones3', id: 3}
    ])

    const handleClick = () => {
        setMostrarModal(true);
    }
    const handleFecharModal = () => {
        setMostrarModal(false);
    }

    const renderIcons = (iconsType, frutaId) => {
            if (iconsType === 'icones1') {
                return (
                    <>
                        <Icones className="material-symbols-outlined" onClick={()=> deletar(tarefaId)}>delete</Icones>
                        <Icones className="material-symbols-outlined" onClick={() => proximo(tarefaId)}>arrow_forward</Icones>
                    </>
                );
            } else if (iconsType === 'icones2') {
                return (
                    <>
                        <Icones className="material-symbols-outlined" onClick={()=> deletar(tarefaId)}>delete</Icones>
                        <Icones  className="material-symbols-outlined" onClick={()=> anterior(tarefaId)}>arrow_left_alt</Icones>
                        <Icones className="material-symbols-outlined" onClick={() => proximo(tarefaId)}>arrow_forward</Icones>
                    </>
                );
            }else if (iconsType === 'icones3') {
                return (
                    <>
                        <Icones className="material-symbols-outlined" onClick={()=> deletar(tarefaId)}>delete</Icones>
                        <Icones  className="material-symbols-outlined" onClick={()=> anterior(tarefaId)}>arrow_left_alt</Icones>
                    </>
                );
            }
            return null;
        };
    

    return(
        <>
        <Container>
    
            <ImportanteUrgente><Lista id="1">{frutas.filter(fruta => fruta.id == 1).map(fruta => (
                                     
                                        <Atividade key={fruta.id} id={fruta.id}>{ fruta.nome } {renderIcons(fruta.icons, fruta.id)}</Atividade>
                                        
                                    
                                ))}</Lista> <AdicionarTarefa onClick={handleClick} id="Adicionar">Adicionar Tarefa</AdicionarTarefa></ImportanteUrgente>
            <ImportanteNaoUrgente> 
                <Lista id="2">{frutas.filter(fruta => fruta.id == 2).map(fruta => (
                                     
                                        <Atividade key={fruta.id} id={fruta.id}>{ fruta.nome } {renderIcons(fruta.icons, fruta.id)}</Atividade>
                                        
                                    
                                ))}</Lista> <AdicionarTarefa onClick={handleClick} id="Adicionar">Adicionar Tarefa</AdicionarTarefa>
            </ImportanteNaoUrgente>
        
            <NaoImportanteUrgente>
                <Lista id="3">{frutas.filter(fruta => fruta.id == 3).map(fruta => (
                                     
                                        <Atividade key={fruta.id} id={fruta.id}>{ fruta.nome } {renderIcons(fruta.icons, fruta.id)}</Atividade>
                                        
                                    
                                ))}</Lista> <AdicionarTarefa onClick={handleClick} id="Adicionar">Adicionar Tarefa</AdicionarTarefa>
            </NaoImportanteUrgente>
            <NaoImportanteNaoUrgente></NaoImportanteNaoUrgente>
        
            <LabelImportante>Importante</LabelImportante>
            <LabelNaoImportante>Não Importante</LabelNaoImportante>
            <LabelUrgente>Urgente</LabelUrgente>
            <LabelNaoUrgente>Não Urgente</LabelNaoUrgente>
        
            {mostrarModal && <ModalTecnicas onClose={handleFecharModal}/>}
        </Container>
        
        </>
    )

    
}

export default Eisenhower;