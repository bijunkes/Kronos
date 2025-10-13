import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Header, NomeAtividade, Status, Datas, Data } from './styles.js'

function AtividadeSelecionada({ atividade, onClose }) {
    if (!atividade) return null;

    return (
        <Container>
            <Header>
                <NomeAtividade>
                    {atividade.nomeAtividade}
                </NomeAtividade>
                <Status>
                    A concluir
                </Status>
                <Datas>
                    <Data>
                        Prazo: {new Date(atividade.prazoAtividade).toLocaleDateString("pt-BR", { timeZone: "UTC", })}
                    </Data>
                    <Data>
                        Conclusão: 
                    </Data>
                </Datas>
            </Header>
        </Container>
    );
}

export default AtividadeSelecionada;