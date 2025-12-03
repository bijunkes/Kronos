import { React, useState, useEffect } from 'react';
import {
    Container, Titulo, Data, Progresso, Pomodoro, Pendente, Andamento, Concluido, Classificacao, ProgressoBox, BoxTitulo, BoxTarefas, BoxNomeTarefa, NomeTarefa, NaoImportanteUrgente,
    NaoImportanteNaoUrgente,
    ImportanteNaoUrgente,
    ImportanteUrgente,
    RelatorioKanban,
    Icones,
    BoxPomodoro,
    PainelTarefas
} from './style'
import { listarAtividadesEmKanban, listarAtividades, listarAtividadesEisenPorClassificacao, listarSessoes, getPerfil } from "../../services/api.js";

function RelatorioSemanal() {

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
                if (verificaDataNoIntervalo(item.dataAlteracao)) {
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
            console.log(matrizMap.has(7))
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
    
            const carregarContagem = async () => {
                const valor = await contagemAtividadesConcluidas();
                setContAtvs(valor);
            };
    
            carregarContagem();
    
    
            buscarAtividadesKanban();
            carregarTamanhos();
        }, []);
        
    const contagemAtividadesConcluidas = async () => {
        const todasAtividades = await listarAtividades();
        let cont = 0;
        let quantAtvs = 0;



        todasAtividades.forEach(atv => {
            if (atv.statusAtividade == "1") {
                if (verificaDataNoIntervalo(atv.dataConclusao.substring(0, 10))) {
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

    const verificaDataNoIntervalo = (dataAlteracao) => {

        const dataAtual = new Date();
        const dataSetada = new Date(dataAlteracao);


        const dataInicial = new Date();
        dataInicial.setDate(dataAtual.getDate() - 8);
        console.log("Data Inicial: " + dataInicial)


        return dataSetada >= dataInicial && dataSetada <= dataAtual;
    }
    const dataIntervalo = () => {

        const meses31 = [1, 3, 5, 7, 8, 10, 12];
        const meses30 = [4, 6, 9, 11]

        const dataAtual = new Date();


        let diaInicial = dataAtual.getDate() - 7;
        let mesInicial = dataAtual.getMonth() + 1;
        let anoInicial = dataAtual.getFullYear();
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const ano = dataAtual.getFullYear();

        if (diaInicial <= 0) {
            const diminuir = -diaInicial;
            mesInicial = mesInicial - 1;
            if (mesInicial == 2) {
                diaInicial = 28 - diminuir;
            }
            else if (mesInicial == 0) {
                mesInicial = 12;
                anoInicial = anoInicial - 1
            }
            meses30.forEach(mes30 => {
                if (mes30 == mesInicial) {
                    diaInicial = 30 - diminuir;
                    console.log("mes30: " + diaInicial.valueOf)
                }
            })
            meses31.forEach(mes31 => {
                if (mes31 == mesInicial) {
                    diaInicial = 31 - diminuir;
                }
            })
        }
        diaInicial = String(diaInicial).padStart(2, '0');
        mesInicial = String(mesInicial).padStart(2, '0');





        return `Data: ${diaInicial}/${mesInicial}/${anoInicial} - ${dia}/${mes}/${ano}`;
    }
    const capturaData = () => {
        const dataAtual = new Date();
        const dia = String(dataAtual.getDate() - 7).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const ano = dataAtual.getFullYear();

        return `${ano}-${mes}-${dia}`;
    }
    const defineTamanho = async (classificacao) => {
        console.log(classificacao)
        console.log(`${capturaData()}`);
        let quantidade = 0;
        const listaMatriz = await listarAtividadesEisenPorClassificacao(classificacao);

        const todasAtividades = await listarAtividades();

        const perfil = await getPerfil();
        listaMatriz.forEach(atv => {
            const atividade = todasAtividades.find(a => a.Eisenhower_idAtividadeEisenhower == atv.idAtividadeEisenhower)
            if (!!atividade && verificaDataNoIntervalo(atv.dataAlteracao.substring(0, 10)) && atividade.Usuarios_username == perfil.username) {

                quantidade++;

            }
        })
        const tamanho = quantidade * 5;
        console.log("Tamanho do quadrante " + classificacao + ": " + tamanho);
        return tamanho;

    }
    const textoKanban = 'Aqui estão organizadas as\natividades presentes no Kanban modificadas na semana'
    const textoClassificacao = 'Aqui estão organizadas as\natividades presentes na matriz de Eisenhower\nque foram modificadas na semana'
    const textoProgresso = 'Aqui são consideradas as atividades terminadas na semana e as ainda não concluídas\nConcluídas na semana/Não Concluídas'
    const textoPomodoro = 'Aqui estão o foco e descanso totais do Pomodoro dessa semana'

    const [tempos, setTempos] = useState({ foco: 0, descanso: 0 });

    useEffect(() => {
        const carregarSessoesSemana = async () => {
            const todasSessoes = await listarSessoes();

            const hoje = new Date();
            const semanaPassada = new Date();
            semanaPassada.setDate(hoje.getDate() - 7);

            const sessoesSemana = todasSessoes.filter(s => {
                const inicio = new Date(s.inicio);
                return inicio >= semanaPassada && inicio <= hoje;
            });

            const somaSegundos = sessoesSemana.reduce((acc, s) => ({
                foco: acc.foco + (s.duracaoRealFocoSegundos || 0),
                descanso: acc.descanso + ((s.duracaoRealCurtoSegundos || 0) + (s.duracaoRealLongoSegundos || 0))
            }), { foco: 0, descanso: 0 });

            const somaMinutos = {
                foco: Math.floor(somaSegundos.foco / 60),
                descanso: Math.floor(somaSegundos.descanso / 60)
            };

            setTempos(somaMinutos);
        };

        carregarSessoesSemana();
    }, []);

    let feitas = 0;
    let total = 0;
    let progresso = 0;

    if (typeof contAtvs === "string" && contAtvs.includes("|")) {
        const partes = contAtvs.split("|");
        feitas = Number(partes[0]);
        total = Number(partes[0]) + Number(partes[1]);
        progresso = total > 0 ? feitas / total : 0;
    }

    return (
        <>
            <Container>
                <Titulo>Relatório Semanal</Titulo>
                <RelatorioKanban>Atividades do Kanban <Icones className="material-symbols-outlined" title={textoKanban}>
                    info
                </Icones></RelatorioKanban>
                <Data>{dataIntervalo()}</Data>
                <Progresso>
                    <span style={{ display: 'flex' }}>Progresso <Icones className="material-symbols-outlined" title={textoProgresso}>
                        info
                    </Icones></span>
                    <ProgressoBox progresso={progresso}>
                        {contAtvs}
                    </ProgressoBox>
                </Progresso>
                <Pomodoro>
                    <span style={{ display: 'flex' }}>Pomodoro <Icones className="material-symbols-outlined" title={textoPomodoro}>
                        info
                    </Icones></span>
                    <BoxPomodoro>Foco: {tempos.foco} min</BoxPomodoro>
                    <BoxPomodoro>Descanso: {tempos.descanso} min</BoxPomodoro></Pomodoro>
                <Pendente><BoxTitulo>Pendente</BoxTitulo><PainelTarefas>{atividades.filter(atividade => atividade.coluna === 1).map(atividade => (
                    <BoxTarefas key={atividade.Kanban_idAtividadeKanban} id={atividade.idAtividade}>

                        <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa>

                    </BoxTarefas>
                ))}</PainelTarefas></Pendente>
                <Andamento><BoxTitulo>Em Andamento</BoxTitulo><PainelTarefas>{atividades.filter(atividade => atividade.coluna === 2).map(atividade => (
                    <BoxTarefas key={atividade.Kanban_idAtividadeKanban} id={atividade.idAtividade}>

                        <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa>

                    </BoxTarefas>
                ))}</PainelTarefas></Andamento>
                <Concluido><BoxTitulo>Concluído</BoxTitulo><PainelTarefas>{atividades.filter(atividade => atividade.coluna === 3).map(atividade => (
                    <BoxTarefas key={atividade.Kanban_idAtividadeKanban} id={atividade.idAtividade}>

                        <BoxNomeTarefa><NomeTarefa>{atividade.nome}</NomeTarefa></BoxNomeTarefa>

                    </BoxTarefas>
                ))}</PainelTarefas></Concluido>
                <Classificacao>
                    <span style={{ display: 'flex' }}>Classificação <Icones className="material-symbols-outlined" title={textoClassificacao}>
                        info
                    </Icones></span>
                    <ImportanteUrgente style={{ width: `${tamanhos[1]}vw` }} title='Importante e Urgente'>{tamanhos[1] / 5} </ImportanteUrgente>
                    <ImportanteNaoUrgente style={{ width: `${tamanhos[2]}vw` }} title='Importante e Não urgente'>{tamanhos[2] / 5}</ImportanteNaoUrgente>
                    <NaoImportanteUrgente style={{ width: `${tamanhos[3]}vw` }} title='Não importante e Urgente'>{tamanhos[3] / 5}</NaoImportanteUrgente>
                    <NaoImportanteNaoUrgente style={{ width: `${tamanhos[4]}vw` }} title='Não importante e Não urgente'>{tamanhos[4] / 5}</NaoImportanteNaoUrgente>
                </Classificacao>
            </Container>
        </>
    )
}

export default RelatorioSemanal;