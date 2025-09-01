import styled, { createGlobalStyle } from 'styled-components'

const MyGlobalStyles = createGlobalStyle`
    :root {
        --fundo: #1b1b1b;
        --fundo-menu: #212121;
        --fundo-menu-ativo: #282828;
        --cor-texto: #ffffff;
        --fundo-parte1: #242424;
        --fundo-parte2: #2A2A2A;
        --fundo-campo: #313131;
        --cinza-claro: #353535;
        --cor-texto: #ffffff;
        --Importante-Urgente: #B3261E;
        --botao-Importante-Urgente:
        --NaoImportante-Urgente: #007AFF;
        --botao-NaoImportante-Urgente:
        --Importante-NaoUrgente: #FFCC00;
        --botao-Importante-NaoUrgente:
        --NaoImportante-NaoUrgente: #34C759;
        --botao-NaoImportante-NaoUrgente:
    }

    * {
        font-family: 'Roboto', sans-serif;
        list-style: none;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        min-height: 100vh;
        width: 100vw;
    }
    
    button, form {
        all: unset;
        display: inline-block;
    }

    input {
        all: unset;
    }
`

export default MyGlobalStyles