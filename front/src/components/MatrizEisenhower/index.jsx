import React, { useState } from "react";
import {NaoImportanteUrgente,
 NaoImportanteNaoUrgente,
 ImportanteNaoUrgente,
 ImportanteUrgente,
 TextoVertical
} from './style';

function MatrizEisenhower(){

    var lista = []

    const handleEdit = (e) => {

        
    }
    return(

        <div>

        <TextoVertical>Importante</TextoVertical>
        <ImportanteUrgente></ImportanteUrgente>
        <ImportanteNaoUrgente></ImportanteNaoUrgente>
        <TextoVertical>Nâo Importante</TextoVertical>
        <NaoImportanteUrgente></NaoImportanteUrgente>
        <NaoImportanteNaoUrgente></NaoImportanteNaoUrgente>
        
        </div>

    );

}

export default MatrizEisenhower;