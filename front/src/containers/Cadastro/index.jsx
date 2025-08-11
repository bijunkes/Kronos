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
import api from '../services/api.js';

function Cadastro() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        nome: "",
        email:"",
        senha:"",
        username:"",
    })
    const [error, setError] = useState("");

    const handleFormEdit = (event, name) => {

        setFormData({
            ...formData,
            [name]: event.target.value
    });

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/cadastro", formData);
            console.log("Usuário cadastrado:", response.data);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao cadastrar");
        }
    }

    /*
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
    */

    return (
        <Container>
            <Parte1>
                <Logo>KRONOS</Logo>
                <LeftAlign>
                    <Negrito>Bem-vindo <br />de volta!</Negrito>
                    <Opaco>Acesse sua conta agora mesmo.</Opaco>
                </LeftAlign>
                <ButtonEntrar onClick={() => navigate('/login')}>ENTRAR</ButtonEntrar>
            </Parte1>
            <Parte2>

                <Form onSubmit={handleSubmit}>
                    <Negrito2>Crie uma conta</Negrito2>
                    <Opaco2>Preencha seus dados.</Opaco2>
                    <Input
                        type="text"
                        placeholder="Nome"
                        value={formData.nome}
                        required
                        onChange = {(e) => {handleFormEdit(e,'nome')}}
                    />
                    <Input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        required
                        onChange= {(e) => {handleFormEdit(e,'username')}}
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        required
                        onChange= {(e) => {handleFormEdit(e,'email')}}
                    />
                    <Input
                        type="password"
                        placeholder="Senha"
                        value={formData.senha}
                        required
                        onChange= {(e) => {handleFormEdit(e,'senha')}}
                    />
                    <ButtonCadastrar type="submit">CADASTRAR</ButtonCadastrar>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </Form>
            </Parte2>
        </Container>

    )
}

export default Cadastro;