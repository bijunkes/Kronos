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
    Prazo,
    Parte2
} from './styles.js'
import { listarAtividades, listarListas, criarLista, listarTodasAtividades } from '../../services/api.js';
import ModalCriarAtividade from '../ModalCriarAtividade/index.jsx';

function Atividades() {
    const [idLista, setIdLista] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    const fetchAtividades = async () => {
        try {
            const atividades = await listarAtividades();
            setAtividades(atividades);
        } catch (err) {
            console.error("Erro ao buscar atividades", err);
        }
    }

    useEffect(() => {
    const carregarTodasAtividades = async () => {
        try {
            const todasAtividades = await listarTodasAtividades();
            setAtividades(todasAtividades);
        } catch (err) {
            console.error('Erro ao carregar todas as atividades', err);
        }
    };

    carregarTodasAtividades();
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
                                id="add"
                                onClick={() => setMostrarModal(true)}>
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
            <ModalCriarAtividade
                isOpen={mostrarModal}
                onClose={() => setMostrarModal(false)}
                listaId={idLista}
                onAtividadeCriada={(novaAtividade) => {
                    setAtividades([...atividades, { ...novaAtividade, concluido: false }]);
                }}
            />

        </Background>
    );
}

export default Atividades;