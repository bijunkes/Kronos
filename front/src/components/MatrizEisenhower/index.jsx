import React, { useState } from "react";
import {NaoImportanteUrgente,
 NaoImportanteNaoUrgente,
 ImportanteNaoUrgente,
 ImportanteUrgente
} from './style';

function MatrizEisenhower(){

    var lista = []

    const handleEdit = (e) => {

        
    }
    return(

        <div className="matrizeisenhower-component">
        <ImportanteUrgente></ImportanteUrgente>
        <ImportanteNaoUrgente></ImportanteNaoUrgente>
        <NaoImportanteUrgente></NaoImportanteUrgente>
        <NaoImportanteNaoUrgente></NaoImportanteNaoUrgente>
        
        </div>

    );

}

export default MatrizEisenhower;