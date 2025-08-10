import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'
import {
    Container,
    Parte1,
    Logo,
    LeftAlign,
    Negrito,
    Opaco,
    ButtonEntrar,
    Parte2,
    Form,
    Negrito2,
    Opaco2,
    Input,
    ButtonCadastrar,
} from './styles.js';
import Axios from 'axios';
import api from '../../../services/API.js'

function Cadastro() {

    let user = []
    const navigate = useNavigate()

    const [nome, setNome] = useState('');
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const [formData, setFormData] = useState({

        nome: "",
        email:"",
        senha:"",
        username:"",

    })

    async function handleSubmit(e) {
        
    }

    async function getUsers(params) {
        
      const usersFromAPI =  await api.get('/usuarios')

      users = usersFromAPI.data

      console.log(users)
    }

    function handleEntrar() {
        navigate('/login')
    }

    const handleFormEdit = (event, name) => {

        setFormData(...formData,
            [name]= event.target.value
        )

    }

    const handleForm = async(event) => {

        try{

            event.preventDefault()
            const response = await fetch

        }catch{

        }


    }

    const handleClickButton = () => {

        Axios.post("http://localhost:3000/cadastro", {

            nome: formData.nome,
            email: formData.email,
            senha: formData.senha,
            username: formData.username,

        }).then((response) => {

            console.log(response)

        })
    }

    return (
        <Container>
            <Parte1>
                <Logo>KRONOS</Logo>
                <LeftAlign>
                    <Negrito>Bem-vindo <br />de volta!</Negrito>
                    <Opaco>Acesse sua conta agora mesmo.</Opaco>
                </LeftAlign>
                <ButtonEntrar onClick={handleEntrar}>ENTRAR</ButtonEntrar>
            </Parte1>
            <Parte2>

                <Form onSubmit={handleSubmit}>
                    <Negrito2>Crie uma conta</Negrito2>
                    <Opaco2>Preencha seus dados.</Opaco2>
                    <Input
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        requiredvalue = {formData.nome}
                        onChange = {(e) => {handleFormEdit(e,'name')}}
                    />
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        requiredvalue={formData.username}
                        onChange= {(e) => {handleFormEdit(e,'name')}}
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        requiredvalue={formData.email}
                        onChange= {(e) => {handleFormEdit(e,'name')}}
                    />
                    <Input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        requiredvalue={formData.senha}
                        onChange= {(e) => {handleFormEdit(e,'name')}}
                    />
                    <ButtonCadastrar type="submit" onClick={() => handleClickButton()}>CADASTRAR</ButtonCadastrar>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </Form>
            </Parte2>
        </Container>

    )
}

export default Cadastro;