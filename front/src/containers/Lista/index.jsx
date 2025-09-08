import { useParams } from 'react-router-dom';
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
    Atividade
} from './styles.js'
import ModalCriarAtividade from '../ModalCriarAtividade/index.jsx';

function Lista() {
    const { nomeLista } = useParams();
    const [idLista, setIdLista] = useState(null);
    const [atividade, setAtividade] = useState([]);

    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        carregarIdLista();
    }, [nomeLista]);

    const carregarIdLista = async () => {
        try {
            const listas = await listarListas();
            const lista = listas.find(l => l.nome === nomeLista);
            if (lista) setIdLista(lista.idLista);
        } catch (err) {
            console.error("Erro ao buscar lista pelo nome", err);
        }
    };

    const atualizarLista = async () => {
        if (!idLista) return;
        try {
            const atividades = await listarAtividadesPorLista(idLista);
            setAtividade(atividades);
        } catch (err) {
            console.error("Erro ao buscar atividades da lista", err);
        }
    }

    const handleExcluir = async () => {
        if (!idLista) return;

        try {
            await deletarLista(idLista);
            alert('Lista deletada com sucesso');
        } catch (err) {
            console.error('Erro ao deletar lista', err);
            alert('Não foi possível deletar a lista');
        }
    };

    function toggleConcluido(index) {
        const novasAtividade = [...atividade];
        novasAtividade[index].concluido = !novasAtividade[index].concluido;
        setAtividade(novasAtividade);
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
                        {atividade.map((a, index) => (
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
                            </Atividade>
                        ))}
                    </AreaAtividades>
                </Conteudo>
            </ContainerLista>
            <ModalCriarAtividade
                isOpen={mostrarModal}
                onClose={() => setMostrarModal(false)}
                listaId={idLista}
                onAtividadeCriada={() => {
                    atualizarLista();
                }}
            />
        </Background>

    );
}

export default Lista;