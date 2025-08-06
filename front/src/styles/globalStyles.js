import styled, { createGlobalStyle }from 'styled-components'

const MyGlobalStyles = createGlobalStyle `
    :root {
        --fundo-menu: #212121;
        --fundo-menu-ativo: #282828;
        --cor-texto: #ffffff;
    }

    * {
        font-family: 'Roboto', sans-serif;
        list-style: none;
        margin: 0;
        padding: 0;
    }
`

export default MyGlobalStyles