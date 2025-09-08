import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ModalEisenhower(){

    const { nomeAtividade } = useParams();
    const[atividades, setAtividades] = useState([]);
    const[error,setError] = useState(null);
    const[idAtividade,setIdAtividade] = useState(null);

    useEffect(() => {

         const token = localStorage.getItem("token");
        if (!token) return;
            axios.get("http://localhost:3000/eisenhower-atividades/", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                const atividadeComEstado = res.data.map(t => ({
                    ...t,
                    concluido: false
                }));
                setAtividades(atividadeComEstado);
                if (res.data.length > 0) {
                    setIdAtividade(res.data[0].idAtividade);
                }
            })
            .catch((err) => console.error("Erro ao buscar tarefas", err));
    }, [nomeAtividade])
            

    return(
        <div>{nomeAtividade}</div>
    )
       
    }
    

export default ModalEisenhower