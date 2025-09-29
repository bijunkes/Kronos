import React, { useEffect, useState } from 'react';
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
    Parte2,
    Pesquisar,
    Input
} from './styles.js';
import { listarAtividadesPorLista, listarListas, listarTodasAtividades } from '../../services/api.js';
import ModalCriarAtividade from '../ModalCriarAtividade/index.jsx';
import AtividadeSelecionada from '../AtividadeSelecionada/index.jsx';

function Atividades() {
    const [idLista, setIdLista] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [filtro, setFiltro] = useState("");

    const atualizarAtividades = async () => {
        try {
            const dados = await listarTodasAtividades();
            setAtividades(dados);
        } catch (err) {
            console.error("Erro ao buscar atividades", err);
        }
    };

    useEffect(() => {
        const carregarLista = async () => {
            try {
                const listas = await listarListas();
                const lista = listas.find(l => l.nomeLista === "Atividades");

                if (lista) {
                    setIdLista(lista.idLista);
                    atualizarAtividades(lista.idLista);
                }

                const todasAtividades = await listarTodasAtividades();
                setAtividades(todasAtividades);
            } catch (err) {
                console.error("Erro ao carregar lista ou atividades", err);
            }
        };
        carregarLista();
    }, []);

    const toggleConcluido = (index) => {
        const novasAtividades = [...atividades];
        novasAtividades[index].concluido = !novasAtividades[index].concluido;
        setAtividades(novasAtividades);
    };

    const atividadesFiltradas = atividades.filter((a) =>
        a.nomeAtividade.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <Background>
            <ContainerLista>
                <Header>
                    <NomeLista>Atividades</NomeLista>
                    <Botoes>
                        <span
                            className="material-symbols-outlined"
                            id="add"
                            onClick={() => idLista && setMostrarModal(true)}
                        >
                            add
                        </span>
                    </Botoes>
                </Header>
                <Conteudo>

                    <AreaAtividades>
                        {atividadesFiltradas.map((a, index) => {
                            const isSelecionada = atividadeSelecionada?.idAtividade === a.idAtividade;
                            return (
                                <Atividade
                                    key={a.idAtividade || index}
                                    onClick={() =>
                                        setAtividadeSelecionada(isSelecionada ? null : a)
                                    }
                                    style={{
                                        backgroundColor: isSelecionada
                                            ? 'var(--cinza-claro)'
                                            : 'var(--fundo-menu-ativo)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: '20px', cursor: 'pointer' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleConcluido(index);
                                            }}
                                        >
                                            {a.concluido ? 'radio_button_checked' : 'radio_button_unchecked'}
                                        </span>
                                        {a.nomeAtividade}
                                    </div>
                                    <Prazo>
                                        {a.prazoAtividade
                                            ? new Date(a.prazoAtividade.replace(' ', 'T')).toLocaleDateString()
                                            : 'Sem prazo'}
                                    </Prazo>
                                </Atividade>
                            );
                        })}
                    </AreaAtividades>
                </Conteudo>

                <Pesquisar>
                    <span className="material-symbols-outlined">search</span>
                    <Input
                        type="text"
                        placeholder="Pesquisar..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </Pesquisar>
            </ContainerLista>

            {idLista && (
                <ModalCriarAtividade
                    isOpen={mostrarModal}
                    onClose={() => setMostrarModal(false)}
                    listaId={idLista}
                    onAtividadeCriada={() => {
                        atualizarAtividades();
                    }}
                />
            )}

            <Parte2>
                <AtividadeSelecionada
                    atividade={atividadeSelecionada}
                    onClose={() => setAtividadeSelecionada(null)}
                />
            </Parte2>
        </Background>
    );
}

export default Atividades;
