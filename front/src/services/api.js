import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000'
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

export const criarLista = async (nomeLista) => {
    const response = await api.post('/listas', {nomeLista});
    return response.data;
}

export const listarListas = async () => {
    const response = await api.get('/listas');
    return response.data;
}

export const deletarLista = async (idLista) => {
    const response = await api.delete(`/listas/${idLista}`);
    return response.data;
}

export default api;