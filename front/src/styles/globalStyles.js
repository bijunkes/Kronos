import styled, { createGlobalStyle } from 'styled-components'

const MyGlobalStyles = createGlobalStyle`
    :root {
        --fundo-menu: #212121;
        --fundo-menu-ativo: #282828;
        --cor-texto: #ffffff;
        --fundo-parte1: #242424;
        --fundo-parte2: #2A2A2A;
        --fundo-campo: #313131;
        --cor-texto: #ffffff;
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