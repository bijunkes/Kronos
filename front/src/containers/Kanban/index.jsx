import {React, useState} from 'react';
import {Container,Painel, BoxTitulo, BoxTarefas, NomeTarefa, Icones} from './style.js';


function Kanban() {
     
    
    const deletar = () => {

        console.log("Deletando")
        
    }
    return(
        <>
            <Container>
                <Painel id='AFazer'>
                    <BoxTitulo>A Fazer</BoxTitulo>
                    <BoxTarefas><NomeTarefa>Tarefa 1</NomeTarefa>
                        <Icones className="material-symbols-outlined" onClick={deletar}>delete</Icones>
                    </BoxTarefas></Painel>
                <Painel id='Fazendo'><BoxTitulo>Fazendo</BoxTitulo></Painel>
                <Painel id='Feito'><BoxTitulo>Feito</BoxTitulo></Painel>
            </Container>
            
        </>
    )
}

export default Kanban;