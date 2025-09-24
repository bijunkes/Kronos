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
    Parte2
} from './styles.js';
import { listarAtividadesPorLista, listarListas, listarAtividades } from '../../services/api.js';
import ModalCriarAtividade from '../ModalCriarAtividade/index.jsx';
import AtividadeSelecionada from '../AtividadeSelecionada/index.jsx';

function Atividades() {
    const [idLista, setIdLista] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    const atualizarAtividades = async (id) => {
        if (!id) return;
        try {
            const dados = await listarAtividadesPorLista(id);
            setAtividades(dados);
        } catch (err) {
            console.error("Erro ao buscar atividades", err);
        }
    };

    useEffect(() => {
    const fetchTodasAtividades = async () => {
        try {
            const todas = await listarAtividades(); // Buscar todas as atividades do usuário
            setAtividades(Array.isArray(todas) ? todas : []);
        } catch (err) {
            console.error("Erro ao buscar todas as atividades", err);
            setAtividades([]);
        }
    };
    fetchTodasAtividades();
}, []);


    // 2️⃣ Toggle concluído
    const toggleConcluido = (index) => {
        const novasAtividades = [...atividades];
        novasAtividades[index].concluido = !novasAtividades[index].concluido;
        setAtividades(novasAtividades);
    };

    return (
        <Background>
            <ContainerLista>
                <Conteudo>
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
                    <AreaAtividades>
                        {atividades.map((a, index) => {
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
                                            onClick={(e) => toggleConcluido(index, e)}
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
            </ContainerLista>

            {idLista && (
                <ModalCriarAtividade
                    isOpen={mostrarModal}
                    onClose={() => setMostrarModal(false)}
                    listaId={idLista}
                    onAtividadeCriada={() => {
                        atualizarAtividades(idLista);
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
