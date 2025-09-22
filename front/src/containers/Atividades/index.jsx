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
import AtividadeSelecionada from '../AtividadeSelecionada/index.jsx';

function Atividades() {
    const [idLista, setIdLista] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
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
                        {atividades.map((a, index) => {
                            const isSelecionada = atividadeSelecionada?.idAtividade === a.idAtividade;

                            return (
                                <Atividade
                                    key={a.idAtividade || index}
                                    onClick={() => {
                                        if (isSelecionada) {
                                            setAtividadeSelecionada(null);
                                        } else {
                                            setAtividadeSelecionada(a);
                                        }
                                    }}
                                    style={{
                                        backgroundColor: isSelecionada ? 'var(--cinza-claro)' : 'var(--fundo-menu-ativo)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: "20px", cursor: "pointer" }}
                                            onClick={(e) => toggleConcluido(index, e)}
                                        >
                                            {a.concluido
                                                ? "radio_button_checked"
                                                : "radio_button_unchecked"}
                                        </span>
                                        {a.nomeAtividade}
                                    </div>
                                    <Prazo>
                                        {new Date(a.prazoAtividade.replace(" ", "T")).toLocaleDateString()}
                                    </Prazo>
                                </Atividade>
                            );
                        })}
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
            <Parte2>
                <AtividadeSelecionada atividade={atividadeSelecionada} onClose={() => setAtividadeSelecionada(null)} />
            </Parte2>

        </Background>
    );
}

export default Atividades;