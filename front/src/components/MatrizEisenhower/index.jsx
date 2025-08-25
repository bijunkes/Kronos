import React, { useState } from "react";
import {NaoImportanteUrgente,
 NaoImportanteNaoUrgente,
 ImportanteNaoUrgente,
 ImportanteUrgente,
 Fundo
} from './style';

function MatrizEisenhower(){

    var lista = []

    const handleEdit = (e) => {

        
    }
    return(

        <Fundo>

        <ImportanteUrgente></ImportanteUrgente>
        <ImportanteNaoUrgente></ImportanteNaoUrgente>
        <NaoImportanteUrgente></NaoImportanteUrgente>
        <NaoImportanteNaoUrgente></NaoImportanteNaoUrgente>
        
        </Fundo>

    );

}

export default MatrizEisenhower;