import {React, useState} from 'react';
import {Container,Painel, BoxTitulo, BoxTarefas, NomeTarefa, Icones, BoxAdicionar} from './style.js';
import ModalTecnicas from "../ModalTecnicas/index.jsx";


function Kanban() {
     
    const [mostrarModal, setMostrarModal] = useState(false)
    const [atividades, setAtividades] = useState([
        
    ])
    const [atividadesAdicionadas, setAtividadesAdicionadas] = useState([])
    const [colunaSelecionada, setColunaSelecionada] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    const buscarAtividades = async () => {
    
            try {
                const todasAtividadesEmKanban = await listarAtividadesEmKanban();
    
                const todasAtividades = await listarAtividades();
                console.log(todasAtividadesEmKanban);
                const matrizMap = new Map();
                todasAtividadesEmKanban.forEach(item => {
                    matrizMap.set(item.idAtividadeKanban, item.classificacao)
                })
                const atividadesEmKanban = todasAtividades.filter(atv => matrizMap.has(atv.Kanban_idAtividadeKanban)).map(atv => ({
                    ...atv,
                    coluna: parseInt(matrizMap.get(atv.Kanban_idAtividadeKanban)),
                    nome: atv.nomeAtividade,
                }))
                setAtividades(atividadesEmKanban);
                setAtividadesAdicionadas(atividadesEmKanban);
    
                console.log("todasAtividades:", todasAtividades);
                console.log("todasAtividadesEmMatriz:", todasAtividadesEmKanban);
                console.log("AtividadesEmMatriz:", atividadesEmKanban);
    
                console.log(atividadesEmKanban);
            } catch (err) {
                console.error('Erro ao carregar todas as atividades', err);
                setErro('Erro ao carregar as atividades.');
            } finally {
                setCarregando(false);
            }
        };
    
         useEffect(() => {
                buscarAtividades();
            }, []);

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
    
                    
    const deletar =  async (atividadeId) => {

        setAtividades((prev) => [...prev, atividades.filter(atividade => atividade.id === atividadeId)]);
        setAtividadesAdicionadas((prev) => [...prev, atividadesAdicionadas.filter(atividade => atividade.id === atividadeId)]);
        const atividadeDeletada = atividades.find(a => a.idAtividade == atividadeId);
                console.log(atividadeDeletada.Kanban_idAtividadeKanban);
                await deletarAtividadeDeKanban(atividadeDeletada.Kanban_idAtividadeKanban);
        
    }
    const proximo =  (atividadeId) => {

     setAtividades((prevTarefas) => {
            const novaLista = prevTarefas.map(atividade => 
                atividade.id === atividadeId 
                    ? { 
                        ...atividade, 
                        coluna: atividade.coluna < 3 ? atividade.coluna + 1 : 3, 
                        icons: atividade.coluna === 2 ? 'icones3' : 'icones2' 
                        
                    } 
                    : atividade,
                    console.log("teste")
            )
            const atividadeAtualizada = novaLista.find(t => t.idAtividade === id);


            atualizaKanban(atividadeAtualizada.Kanban_idAtividadeKanban, atividadeAtualizada.coluna);

            return novaLista;
    });

    }
    const anterior =  (atividadeId) => {

     setAtividades((prevTarefas) => {
           const novaLista = prevTarefas.map(atividade => 
                atividade.id === atividadeId 
                    ? { 
                        ...atividade, 
                        coluna: atividade.coluna > 1 ? atividade.coluna - 1 : 1, 
                        icons: atividade.coluna === 2 ? 'icones1' :'icones2' 
                        
                    } 
                    : atividade,
                    console.log("teste"))
                    const atividadeAtualizada = novaLista.find(t => t.idAtividade === id);


            atualizaKanban(atividadeAtualizada.Kanban_idAtividadeKanban, atividadeAtualizada.coluna);

            return novaLista;
     })
        

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

    const adicionarAtividade = async (atividade) => {
            if (verificaAtividadeEmLista(atividade.idAtividade)) {
                showOkToast("Atividade já inserida no Kanban!", "error");
                setMostrarModal(false);
                return;
            }
            try {
            
                    const res = await adicionarAtividadeEmKanban({
                        classificacao: colunaSelecionada
                    });
                    const idKanban = res.idAtividadeKanban;
    
                    const novaAtividade = { ...atividade, coluna: colunaSelecionada, nome: atividade.nomeAtividade, Kanban_idAtividadeKanban: idKanban, Usuarios_username: atividade.Usuarios_username};
                        
                    console.log(novaAtividade);
                                await atualizarIdKanbanAtividade(novaAtividade.idAtividade, {
                                    Kanban_idAtividadeKanban: novaAtividade.Kanban_idAtividadeKanban,
                                    Usuarios_username: novaAtividade.Usuarios_username,
                                    idAtividade: novaAtividade.idAtividade
                    
                                })
            setAtividades((prev) => [...prev, novaAtividade]);
            setAtividadesAdicionadas((prev) => [...prev, novaAtividade]);
            } catch (err) {
            console.error("Erro ao adicionar ou atualizar atividade: ", err);
        }
    
            setMostrarModal(false);
        };

    return(
        <>
            <Container>
                <Painel id='1'>
                    <BoxTitulo>A Fazer</BoxTitulo>
                    {atividades.filter(atividade => atividade.coluna === 1).map(atividade => (
                        <BoxTarefas key={atividade.idAtividade} id={atividade.idAtividade}>
                            <NomeTarefa>{atividade.nome}</NomeTarefa>
                            {renderIcons(atividade.coluna, atividade.idAtividade)}
                        </BoxTarefas>
                    ))}
                    <BoxAdicionar onClick={handleClick(1)} id="Adicionar">Adicionar Tarefa</BoxAdicionar></Painel>
                <Painel id='2'><BoxTitulo>Fazendo</BoxTitulo>
                {atividades.filter(atividade => atividade.coluna === 2).map(atividade => (
                        <BoxTarefas key={atividade.idAtividade} id={atividade.idAtividade}>
                            <NomeTarefa>{atividade.nome}</NomeTarefa>
                            {renderIcons(atividade.coluna, atividade.idAtividade)}
                        </BoxTarefas>
                    ))}
                    <BoxAdicionar onClick={handleClick(2)} id="Adicionar">Adicionar Tarefa</BoxAdicionar>
                </Painel>
                <Painel id='3'><BoxTitulo>Feito</BoxTitulo>
                {atividades.filter(atividade => atividade.coluna === 3).map(atividade => (
                        <BoxTarefas key={atividade.idAtividade} id={atividade.idAtividade}>
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