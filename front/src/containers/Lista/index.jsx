import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { deletarLista } from '../../services/api.js';
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

function Lista() {
    const { nomeLista } = useParams();
    const [idLista, setIdLista] = useState(null);
    const [atividade, setAtividade] = useState([]);
    const [concluido, setConcluido] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.get(`http://localhost:3000/listas/${nomeLista}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                const atividadeComEstado = res.data.map(t => ({
                    ...t,
                    concluido: false
                }));
                setAtividade(atividadeComEstado);
                if (res.data.length > 0) {
                    setIdLista(res.data[0].idLista);
                }
            })
            .catch((err) => console.error("Erro ao buscar tarefas da lista", err));
    }, [nomeLista]);

    async function handleExcluir() {
        if (!idLista) return;

        try {
            await deletarLista(idLista);
            alert('Lista deletada com sucesso');
        } catch (err) {
            console.error('Erro ao deletar lista', err);
            alert('Não foi possível deletar a lista');
        }
    }

    function toggleConcluido() {
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
                            <span class="material-symbols-outlined"
                            id="delete">
                                delete
                            </span>
                            <span class="material-symbols-outlined"
                            id="add">
                                add
                            </span>
                        </Botoes>
                    </Header>
                    <AreaAtividades>
                        {atividade.map((a, index) => (
                            <Atividade key={atividade.idAtividade || index}>
                                <span
                                    class="material-symbols-outlined"
                                    style={{ fontSize: "20px", cursor: "pointer" }}
                                    onClick={toggleConcluido(index)}
                                >
                                    {atividade.concluido
                                        ? "radio_button_checked"
                                        : "radio_button_unchecked"}

                                </span>
                                {atividade.nomeAtividade}
                            </Atividade>
                        ))}
                    </AreaAtividades>
                </Conteudo>
            </ContainerLista>
        </Background>
    );
}

export default Lista;