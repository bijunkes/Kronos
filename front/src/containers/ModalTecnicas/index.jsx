import React, { useEffect, useState } from 'react';
import { listarAtividades, listarListas } from '../../services/api.js';
import { Overlay, AtividadeCard, ModalContainer, ModalHeader, Icones, ModalBody, Pesquisar, Prazo, Input } from './style.js';

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
                    }else if(onTecnica == "eisenhower" && !atividade.Eisenhower_idAtividadeEisenhower){
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
            <ModalContainer>
                <ModalHeader>
                    Atividades
                    <Icones onClick={onClose} className="material-symbols-outlined">
                        close
                    </Icones>
                </ModalHeader>
                <ModalBody>
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
                                {atividades.map((atividade, index) => (
                                    <AtividadeCard onClick={() => onAdicionar(atividade, idPadrao)} key={atividade.idAtividade}>
                                        <p><strong>{atividade.nomeAtividade}</strong></p>
                                        <Prazo>
                                            {atividade.prazoAtividade
                                                ? new Date(atividade.prazoAtividade.replace(' ', 'T')).toLocaleDateString()
                                                : 'Sem prazo'}
                                        </Prazo>
                                    </AtividadeCard>
                                ))}
                            </>
                        );
                    })}
                </ModalBody>
                <Pesquisar>
                    <span className="material-symbols-outlined">search</span>
                    <Input
                        type="text"
                        placeholder="Pesquisar..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </Pesquisar>
            </ModalContainer>
        </Overlay>

    );
}

export default ModalTecnicas;