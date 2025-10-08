import {React, useState} from 'react';
import {Container,Painel, BoxTitulo, BoxTarefas, NomeTarefa, Icones, BoxAdicionar} from './style.js';
import ModalTecnicas from "../ModalTecnicas/index.jsx";


function Kanban() {
     
    const [mostrarModal, setMostrarModal] = useState(false)
    const [atividades, setAtividades] = useState([
        
    ])
    const [atividadesAdicionadas, setAtividadesAdicionadas] = useState([])
    const [colunaSelecionada, setColunaSelecionada] = useState(null);

    const handleClick = (colunaId) => () => {
        setColunaSelecionada(colunaId);
        setMostrarModal(true);
    }
    const handleFecharModal = () => {
        setMostrarModal(false);
    }

    const verificaAtividadeEmLista = (atividadeId) => {

        return atividadesAdicionadas.some((atividade) => atividade.idAtividade === atividadeId)

    }
    
                    
    const deletar =  (atividadeId) => {

        setAtividades((prev) => [...prev, atividades.filter(atividade => atividade.id === atividadeId)]);
        setAtividadesAdicionadas((prev) => [...prev, atividadesAdicionadas.filter(atividade => atividade.id === atividadeId)]);
        
    }
    const proximo =  (atividadeId) => {

     setAtividades((prevTarefas) => 
            prevTarefas.map(atividade => 
                atividade.id === atividadeId 
                    ? { 
                        ...atividade, 
                        coluna: atividade.coluna < 3 ? atividade.coluna + 1 : 3, 
                        icons: atividade.coluna === 2 ? 'icones3' : 'icones2' 
                        
                    } 
                    : atividade,
                    console.log("teste")
            )
        );

    }
    const anterior =  (atividadeId) => {

     setAtividades((prevTarefas) => 
            prevTarefas.map(atividade => 
                atividade.id === atividadeId 
                    ? { 
                        ...atividade, 
                        coluna: atividade.coluna > 1 ? atividade.coluna - 1 : 1, 
                        icons: atividade.coluna === 2 ? 'icones1' :'icones2' 
                        
                    } 
                    : atividade,
                    console.log("teste")
            )
        );

    }
    const renderIcons = (coluna, atividadeId) => {
    switch (coluna) {
        case 1:
            return (
                <>
                    <Icones className="material-symbols-outlined" onClick={() => deletar(atividadeId)}>
                        delete
                    </Icones>
                    <Icones className="material-symbols-outlined" onClick={() => proximo(atividadeId)}>
                        arrow_forward
                    </Icones>
                </>
            );
        case 2:
            return (
                <>
                    <Icones className="material-symbols-outlined" onClick={() => deletar(atividadeId)}>
                        delete
                    </Icones>
                    <Icones className="material-symbols-outlined" onClick={() => anterior(atividadeId)}>
                        arrow_left_alt
                    </Icones>
                    <Icones className="material-symbols-outlined" onClick={() => proximo(atividadeId)}>
                        arrow_forward
                    </Icones>
                </>
            );
        case 3:
            return (
                <>
                    <Icones className="material-symbols-outlined" onClick={() => deletar(atividadeId)}>
                        delete
                    </Icones>
                    <Icones className="material-symbols-outlined" onClick={() => anterior(atividadeId)}>
                        arrow_left_alt
                    </Icones>
                </>
            );
        default:
            return null;
    }
};

    const adicionarAtividade = (atividade) => {
            if (verificaAtividadeEmLista(atividade.idAtividade)) {
                showOkToast("Atividade já inserida no Kanban!", "error");
                setMostrarModal(false);
                return;
            }
    
            const novaAtividade = { ...atividade, coluna: colunaSelecionada, nome: atividade.nomeAtividade, id: atividade.idAtividade};
    
    
            setAtividades((prev) => [...prev, novaAtividade]);
            setAtividadesAdicionadas((prev) => [...prev, novaAtividade]);
    
            setMostrarModal(false);
        };

    return(
        <>
            <Container>
                <Painel id='1'>
                    <BoxTitulo>A Fazer</BoxTitulo>
                    {atividades.filter(atividade => atividade.coluna === 1).map(atividade => (
                        <BoxTarefas key={atividade.id} id={atividade.id}>
                            <NomeTarefa>{atividade.nome}</NomeTarefa>
                            {renderIcons(atividade.coluna, atividade.idAtividade)}
                        </BoxTarefas>
                    ))}
                    <BoxAdicionar onClick={handleClick(1)} id="Adicionar">Adicionar Tarefa</BoxAdicionar></Painel>
                <Painel id='2'><BoxTitulo>Fazendo</BoxTitulo>
                {atividades.filter(atividade => atividade.coluna === 2).map(atividade => (
                        <BoxTarefas key={atividade.id} id={atividade.id}>
                            <NomeTarefa>{atividade.nome}</NomeTarefa>
                            {renderIcons(atividade.coluna, atividade.idAtividade)}
                        </BoxTarefas>
                    ))}
                    <BoxAdicionar onClick={handleClick(2)} id="Adicionar">Adicionar Tarefa</BoxAdicionar>
                </Painel>
                <Painel id='3'><BoxTitulo>Feito</BoxTitulo>
                {atividades.filter(atividade => atividade.coluna === 3).map(atividade => (
                        <BoxTarefas key={atividade.id} id={atividade.id}>
                            <NomeTarefa>{atividade.nome}</NomeTarefa>
                            {renderIcons(atividade.coluna, atividade.idAtividade)}
                        </BoxTarefas>
                    ))}
                    <BoxAdicionar onClick={handleClick(3)} id="Adicionar">Adicionar Tarefa</BoxAdicionar>
                </Painel>
            </Container>
            {mostrarModal && <ModalTecnicas onClose={handleFecharModal} onAdicionar={adicionarAtividade}/>}
            
        </>
    )
}

export default Kanban;