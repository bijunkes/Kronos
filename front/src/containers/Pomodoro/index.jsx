import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Background, Container, Intervalos, Intervalo, Principal, ParteTempo, Cronometro, Circulo, BotaoCronometro, Configuracoes, TituloConfiguracoes, OpcoesConfiguracoes, OpcaoFoco, OpcaoCurto, OpcaoLongo, Atividades } from './styles';

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

    const [atividades, setAtividades] = useState([]);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3000/atividades")
            .then((res) => setAtividades(res.data))
            .catch((err) => console.error(err));
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
        setAtivo(false);
    }, [modo]);

    const formatarTempo = (segundos) =>
        `${String(Math.floor(segundos / 60)).padStart(2, "0")}:${String(segundos % 60).padStart(2, "0")}`;

    const handleFim = () => {
        if (modo == "foco") {
            setCicloAtual((c) => c + 1);
            if ((cicloAtual + 1) % config.ciclos === 0) {
                setModo("longo");
            } else {
                setModo("curto");
            }
        } else {
            setModo("foco");
        }
    }

    return (
        <Background>
            <Container>
                <Intervalos>
                    <Intervalo>
                        Foco
                    </Intervalo>
                    <Intervalo>
                        Intervalo Curto
                    </Intervalo>
                    <Intervalo>
                        Intervalo Curto
                    </Intervalo>
                </Intervalos>
                <Principal>
                    <ParteTempo>
                        <Cronometro>
                            <Circulo>
                                <p id='ciclos'>0 / 4</p>
                                <p id='tempo'>25:00</p>
                                <span class="material-symbols-outlined">
                                    play_arrow
                                </span>
                            </Circulo>
                            <BotaoCronometro>
                                Começar
                            </BotaoCronometro>
                        </Cronometro>
                        <Configuracoes>
                            <TituloConfiguracoes>
                                Configurações
                            </TituloConfiguracoes>
                            <OpcoesConfiguracoes>
                                <OpcaoFoco>
                                    Foco
                                </OpcaoFoco>
                                <OpcaoCurto>
                                    Intervalo Curto
                                </OpcaoCurto>
                                <OpcaoLongo>
                                    Intervalo Longo
                                </OpcaoLongo>
                            </OpcoesConfiguracoes>
                        </Configuracoes>
                    </ParteTempo>
                    <Atividades>

                    </Atividades>
                </Principal>
            </Container>
        </Background>
    )
}

export default Pomodoro;