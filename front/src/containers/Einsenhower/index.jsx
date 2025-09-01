
import React, { useState } from "react";
import {Container,
 NaoImportanteUrgente,
 NaoImportanteNaoUrgente,
 ImportanteNaoUrgente,
 ImportanteUrgente,
 LabelImportante,
 LabelNaoImportante,
 LabelUrgente,
 LabelNaoUrgente
} from "./style.js"


function Eisenhower() {

    const matriz = () => {

        return(
        <Container>
    
            <ImportanteUrgente/>
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