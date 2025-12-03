import { React, useState, useEffect } from 'react';
import {
    Container, Titulo, Data, Progresso, Pomodoro, Pendente, Andamento, Concluido, Classificacao, ProgressoBox, BoxTitulo, BoxTarefas, BoxNomeTarefa, NomeTarefa, NaoImportanteUrgente,
    NaoImportanteNaoUrgente,
    ImportanteNaoUrgente,
    ImportanteUrgente,
    RelatorioKanban,
    Icones,
    BoxPomodoro,
    PainelTarefas,
    Background
} from './style'
import { listarAtividadesEmKanban, listarAtividades, listarAtividadesEisenPorClassificacao, listarSessoes, getPerfil } from "../../services/api.js";

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

        const perfil = await getPerfil();

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
            console.log("chablau: " + [...matrizMap.values()]);
            const verificaConclusao = (atividade) => {
                console.log("LIAWYUuiwquiqwfuiwbf: " + atividade);
                if (atividade.statusAtividade == 1) {
                    return 3;
                }
                console.log("awrlkhhfguiwvbuiw4eb:  " + matrizMap.get(atividade.Kanban_idAtividadeKanban))
                return parseInt(matrizMap.get(atividade.Kanban_idAtividadeKanban));
            }

            todasAtividades.forEach(a => {
                console.log(a)
            })
            const atividadesEmKanban = todasAtividades.filter(atv => matrizMap.has(atv.Kanban_idAtividadeKanban) && atv.Usuarios_username == perfil.username).map(atv => ({
                ...atv,
                coluna: verificaConclusao(atv),
                nome: atv.nomeAtividade,
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



        todasAtividades.forEach(atv => {
            if (atv.statusAtividade == "1") {
                if (atv.dataConclusao.substring(0, 10) == capturaData()) {
                    console.log(`Atividade Dentro do if: ${atv}`);
                    cont++;
                }

            } else {
                quantAtvs++;
            }

        })

        console.log(`Total de atividades: ${quantAtvs}`);
        console.log(`Atividades concluidas: ${cont}`);


        return `${cont}|${quantAtvs}`;

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
        const listaMatriz = await listarAtividadesEisenPorClassificacao(classificacao);
        let quantidade = 0;
        const todasAtividades = await listarAtividades();
        const perfil = await getPerfil();
        listaMatriz.forEach(atv => {
            const atividade = todasAtividades.find(a => a.Eisenhower_idAtividadeEisenhower == atv.idAtividadeEisenhower)
            if (!!atividade && atv.dataAlteracao.substring(0, 10) == capturaData() && atividade.Usuarios_username == perfil.username) {

                console.log(`contando...`);
                quantidade++;

            }
        })

        const tamanho = quantidade * 5;
        console.log("Tamanho do quadrante " + classificacao + ": " + tamanho);
        return tamanho;

    }
    const textoKanban = 'Aqui estão organizadas as\natividades presentes no Kanban modificadas hoje'
    const textoClassificacao = 'Aqui estão organizadas as\natividades presentes na matriz de Eisenhower\nque foram modificadas hoje'
    const textoProgresso = 'Aqui são consideradas as atividades terminadas hoje e as ainda não concluídas\nConcluídas hoje/Não Concluídas'
    const textoPomodoro = 'Aqui estão o foco e descanso totais do Pomodoro de hoje'

    const [sessoes, setSessoes] = useState([]);

    const [tempos, setTempos] = useState({ foco: 0, descanso: 0 });

    useEffect(() => {
        const carregarSessoesHoje = async () => {
            const todasSessoes = await listarSessoes();

            const hoje = new Date();
            const diaHoje = hoje.toISOString().substring(0, 10);

            const sessoesHoje = todasSessoes.filter(s => s.inicio.substring(0, 10) === diaHoje);

            const somaSegundos = sessoesHoje.reduce((acc, s) => ({
                foco: acc.foco + (s.duracaoRealFocoSegundos || 0),
                descanso: acc.descanso + ((s.duracaoRealCurtoSegundos || 0) + (s.duracaoRealLongoSegundos || 0))
            }), { foco: 0, descanso: 0 });

            setTempos({
                foco: Math.floor(somaSegundos.foco / 60),
                descanso: Math.floor(somaSegundos.descanso / 60)
            });
        };

        carregarSessoesHoje();
    }, []);


    return (
        <Background>
            <Container>
                <Titulo>Relatório Diário</Titulo>
                <RelatorioKanban>Atividades do Kanban <Icones className="material-symbols-outlined" title={textoKanban}>
                    info
                </Icones></RelatorioKanban>
                <Data>{dataFormatada()}</Data>
                <Progresso>
                    <span style={{ display: 'flex' }}>Progresso <Icones className="material-symbols-outlined" title={textoProgresso}>
                        info
                    </Icones></span>
                    <ProgressoBox>{contAtvs}</ProgressoBox>
                </Progresso>
                <Pomodoro>
                    <span style={{ display: 'flex' }}>Pomodoro <Icones className="material-symbols-outlined" title={textoPomodoro}>
                        info
                    </Icones></span>
                    <BoxPomodoro>Foco: {tempos.foco} min</BoxPomodoro>
                    <BoxPomodoro>Descanso: {tempos.descanso} min</BoxPomodoro>
                </Pomodoro>
                <Pendente><BoxTitulo>Pendente</BoxTitulo><PainelTarefas>{atividades.filter(atividade => atividade.coluna === 1).map(atividade => (

                    <BoxTarefas key={atividade.Kanban_idAtividadeKanban} id={atividade.idAtividade}>

                        <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa>

                    </BoxTarefas>


                ))} </PainelTarefas></Pendente>
                <Andamento><BoxTitulo>Em Andamento</BoxTitulo><PainelTarefas>{atividades.filter(atividade => atividade.coluna === 2).map(atividade => (

                    <BoxTarefas key={atividade.Kanban_idAtividadeKanban} id={atividade.idAtividade}>

                        <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa>

                    </BoxTarefas>


                ))} </PainelTarefas></Andamento>
                <Concluido><BoxTitulo>Concluído</BoxTitulo><PainelTarefas>{atividades.filter(atividade => atividade.coluna === 3).map(atividade => (

                    <BoxTarefas key={atividade.Kanban_idAtividadeKanban} id={atividade.idAtividade}>

                        <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa>

                    </BoxTarefas>


                ))} </PainelTarefas></Concluido>
                <Classificacao>
                    <span style={{ display: 'flex' }}>Classificação <Icones className="material-symbols-outlined" title={textoClassificacao}>
                        info
                    </Icones></span>
                    <ImportanteUrgente style={{ width: `${tamanhos[1]}vw` }} title='Importante e Urgente'>{tamanhos[1] / 5}</ImportanteUrgente>
                    <ImportanteNaoUrgente style={{ width: `${tamanhos[2]}vw` }} title='Importante e Não urgente'>{tamanhos[2] / 5}</ImportanteNaoUrgente>
                    <NaoImportanteUrgente style={{ width: `${tamanhos[3]}vw` }} title='Não importante e Urgente'>{tamanhos[3] / 5}</NaoImportanteUrgente>
                    <NaoImportanteNaoUrgente style={{ width: `${tamanhos[4]}vw` }} title='Não importante e Não urgente'>{tamanhos[4] / 5}</NaoImportanteNaoUrgente>
                </Classificacao>
            </Container>
        </Background>
    );
}


export default RelatorioDiario;