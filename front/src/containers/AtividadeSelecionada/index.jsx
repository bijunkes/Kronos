import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Container, Header, NomeAtividade, Status
    
} from './styles.js'

function AtividadeSelecionada({ atividade, onClose }) {
    if (!atividade) return null; 

    return (
        <Container>
            <Header>
                <NomeAtividade>
                    {atividade.nomeAtividade}
                </NomeAtividade>
                <Status>
                    A fazer
                </Status>
            </Header>
        </Container>
    );
}

export default AtividadeSelecionada;