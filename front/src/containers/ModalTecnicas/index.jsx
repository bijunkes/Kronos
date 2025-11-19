import React, { useEffect, useState } from 'react';
import { listarAtividades, listarListas } from '../../services/api.js';
import {
    Overlay,
    AreaAtividades,
    Atividade,
    Prazo,
    Input,
    ModalHeader,
    Pesquisar,
    ContainerLista,
    Conteudo,
} from './style.js';

function ModalTecnicas({ onClose, onAdicionar, onTecnica }) {
    const [atividades, setAtividades] = useState([]);
    const [erro, setErro] = useState(null);
    const [filtro, setFiltro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [idPadrao, setIdPadrao] = useState(null);
    const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

    const buscarAtividades = async () => {
        setCarregando(true);
        try {

            const atvsNaoConcluidas = []
            const todasAtividades = await listarAtividades();
            todasAtividades.forEach(atividade => {
                if (atividade.statusAtividade !== 1) {
                    if (onTecnica == "kanban" && !atividade.Kanban_idAtividadeKanban) {
                        atvsNaoConcluidas.push(atividade)
                    } else if (onTecnica == "eisenhower" && !atividade.Eisenhower_idAtividadeEisenhower) {
                        atvsNaoConcluidas.push(atividade)
                    }

                }

            });
            setAtividades(atvsNaoConcluidas);
        } catch (err) {
            console.error('Erro ao carregar todas as atividades', err);
            setErro('Erro ao carregar as atividades.');
        } finally {
            setCarregando(false);
        }
    };

    const carregarListaPadrao = async () => {
        try {
            const listas = await listarListas();
            const listaPadrao = listas.find(l => l.nome === "Atividades");
            if (listaPadrao) setIdPadrao(listaPadrao.idLista);
        } catch (err) {
            console.error("Erro ao buscar lista padrão: ", err);
        }
    };

    const atividadesFiltradas = atividades.filter((a) =>
        a.nomeAtividade.toLowerCase().includes(filtro.toLowerCase())
    );

    useEffect(() => {
        buscarAtividades();
        carregarListaPadrao();
    }, []);



    return (
        <Overlay>
            <ContainerLista>
                <ModalHeader>
                    Atividades
                    <span className="material-symbols-outlined" onClick={onClose}>
                        close
                    </span>
                </ModalHeader>
                <Conteudo>
                    <AreaAtividades>
                        {carregando && <p>Carregando...</p>}
                        {erro && <p style={{ color: 'red' }}>{erro}</p>}
                        {atividades.length === 0 && !carregando && !erro && <p>Nenhuma atividade disponível.</p>}
                        {atividadesFiltradas.length === 0 && (
                            <div style={{ padding: '1rem', color: '#999' }}>
                                Nenhuma atividade encontrada.
                            </div>
                        )}

                        {atividadesFiltradas.map((a, index) => {
                            const isSelecionada = atividadeSelecionada?.idAtividade === a.idAtividade;
                            return (
                                <>
                                   
                                        <Atividade onClick={() => onAdicionar(a, idPadrao)} key={a.idAtividade}>
                                            <p><strong>{a.nomeAtividade}</strong></p>
                                            <Prazo>
                                                {a.prazoAtividade
                                                    ? new Date(a.prazoAtividade.replace(' ', 'T')).toLocaleDateString()
                                                    : 'Sem prazo'}
                                            </Prazo>
                                        </Atividade>
                                    
                                </>
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
        </Overlay>

    );
}

export default ModalTecnicas;