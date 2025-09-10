
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { listarAtividades, listarListas, criarLista } from '../../services/api.js';
import {Overlay, AtividadeCard,ModalContainer, ModalHeader} from './style.js'

function ModalEisenhower(){

   
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
                <ModalHeader>Atividades</ModalHeader>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {atividades.map((atividade, index) => (
                    <AtividadeCard key={atividade.idAtividade || index}>
                        <p>  <strong>{atividade.nome || "Sem nome"}</strong></p>
              
                    </AtividadeCard>
                ))}
            </ModalContainer>
            
        </Overlay>
    )
       
    }
    

export default ModalEisenhower;