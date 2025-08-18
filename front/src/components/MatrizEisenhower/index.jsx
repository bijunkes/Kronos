import React, { useState } from "react";

function MatrizEisenhower(){

    var lista = []

    const handleEdit = (e) => {

        
    }
    return(

        <>
        <div className="ImportanteUrgente">
            <ul>
                {lista.map((lista,index) => <li key= {index}>{lista}</li>)}
            </ul>
            <button onClick={handleEdit}>Adicionar Tarefa</button>
        </div>
        <div className="ImportanteNaoUrgente">
            <ul>
                {lista.map((lista,index) => <li key= {index}>{lista}</li>)}
            </ul>
            <button onClick={handleEdit}>Adicionar Tarefa</button>
        </div>
        <div className="NaoImportanteUrgente">
            <ul>
                {lista.map((lista,index) => <li key= {index}>{lista}</li>)}
            </ul>
            <button onClick={handleEdit}>Adicionar Tarefa</button>
        </div>
        <div className="NaoImportanteNaoUrgente">
            <ul>
                {lista.map((lista,index) => <li key= {index}>{lista}</li>)}
            </ul>
            <button onClick={handleEdit}>Adicionar Tarefa</button>
        </div>
        </>

    );

}

export default MatrizEisenhower;