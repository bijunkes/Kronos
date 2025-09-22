import React, { useEffect, useState } from 'react';
import { listarAtividades, listarListas } from '../../services/api.js';  // Certifique-se de importar listarListas
import { Overlay, AtividadeCard, ModalContainer, ModalHeader, Icones, ModalBody } from './style.js';

function ModalTecnicas({ onClose, onAdicionar}) {
    const [atividades, setAtividades] = useState([]);
    const [erro, setErro] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [idPadrao, setIdPadrao] = useState(null);

    const buscarAtividades = async () => {
        setCarregando(true);
        try {
            const todasAtividades = await listarAtividades(); 
            setAtividades(todasAtividades);
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

    useEffect(() => {
        buscarAtividades();
        carregarListaPadrao(); // Agora a função está sendo chamada de forma independente
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
                    {atividades.map((atividade, index) => (
                        <AtividadeCard onClick={onAdicionar} key={atividade.idAtividade || index}>
                            <p><strong>{atividade.nomeAtividade || "Sem nome"}</strong></p>
                        </AtividadeCard>
                    ))}
                </ModalBody>
            </ModalContainer>
        </Overlay>
    );
}

export default ModalTecnicas;
