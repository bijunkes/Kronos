import { React, useState, useEffect } from 'react';
import {
    Container, Titulo, Data, Progresso, Pomodoro, Pendente, Andamento, Concluido, Classificacao, ProgressoCirculo, BoxTitulo, BoxTarefas, BoxNomeTarefa, NomeTarefa, NaoImportanteUrgente,
    NaoImportanteNaoUrgente,
    ImportanteNaoUrgente,
    ImportanteUrgente,
    RelatorioKanban,
    Icones
} from './style'
import { listarAtividadesEmKanban, listarAtividades, contaEmMatrizPorClassificacao } from "../../services/api.js";

function RelatorioDiario() {

    const [atividades, setAtividades] = useState([

    ])
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [tamanhos, setTamanhos] = useState({
        1: 0,
        2: 0,
        3: 0,
        4: 0
    });
    const [contAtvs, setContAtvs] = useState('');
    const buscarAtividadesKanban = async () => {

        try {
            const todasAtividadesEmKanban = await listarAtividadesEmKanban();

            const todasAtividades = await listarAtividades();
            console.log(todasAtividadesEmKanban);
            const matrizMap = new Map();
            todasAtividadesEmKanban.forEach(item => {
                if (item.dataAlteracao.substring(0, 10) == capturaData()) {
                    matrizMap.set(item.idAtividadeKanban, item.classificacao)
                }
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
        const carregarTamanhos = async () => {
            const novoTamanho = {};
            for (let i = 1; i <= 4; i++) {
                novoTamanho[i] = await defineTamanho(i);
            }
            console.log("Tamanhos calculados:", novoTamanho);
            setTamanhos(novoTamanho);
        };

        setContAtvs(contagemAtividadesConcluidas())

        buscarAtividadesKanban();
        carregarTamanhos();

    }, []);
    const contagemAtividadesConcluidas = async () => {
        const todasAtividades = await listarAtividades();
        let cont = 0;
        let quantAtvs = 0;

        const calculaPorcentagem = (total, parcial) => {
            const resultado = (parcial * 100) / total;
            return resultado;
        }

        todasAtividades.forEach(atv => {
            if (atv.statusAtividade == "1" && atv.dataConclusao.substring(0, 10) == capturaData()) {
                console.log(`Atividade Dentro do if: ${atv}`);
                cont++;
            }
            quantAtvs++;
        })

        console.log(`Total de atividades: ${quantAtvs}`);
        console.log(`Atividades concluidas: ${cont}`);
        const porcentagem = Math.round(calculaPorcentagem(quantAtvs, cont));
        console.log(`Porcentagem: ${porcentagem}`);
        if (porcentagem !== 0 && porcentagem < 10) {
            return `0${porcentagem}%`;
        }

        return `${porcentagem}%`;

    }
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

    const defineTamanho = async (classificacao) => {
        console.log(classificacao)
        console.log(`${capturaData()}`);
        const quadrante = await contaEmMatrizPorClassificacao(classificacao, capturaData());

        const extraiValor = (valor) => {
            if (!valor) return 0;
            if (Array.isArray(valor)) {
                const primeiro = valor[0];
                if (typeof primeiro === 'number') return primeiro;
                if (typeof primeiro === 'object') return Object.values(primeiro)[0];
            }
            if (typeof valor === 'object') return Object.values(valor)[0];
            return valor;
        };

        const quantidade = extraiValor(quadrante);
        const tamanho = quantidade * 5;
        console.log("Tamanho do quadrante " + classificacao + ": " + tamanho);
        return tamanho;

    }
    const textoKanban = 'Aqui estão organizadas as\natividades do Kanban modificadas hoje'
    const textoClassificacao = 'Aqui estão organizadas as\natividades presentes na matriz de Eisenhower. Elas estão dispostas na seguinte ordem:\nImportante e Urgente;\nImportante e Não Urgente;\nNão Importante e Urgente;\ne Não Imortante e Não Urgente'
    return (
        <>
            <Container>
                <Titulo>Relatório Diário</Titulo>
                <RelatorioKanban>Atividades do Kanban <Icones className="material-symbols-outlined" title={textoKanban}>
                    info
                </Icones></RelatorioKanban>
                <Data>{dataFormatada()}</Data>
                <Progresso>
                    Progresso
                    <ProgressoCirculo>{contAtvs}</ProgressoCirculo>
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
                    <span>Classificação <Icones className="material-symbols-outlined" title={textoClassificacao}>
                        info
                    </Icones></span>
                    <ImportanteUrgente style={{ width: `${tamanhos[1]}vw` }} title='Importante e Urgente'>{tamanhos[1] / 5}</ImportanteUrgente>
                    <ImportanteNaoUrgente style={{ width: `${tamanhos[2]}vw` }} title='Importante e Não urgente'>{tamanhos[2] / 5}</ImportanteNaoUrgente>
                    <NaoImportanteUrgente style={{ width: `${tamanhos[3]}vw` }} title='Não importante e Urgente'>{tamanhos[3] / 5}</NaoImportanteUrgente>
                    <NaoImportanteNaoUrgente style={{ width: `${tamanhos[4]}vw` }} title='Não importante e Não urgente'>{tamanhos[4] / 5}</NaoImportanteNaoUrgente>
                </Classificacao>
            </Container>
        </>
    )
}

export default RelatorioDiario;