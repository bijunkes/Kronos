
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
 AdicionarTarefa
} from "./style.js"
import ModalEisenhower from "../ModalEisenhower/index.jsx";


function Eisenhower() {

    const [mostrarModal, setMostrarModal] = useState(false)
    const frutas = ["Laranja", "Maçã", "Morango", "Mirtilo", "Manga", "Maracujá", "Kiwi", "Pitaya","Pitanga", "Guaraná", "Tangerina"];

    const handleClick = () => {
        setMostrarModal(true);
    }
    const handleFecharModal = () => {
        setMostrarModal(false);
    }
    

    return(
        <>
        <Container>
    
            <ImportanteUrgente><Lista>{frutas.map((fruta) => <Atividade>{ fruta }</Atividade>)}</Lista> <AdicionarTarefa onClick={handleClick} id="Adicionar">Adicionar Tarefa</AdicionarTarefa></ImportanteUrgente>
            <ImportanteNaoUrgente/>
        
            <NaoImportanteUrgente/>
            <NaoImportanteNaoUrgente/>
        
            <LabelImportante>Importante</LabelImportante>
            <LabelNaoImportante>Não Importante</LabelNaoImportante>
            <LabelUrgente>Urgente</LabelUrgente>
            <LabelNaoUrgente>Não Urgente</LabelNaoUrgente>
        
        
        </Container>
        {mostrarModal && <ModalEisenhower onClose={handleFecharModal}/>}
        </>
    )

    
}

export default Eisenhower;