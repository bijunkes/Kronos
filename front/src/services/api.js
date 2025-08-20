import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const cadastrarUsuario = async (dados) => {
    const response = await api.post("/cadastro", dados);
    return response.data;
}

export const criarLista = async (nome) => {
    const response = await api.post(`/listas`, {nome});
    return response.data;
}

export const listarListas = async () => {
    const response = await api.get(`/listas`);
    return response.data;
}

export const deletarLista = async (idLista) => {
    const response = await api.delete(`/listas/${idLista}`);
    return response.data;
}

export default api;