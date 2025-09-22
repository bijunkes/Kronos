
import React, { useEffect, useState } from 'react';
import { listarAtividades } from '../../services/api.js';
import {Overlay, AtividadeCard,ModalContainer, ModalHeader, Icones, ModalBody} from './style.js'

function ModalTecnicas({onClose}){

   
    const[atividades, setAtividades] = useState([]);
    const[error, setError] = useState(null);
    
    const fetchAtividades = async () => {
            try {
                const atividades = await listarAtividades();
                setAtividades(atividades);
            } catch (error) {
                console.error("Erro ao buscar atividades", error);
                setError("Erro ao buscar atividades");
            }
        }

    useEffect(() => {

         fetchAtividades();
    }, [])
            

    return(
        
        <Overlay>
            <ModalContainer>
                <ModalHeader>Atividades
                    <Icones onClick={onClose} className="material-symbols-outlined">
                                close
                            </Icones>
                </ModalHeader>
                <ModalBody>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {atividades.map((atividade, index) => (
                    <AtividadeCard key={atividade.idAtividade || index}>
                        <p>  <strong>{atividade.nome || "Sem nome"}</strong></p>
              
                    </AtividadeCard>
                ))}
                </ModalBody>
                
            </ModalContainer>
            
        </Overlay>
    )
       
    }
    

export default ModalTecnicas;