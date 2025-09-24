import { useParams, useNavigate } from 'react-router-dom';
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
import { deletarLista, listarAtividadesPorLista, listarListas } from '../../services/api.js';
import ModalCriarAtividade from '../ModalCriarAtividade/index.jsx';
import AtividadeSelecionada from '../AtividadeSelecionada/index.jsx';

function Lista() {
    const navigate = useNavigate();
    const { nomeLista } = useParams();

    const [idLista, setIdLista] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    // Carrega o ID da lista e as atividades
    useEffect(() => {
        const carregarLista = async () => {
            try {
                const listas = await listarListas();
                const lista = listas.find(l => l.nomeLista === nomeLista);
                if (lista) {
                    setIdLista(lista.idLista);
                    await atualizarAtividades(lista.idLista);
                }
            } catch (err) {
                console.error("Erro ao buscar lista pelo nome", err);
            }
        };
        carregarLista();
    }, [nomeLista]);

    const atualizarAtividades = async (id) => {
        if (!id) return;
        try {
            const dados = await listarAtividadesPorLista(id);
            setAtividades(Array.isArray(dados) ? dados : []);
        } catch (err) {
            console.error("Erro ao buscar atividades da lista", err);
            setAtividades([]);
        }
    };

    const handleExcluir = async () => {
        if (!idLista) return;
        try {
            await deletarLista(idLista);
            window.dispatchEvent(new Event('listasAtualizadas'));
            navigate('/home');
        } catch (err) {
            console.error('Erro ao deletar lista', err);
            alert('Não foi possível deletar a lista');
        }
    };

    const toggleConcluido = (index) => {
        const novasAtividades = [...atividades];
        novasAtividades[index].concluido = !novasAtividades[index].concluido;
        setAtividades(novasAtividades);
    };

    // Criação de atividade com fetch do backend
    const handleAtividadeCriada = async (dadosAtividade) => {
        if (!idLista) return;
        try {
            // Chama a função do Modal que cria no backend
            await atualizarAtividades(idLista); // Recarrega após criação
        } catch (err) {
            console.error("Erro ao atualizar atividades:", err);
        }
    };

    return (
        <Background>
            <ContainerLista>
                <Conteudo>
                    <Header>
                        <NomeLista>{nomeLista}</NomeLista>
                        <Botoes>
                            <span
                                className="material-symbols-outlined"
                                id="delete"
                                onClick={handleExcluir}
                            >
                                delete
                            </span>
                            <span
                                className="material-symbols-outlined"
                                id="add"
                                onClick={() => setMostrarModal(true)}
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
                                    onClick={() => {
                                        if (isSelecionada) {
                                            setAtividadeSelecionada(null);
                                        } else {
                                            setAtividadeSelecionada(a);
                                        }
                                    }}
                                    style={{
                                        backgroundColor: isSelecionada
                                            ? 'var(--cinza-claro)'
                                            : 'var(--fundo-menu-ativo)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: "20px", cursor: "pointer" }}
                                            onClick={() => toggleConcluido(index)}
                                        >
                                            {a.concluido
                                                ? "radio_button_checked"
                                                : "radio_button_unchecked"}
                                        </span>
                                        {a.nomeAtividade}
                                    </div>
                                    <Prazo>
                                        {a.prazoAtividade
                                            ? new Date(a.prazoAtividade.replace(" ", "T")).toLocaleDateString()
                                            : "Sem prazo"}
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
                onAtividadeCriada={handleAtividadeCriada}
            />

            <Parte2>
                <AtividadeSelecionada
                    atividade={atividadeSelecionada}
                    onClose={() => setAtividadeSelecionada(null)}
                />
            </Parte2>
        </Background>
    );
}

export default Lista;
