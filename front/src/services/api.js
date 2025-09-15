import axios from 'axios';
import { showOkToast } from '../components/showToast.jsx';

const API_URL = 'http://localhost:3000';
const api = axios.create({ baseURL: API_URL });

if (!globalThis.__API_INTERCEPTORS__) {
  globalThis.__API_INTERCEPTORS__ = { req: null, res: null };
}

//se já existe um receptor registrado, ele é removido antes de criar outro
if (globalThis.__API_INTERCEPTORS__.req !== null) {
  api.interceptors.request.eject(globalThis.__API_INTERCEPTORS__.req);
}
if (globalThis.__API_INTERCEPTORS__.res !== null) {
  api.interceptors.response.eject(globalThis.__API_INTERCEPTORS__.res);
}

globalThis.__API_INTERCEPTORS__.req = api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

globalThis.__API_INTERCEPTORS__.res = api.interceptors.response.use(
  (response) => {
    // Mostra toast de sucesso só quando o backend retornar { message }
    if (response?.data?.message) {
      // id estável por rota evita duplicação
      showOkToast(response.data.message, 'success', { id: `s:${response.config?.url}` });
    }
    return response;
  },
  (error) => {
    // Permite que chamadas específicas suprimam o toast do interceptor
    if (error.config?.__silent) return Promise.reject(error);

    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error.message ||
      'Ocorreu um erro.';

    // id estável por status+rota evita toasts repetidos
    const status = error.response?.status || 'x';
    const url = error.config?.url || 'unknown';
    showOkToast(msg, 'error', { id: `e:${status}:${url}` });

    return Promise.reject(error);
  }
);


export const usuarioExiste = async (email) => {
  const response = await api.get('/usuario-existe', { params: { email } });
  return response.data; // { existe: true/false }
};

export const solicitarResetSenha = async (email) => {
  const res = await api.post('/senha/reset-solicitar', { email });
  return res.data;
};

export const redefinirSenha = async ({ token, novaSenha }) => {
  const res = await api.post('/senha/reset', { token, novaSenha });
  return res.data;
};

export const login = async (dados) => {
  const response = await api.post('/login', dados);
  return response.data;
};


export const loginUsuario = async (dados) => {
  const response = await api.post('/login', dados, { __silent: true });
  return response.data;
};

export const criarAtividade = async (dados) => {
  const response = await api.post('/atividades', dados);
  return response.data;
};

export const listarAtividades = async () => {
  const response = await api.get('/atividades');
  return response.data;
};

export const garantirListaAtividades = async () => {
    const response = await api.get('/listas/atividades');
    return response.data;
};

export const listarAtividadesPorLista = async (idLista) => {
  const response = await api.get(`/atividades/lista/${idLista}`);
  return response.data;
};

export const atualizarAtividade = async (id, dados) => {
  const response = await api.put(`/atividades/${id}`, dados);
  return response.data;
};

export const deletarAtividade = async (id) => {
  const response = await api.delete(`/atividades/${id}`);
  return response.data;
};

export default api;


export const cadastrarUsuario = async (dados) => (await api.post('/cadastro', dados)).data;
export const criarLista = async (nome) => (await api.post('/listas', { nome })).data;
export const listarListas = async () => {
  const listas = (await api.get('/listas')).data;
  return listas.filter(lista => lista.nome !== "Atividades");
};
export const deletarLista = async (id) => (await api.delete(`/listas/${id}`)).data;
