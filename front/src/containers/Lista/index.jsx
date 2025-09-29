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
    Parte2,
    Pesquisar,
    Input
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
    const [filtro, setFiltro] = useState("");

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

    const handleAtividadeCriada = async () => {
        if (!idLista) return;
        await atualizarAtividades(idLista);
    };

    // ======= FILTRAR ATIVIDADES =======
    const atividadesFiltradas = atividades.filter((a) =>
        a.nomeAtividade.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <Background>
            <ContainerLista>
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

                <Conteudo>
                    <AreaAtividades>
                        {atividadesFiltradas.map((a, index) => {
                            const isSelecionada = atividadeSelecionada?.idAtividade === a.idAtividade;
                            return (
                                <Atividade
                                    key={a.idAtividade || index}
                                    onClick={() => setAtividadeSelecionada(isSelecionada ? null : a)}
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
                                            ? new Date(a.prazoAtividade.replace(" ", "T")).toLocaleDateString()
                                            : "Sem prazo"}
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
