import {React, useState} from 'react';
import {Container,Painel, BoxTitulo, BoxTarefas, NomeTarefa, Icones, BoxAdicionar} from './style.js';


function Kanban() {
     
    const [tarefas, setTarefas] = useState([
        {id: 'tarefa1', nome: 'Tarefa 1', status: 1, icons: 'icones1'}
    ])
    
                    
    const deletar = (tarefaId) => {

        setTarefas((prevTarefas) => prevTarefas.filter(tarefa => tarefa.id !== tarefaId));
        
    }
    const proximo = (tarefaId) => {

        setTarefas((prevTarefas) => 
            prevTarefas.map(tarefa => 
                tarefa.id === tarefaId 
                    ? { 
                        ...tarefa, 
                        status: tarefa.status < 3 ? tarefa.status + 1 : 3, 
                        icons: tarefa.status === 2 ? 'icones3' : 'icones2' 
                        
                    } 
                    : tarefa,
                    console.log("teste")
            )
        );

    }
    const anterior = (tarefaId) => {

        setTarefas((prevTarefas) => 
            prevTarefas.map(tarefa => 
                tarefa.id === tarefaId 
                    ? { 
                        ...tarefa, 
                        status: tarefa.status > 1 ? tarefa.status - 1 : 1, 
                        icons: tarefa.status === 2 ? 'icones1' :'icones2' 
                        
                    } 
                    : tarefa,
                    console.log("teste")
            )
        );

    }
    const renderIcons = (iconsType, tarefaId) => {
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
    const adicionarTarefa = (campo) => {
        const novaTarefa = {
            id: `tarefa${tarefas.length + 1}`,
            nome: `Tarefa ${tarefas.length + 1}`,
            status: campo.parentNode.id, 
            icons: 'icones' + campo.parentNode.id
        };
        console.log("Adicionando nova tarefa:", novaTarefa);
        setTarefas([...tarefas, novaTarefa]);
    };

    return(
        <>
            <Container>
                <Painel id='1'>
                    <BoxTitulo>A Fazer</BoxTitulo>
                    {tarefas.filter(tarefa => tarefa.status == 1).map(tarefa => (
                        <BoxTarefas key={tarefa.id} id={tarefa.id}>
                            <NomeTarefa>{tarefa.nome}</NomeTarefa>
                            {renderIcons(tarefa.icons, tarefa.id)}
                        </BoxTarefas>
                    ))}
                    <BoxAdicionar onClick={(e) => {adicionarTarefa(e.target)}}>Adicionar Tarefa</BoxAdicionar></Painel>
                <Painel id='2'><BoxTitulo>Fazendo</BoxTitulo>
                {tarefas.filter(tarefa => tarefa.status == 2).map(tarefa => (
                        <BoxTarefas key={tarefa.id} id={tarefa.id}>
                            <NomeTarefa>{tarefa.nome}</NomeTarefa>
                            {renderIcons(tarefa.icons, tarefa.id)}
                        </BoxTarefas>
                    ))}
                    <BoxAdicionar onClick={(e) => {adicionarTarefa(e.target)}}>Adicionar Tarefa</BoxAdicionar>
                </Painel>
                <Painel id='3'><BoxTitulo>Feito</BoxTitulo>
                {tarefas.filter(tarefa => tarefa.status == 3).map(tarefa => (
                        <BoxTarefas key={tarefa.id} id={tarefa.id}>
                            <NomeTarefa>{tarefa.nome}</NomeTarefa>
                            {renderIcons(tarefa.icons, tarefa.id)}
                        </BoxTarefas>
                    ))}
                    <BoxAdicionar onClick={(e) => {adicionarTarefa(e.target)}}>Adicionar Tarefa</BoxAdicionar>
                </Painel>
            </Container>
            
        </>
    )
}

export default Kanban;