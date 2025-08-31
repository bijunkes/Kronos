import axios from 'axios';
import { showOkToast } from '../components/showToast.jsx';

const API_URL = 'http://localhost:3000';
const api = axios.create({ baseURL: API_URL });

if (!globalThis.__API_INTERCEPTORS__) {
  globalThis.__API_INTERCEPTORS__ = { req: null, res: null };
}

if (globalThis.__API_INTERCEPTORS__.req !== null) {
  api.interceptors.request.eject(globalThis.__API_INTERCEPTORS__.req);
}
if (globalThis.__API_INTERCEPTORS__.res !== null) {
  api.interceptors.response.eject(globalThis.__API_INTERCEPTORS__.res);
}

// Request: token
globalThis.__API_INTERCEPTORS__.req = api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response: toasts
globalThis.__API_INTERCEPTORS__.res = api.interceptors.response.use(
  (response) => {
    // Mostra toast só quando backend mandar { message }
    if (response?.data?.message) {
      showOkToast(response.data.message, 'success');
    }
    return response;
  },
  (error) => {
    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error.message ||
      'Ocorreu um erro.';
    showOkToast(msg, 'error');
    return Promise.reject(error);
  }
);
export const usuarioExiste = async (email) => {
  const response = await api.get('/usuario-existe', { params: { email } });
  return response.data; // { exists: true/false }
};

export const solicitarResetSenha = async (email) => {
  const res = await api.post('/senha/reset-solicitar', { email });
  return res.data;
};

export const redefinirSenha = async ({ token, novaSenha }) => {
  const res = await api.post('/senha/reset', { token, novaSenha });
  return res.data;
};

export default api;

export const cadastrarUsuario = async (dados) => (await api.post('/cadastro', dados)).data;
export const loginUsuario      = async (dados) => (await api.post('/login', dados)).data;
export const criarLista        = async (nome)  => (await api.post('/listas', { nome })).data;
export const listarListas      = async ()      => (await api.get('/listas')).data;
export const deletarLista      = async (id)    => (await api.delete(`/listas/${id}`)).data;
