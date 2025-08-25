import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Background
} from './styles.js'

function Lista() {
    const { nomeLista } = useParams();
    const [tarefas, setTarefas] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token) return;

        axios.get(`http://localhost:3000/listas/${nomeLista}`, {
            headers: {Authorization: `Bearer ${token}`},
        })
        .then((res) => setTarefas(res.data))
        .catch((err) => console.error("Erro ao buscar tarefas da lista", err));
    }, [nomeLista]);

    return (
        <Background>
            
        </Background>
    );
}

export default Lista;