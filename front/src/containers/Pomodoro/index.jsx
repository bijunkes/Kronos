import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Background, Container, Intervalos, Intervalo, Principal, ParteTempo, Cronometro, Circulo, Reiniciar, Pular, Configuracoes, TituloConfiguracoes, OpcoesConfiguracoes, OpcaoFoco, FocoDuracao, FocoQtde, OpcaoCurto, OpcaoLongo, Atividades, Atividade, Adicionar, Lista } from './styles';
import ModalAtividades from '../ModalAtividades';
import { listarTodasAtividades, listarAtividadesSessao, salvarAtividadesSessao } from '../../services/api.js';

function Pomodoro() {
    const [modo, setModo] = useState("foco");
    const [config, setConfig] = useState({
        foco: 25 * 60,
        curto: 5 * 60,
        longo: 15 * 60,
        ciclos: 4,
    });
    const [tempo, setTempo] = useState(config.foco);
    const [ativo, setAtivo] = useState(false);
    const [cicloAtual, setCicloAtual] = useState(0);

    const idSessao = 1;

    const [atividades, setAtividades] = useState([]);
    const [atividadesSelecionadas, setAtividadesSelecionadas] = useState([]);
    const [trocaAutomatica, setTrocaAutomatica] = useState(false);

    const [modalAberto, setModalAberto] = useState(false);
    const abrirModal = () => setModalAberto(true);
    const fecharModal = () => setModalAberto(false);

    useEffect(() => {
        const carregarAtividades = async () => {
            try {
                const atividadesSessao = await listarAtividadesSessao(idSessao);
                const todasAtividades = await listarTodasAtividades();

                const atividadesComNome = atividadesSessao.map(a => {
                    const atividadeCompleta = todasAtividades.find(t => t.idAtividade === a.idAtividade);
                    return {
                        ...a,
                        nomeAtividade: a.nomeAtividade || atividadeCompleta?.nomeAtividade || "Sem nome",
                        concluido: a.concluido ?? false
                    };
                });

                setAtividadesSelecionadas(atividadesComNome);
            } catch (err) {
                console.error("Erro ao carregar atividades da sessão:", err);
            }
        };

        carregarAtividades();
    }, []);

    useEffect(() => {
        async function fetchAtividades() {
            try {
                const dados = await listarTodasAtividades();
                setAtividades(dados);
            } catch (error) {
                console.error("Erro ao buscar atividades:", error);
            }
        }
        fetchAtividades();
    }, []);

    useEffect(() => {
        let intervalo = null;
        if (ativo && tempo > 0) {
            intervalo = setInterval(() => setTempo((t) => t - 1), 1000);
        } else if (tempo === 0) {
            handleFim();
        }
        return () => clearInterval(intervalo);
    }, [ativo, tempo]);

    useEffect(() => {
        setTempo(config[modo]);

        if (trocaAutomatica) {
            setAtivo(true);
            setTrocaAutomatica(false);
        } else {
            setAtivo(false);
        }
    }, [modo]);

    const formatarTempo = (segundos) =>
        `${String(Math.floor(segundos / 60)).padStart(2, "0")}:${String(segundos % 60).padStart(2, "0")}`;

    const handleFim = () => {
        setTrocaAutomatica(true);

        if (modo === "foco") {
            setCicloAtual((c) => {
                const novoCiclo = c + 1;
                if (novoCiclo % config.ciclos === 0) {
                    setModo("longo");
                } else {
                    setModo("curto");
                }
                return novoCiclo;
            });
        } else {
            if (modo === "longo") {
                setCicloAtual(0);
            }
            setModo("foco");
        }
    };
    const reiniciar = () => {
        setAtivo(true);
        setTempo(config[modo]);
    };

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        const novoValor = value === "" ? 1 : parseInt(value) || 1;


        setConfig((prev) => ({
            ...prev,
            [name]: novoValor * (name === 'ciclos' ? 1 : 60),
        }));

        if (name === modo) {
            setTempo(novoValor * 60);
        }
    };

    const adicionarAtividadeSessao = async (atividade) => {
        const jaExiste = atividadesSelecionadas.some(a => a.idAtividade === atividade.idAtividade);
        if (jaExiste) return;

        const novasAtivs = [...atividadesSelecionadas, atividade];
        setAtividadesSelecionadas(novasAtivs);

        try {
            await salvarAtividadesSessao(idSessao, novasAtivs);
        } catch (err) {
            console.error("Erro ao salvar atividades da sessão:", err);
        }
    };

    const handleExcluirAtividade = async (idAtividade) => {
        const novasAtivs = atividadesSelecionadas.filter(a => a.idAtividade !== idAtividade);
        setAtividadesSelecionadas(novasAtivs);

        try {
            await salvarAtividadesSessao(idSessao, novasAtivs);
        } catch (err) {
            console.error("Erro ao excluir atividade da sessão:", err);
        }
    };


    return (
        <Background>
            <Container>
                <Principal>
                    <Intervalos>
                        <Intervalo ativo>
                            {modo === 'foco' && 'Foco'}
                            {modo === 'curto' && 'Intervalo Curto'}
                            {modo === 'longo' && 'Intervalo Longo'}
                        </Intervalo>
                    </Intervalos>
                    <ParteTempo>
                        <Cronometro>
                            <Circulo>
                                <p id='ciclos'>{cicloAtual} / {config.ciclos}</p>
                                <p id='tempo'>{formatarTempo(tempo)}</p>

                                <span
                                    className="material-symbols-outlined"
                                    onClick={() => setAtivo(!ativo)}
                                >
                                    {ativo ? 'pause' : 'play_arrow'}
                                </span>

                            </Circulo>
                            <Reiniciar onClick={reiniciar}>
                                <span class="material-symbols-outlined">
                                    replay
                                </span>
                            </Reiniciar>
                            {(modo === 'curto' || modo === 'longo') && (
                                <Pular onClick={handleFim} style={{ marginTop: '1rem' }}>
                                    <span class="material-symbols-outlined">
                                        fast_forward
                                    </span>
                                </Pular>
                            )}
                        </Cronometro>
                        <Configuracoes>
                            <TituloConfiguracoes>
                                Configurações
                            </TituloConfiguracoes>
                            <OpcoesConfiguracoes>
                                <OpcaoFoco>
                                    <FocoDuracao>
                                        Foco
                                        <input
                                            type="number"
                                            min="1"
                                            name="foco"
                                            value={Math.floor(config.foco / 60)}
                                            onChange={handleConfigChange}

                                        />
                                    </FocoDuracao>
                                    <FocoQtde>
                                        Ciclos
                                        <input
                                            type="number"
                                            min="1"
                                            name="ciclos"
                                            value={config.ciclos}
                                            onChange={handleConfigChange}
                                        />
                                    </FocoQtde>
                                </OpcaoFoco>
                                <OpcaoCurto>
                                    Intervalo Curto
                                    <input
                                        type="number"
                                        min="1"
                                        name="curto"
                                        value={Math.floor(config.curto / 60)}
                                        onChange={handleConfigChange}
                                    />
                                </OpcaoCurto>
                                <OpcaoLongo>
                                    Intervalo Longo
                                    <input
                                        type="number"
                                        min="1"
                                        name="longo"
                                        value={Math.floor(config.longo / 60)}
                                        onChange={handleConfigChange}
                                    />
                                </OpcaoLongo>
                            </OpcoesConfiguracoes>
                        </Configuracoes>
                    </ParteTempo>
                </Principal>
                <Atividades>
                    <h1>Atividades</h1>
                    <Lista>
                        {atividadesSelecionadas.map((a, index) => (
                            <Atividade key={a?.idAtividade || index}>
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: '20px', cursor: 'pointer' }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {a?.concluido ? 'radio_button_checked' : 'radio_button_unchecked'}
                                </span>
                                {a?.nomeAtividade || "Sem nome"}

                                {/* Botão de excluir */}
                                <span
                                    className="material-symbols-outlined btn-excluir"
                                    onClick={() => handleExcluirAtividade(a.idAtividade)}
                                >
                                    delete
                                </span>
                            </Atividade>
                        ))}


                    </Lista>

                    <Adicionar onClick={abrirModal}>
                        Adicionar atividade
                    </Adicionar>
                </Atividades>
            </Container>
            <ModalAtividades
                aberto={modalAberto}
                onFechar={fecharModal}
                atividades={atividades}
                onAdicionar={adicionarAtividadeSessao}
            />

        </Background>
    )
}

export default Pomodoro;