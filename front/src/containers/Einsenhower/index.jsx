
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


function Eisenhower() {

    const frutas = ["Laranja", "Maçã", "Morango", "Mirtilo", "Manga", "Maracujá", "Kiwi", "Pitaya","Pitanga", "Guaraná", "Tangerina"];
    const matriz = () => {

        return(
        <Container>
    
            <ImportanteUrgente><Lista>{frutas.map((fruta) => <Atividade>{ fruta }</Atividade>)}</Lista> <AdicionarTarefa>Adicionar Tarefa</AdicionarTarefa></ImportanteUrgente>
            <ImportanteNaoUrgente/>
        
            <NaoImportanteUrgente/>
            <NaoImportanteNaoUrgente/>
        
            <LabelImportante>Importante</LabelImportante>
            <LabelNaoImportante>Não Importante</LabelNaoImportante>
            <LabelUrgente>Urgente</LabelUrgente>
            <LabelNaoUrgente>Não Urgente</LabelNaoUrgente>
        
        
        </Container>);

    }
    return(
       
        matriz()

    );
    
}

export default Eisenhower;