import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Background,
    ContainerLista,
    Conteudo,
    Header,
    NomeLista,
    Botoes,
    AreaAtividades,
    Atividade,
    Prazo
} from './styles.js'
import { listarAtividades, listarListas, criarLista } from '../../services/api.js';

function Atividades() {
    const [atividades, setAtividades] = useState([]);

    const fetchAtividades = async () => {
        try {
            const atividades = await listarAtividades();
            setAtividades(atividades);
        } catch (err) {
            console.error("Erro ao buscar atividades", err);
        }
    }

    useEffect(() => {
        fetchAtividades();
    }, []);

    function toggleConcluido(index) {
        const novasAtividade = [...atividades];
        novasAtividade[index].concluido = !novasAtividade[index].concluido;
        setAtividades(novasAtividade);
    }

    return (
        <Background>
            <ContainerLista>
                <Conteudo>
                    <Header>
                        <NomeLista>
                            Atividades
                        </NomeLista>
                        <Botoes>
                            <span className="material-symbols-outlined"
                                id="add">
                                add
                            </span>
                        </Botoes>
                    </Header>
                    <AreaAtividades>
                        {atividades.map((a, index) => (
                            <Atividade key={a.idAtividade || index}>
                                <span
                                    class="material-symbols-outlined"
                                    style={{ fontSize: "20px", cursor: "pointer" }}
                                    onClick={() => toggleConcluido(index)}
                                >
                                    {a.concluido
                                        ? "radio_button_checked"
                                        : "radio_button_unchecked"}

                                </span>
                                {a.nomeAtividade}
                                <Prazo>
                                    {new Date(a.prazoAtividade.replace(" ", "T")).toLocaleDateString()}
                                </Prazo>
                            </Atividade>
                        ))}
                    </AreaAtividades>
                </Conteudo>
            </ContainerLista>
        </Background>
    );
}

export default Atividades;