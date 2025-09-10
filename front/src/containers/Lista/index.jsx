import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { deletarLista, listarAtividadesPorLista, listarListas } from '../../services/api.js';
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
import ModalCriarAtividade from '../ModalCriarAtividade/index.jsx';

function Lista() {
    const navigate = useNavigate();
    const { nomeLista } = useParams();

    const [idLista, setIdLista] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        const carregarLista = async () => {
            try {
                const listas = await listarListas();
                const lista = listas.find(l => l.nomeLista === nomeLista);
                if (lista) {
                    setIdLista(lista.idLista);
                    atualizarAtividades(lista.idLista);
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
            setAtividades(dados);
        } catch (err) {
            console.error("Erro ao buscar atividades da lista", err);
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
    }

    return (
        <Background>
            <ContainerLista>
                <Conteudo>
                    <Header>
                        <NomeLista>
                            {nomeLista}
                        </NomeLista>
                        <Botoes>
                            <span className="material-symbols-outlined"
                                id="delete"
                                onClick={handleExcluir}>
                                delete
                            </span>
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
                                    className="material-symbols-outlined"
                                    style={{ fontSize: "20px", cursor: "pointer" }}
                                    onClick={() => toggleConcluido(index)}
                                >
                                    {a.concluido
                                        ? "radio_button_checked"
                                        : "radio_button_unchecked"}

                                </span>
                                {a.nomeAtividade}
                                <Prazo>
                                    {a.prazoAtividade
                                        ? new Date(a.prazoAtividade.replace(" ", "T")).toLocaleDateString()
                                        : "Sem prazo"}
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
                onAtividadeCriada={(novaAtividades) => {
                    setAtividades([...atividades, { ...novaAtividades, concluido: false }]);
                }}
            />
        </Background>

    );
}

export default Lista;