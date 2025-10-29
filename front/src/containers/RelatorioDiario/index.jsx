import {React, useState, useEffect} from 'react';
import {Container, Titulo, Data, Progresso, Pomodoro, Pendente, Andamento, Concluido, Classificacao, ProgressoCirculo,BoxTitulo, BoxTarefas, BoxNomeTarefa, NomeTarefa, NaoImportanteUrgente,
    NaoImportanteNaoUrgente,
    ImportanteNaoUrgente,
    ImportanteUrgente} from './style'
import {listarAtividadesEmKanban, listarAtividades, contaEmMatrizPorClassificacao} from "../../services/api.js";

function RelatorioDiario() {

    const [atividades, setAtividades] = useState([
        
    ])
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const buscarAtividadesKanban = async () => {
        
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
                        idAtividade: atv.idAtividade,
                    }))
                    setAtividades(atividadesEmKanban);
                    
        
                    console.log("todasAtividades:", todasAtividades);
                    console.log("todasAtividadesEmMatriz:", todasAtividadesEmKanban);
                    console.log("AtividadesEmKanban:", atividadesEmKanban);
        
                    console.log(atividadesEmKanban);
                } catch (err) {
                    console.error('Erro ao carregar todas as atividades', err);
                    setErro('Erro ao carregar as atividades.');
                } finally {
                    setCarregando(false);
                }
            };
        
             useEffect(() => {
                    buscarAtividadesKanban();
                    organizaCamposEisen();
                }, []);
    const dataFormatada = () => {
        const dataAtual = new Date();
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const ano = dataAtual.getFullYear();

        return `Data:   ${dia}/${mes}/${ano}`;
    }
    const capturaData = () => {
        const dataAtual = new Date();
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const ano = dataAtual.getFullYear();

        return `${ano}-${mes}-${dia}`;
    }
    const organizaCamposEisen = async () => {
    console.log(`${capturaData()}`);
    const quadIU = await contaEmMatrizPorClassificacao(1, capturaData());
    const quadNIU = await contaEmMatrizPorClassificacao(3, capturaData());
    const quadINU = await contaEmMatrizPorClassificacao(2, capturaData());
    const quadNINU = await contaEmMatrizPorClassificacao(4, capturaData());

    const quantIU = quadIU.COUNT;
    const quantNIU = quadNIU[0]
    const quantINU = quadINU[0]
    const quantNINU = quadNINU[0]

    console.log(quantIU)
    console.log(quantNIU)
    console.log(quantINU)
    console.log(quantNINU)

    let IU = document.getElementById('1')
    let NIU = document.getElementById('2')
    let INU = document.getElementById('3')
    let NINU = document.getElementById('4')

    IU.style.width = quantIU*5 + "vw";
    NIU.style.width = quantNIU*5 + "vw";
    INU.style.width = quantINU*5 + "vw";
    NINU.style.width = quantNINU*5 + "vw";
    console.log(quantIU*5 + "vw")
    console.log(quantNIU*5 + "vw")
    console.log(quantINU*5 + "vw")
    console.log(quantNINU*5 + "vw")

    }
    return(
        <>
        <Container>
            <Titulo>Relatório Diário</Titulo>
            <Data>{dataFormatada()}</Data>
            <Progresso>
                Progresso
                <ProgressoCirculo>20%</ProgressoCirculo>
            </Progresso>
            <Pomodoro></Pomodoro>
            <Pendente><BoxTitulo>Pendente</BoxTitulo>{atividades.filter(atividade => atividade.coluna === 1).map(atividade => (
                                    <BoxTarefas key={atividade.Kanban_idAtividadeKanban} id={atividade.idAtividade}>
                                        <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa> 
                                    </BoxTarefas>
                                ))}</Pendente>
            <Andamento><BoxTitulo>Em Andamento</BoxTitulo>{atividades.filter(atividade => atividade.coluna === 2).map(atividade => (
                                    <BoxTarefas key={atividade.Kanban_idAtividadeKanban} id={atividade.idAtividade}>
                                        <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa> 
                                    </BoxTarefas>
                                ))}</Andamento>
            <Concluido><BoxTitulo>Concluído</BoxTitulo>{atividades.filter(atividade => atividade.coluna === 3).map(atividade => (
                                    <BoxTarefas key={atividade.Kanban_idAtividadeKanban} id={atividade.idAtividade}>
                                        <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa> 
                                    </BoxTarefas>
                                ))}</Concluido>
            <Classificacao>
                Classificação
                <ImportanteUrgente id='1'></ImportanteUrgente>
                <ImportanteNaoUrgente id='2'></ImportanteNaoUrgente>
                <NaoImportanteUrgente id='3'></NaoImportanteUrgente>
                <NaoImportanteNaoUrgente id='4'></NaoImportanteNaoUrgente>
            </Classificacao>
        </Container>
        </>
    )
}

export default RelatorioDiario;