import React from 'react';
import {Container, Titulo, Data, Progresso, Pomodoro} from './style'

function RelatorioDiario() {
    return(
        <>
        <Container>
            <Titulo>Relatório Diário</Titulo>
            <Data></Data>
            <Progresso></Progresso>
            <Pomodoro></Pomodoro>
        </Container>
        </>
    )
}

export default RelatorioDiario;