import axios from 'axios';
import { showOkToast } from '../components/showToast.jsx';

const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3000';

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

globalThis.__API_INTERCEPTORS__.req = api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

globalThis.__API_INTERCEPTORS__.res = api.interceptors.response.use(
  (response) => {
    if (!response.config?.__successSilent && response?.data?.message) {
      showOkToast(response.data.message, 'success', {
        id: `s:${response.config?.url}`,
      });
    }
    return response;
  },
  (error) => {
    if (error.config?.__silent) return Promise.reject(error);

    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error.message ||
      'Ocorreu um erro.';

    const status = error.response?.status || 'x';
    const url = error.config?.url || 'unknown';
    showOkToast(msg, 'error', { id: `e:${status}:${url}` });

    return Promise.reject(error);
  }
);

export const usuarioExiste = async (email) => {
  const { data } = await api.get('/usuario-existe', {
    params: { email },
    __successSilent: true,
  });
  const exists = data?.exists ?? data?.existe ?? false;
  return { exists };
};

<<<<<<< HEAD
export const solicitarResetSenha = async (email) => {
  const res = await api.post('/senha/reset-solicitar', { email });
  return res.data; 
};

export const redefinirSenha = async ({ token, novaSenha }) => {
  const res = await api.post('/senha/reset', { token, novaSenha });
  return res.data; 
};

=======
>>>>>>> semEmail
export const login = async (dados) => {
  const { data } = await api.post('/login', dados);
  return data; 
};

export const loginUsuario = async (dados) => {
  const { data } = await api.post('/login', dados, { __silent: true });
  return data;
};

export const criarAtividade = async (dados) => (await api.post('/atividades', dados)).data;

export const listarAtividades = async () => (await api.get('/atividades', { __successSilent: true })).data;

export const garantirListaAtividades = async () =>
  (await api.get('/listas/atividades', { __successSilent: true })).data;

export const listarAtividadesPorLista = async (idLista) =>
  (await api.get(`/atividades/lista/${idLista}`, { __successSilent: true })).data;

export const atualizarAtividade = async (id, dados) =>
  (await api.put(`/atividades/${id}`, dados)).data;

export const deletarAtividade = async (id) =>
  (await api.delete(`/atividades/${id}`)).data;

export const cadastrarUsuario = async (dados) =>
  (await api.post('/cadastro', dados)).data;

export const criarLista = async (nome) =>
  (await api.post('/listas', { nome })).data;

export const listarListas = async () => {
  const listas = (await api.get('/listas', { __successSilent: true })).data;
  return listas.filter((lista) => lista.nome !== 'Atividades');
};

export const deletarLista = async (id) =>
  (await api.delete(`/listas/${id}`)).data;

export const listarTodasAtividades = async () =>
  (await api.get('/atividades', { __successSilent: true })).data;

export const salvarAtividadesSessao = async (idSessao, atividades) => {
  const res = await api.post(`/pomodoro/${idSessao}/atividades`, {
    atividades: atividades.map(a => a.idAtividade)
  });
  return res.data;
};

<<<<<<< HEAD
export const listarAtividadesSessao = async (idSessao) => {
  const res = await api.get(`/pomodoro/${idSessao}/atividades`);
  return res.data;
};

export default api;
=======
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
export const atualizarIdEisenAtividade = async (id, dados) => {
  const response = await api.put(`/atividades/eisenhower/${id}`, dados);
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

export const listarTodasAtividades = async () => {
    const response = await api.get('/listas/atividades');
    return response.data;
};
export const listarAtividadesEmMatriz = async () => {
    const response = await api.get('/eisenhower/idAtividadeEisenhower');
    return response.data;
};
export const deletarAtividadeDeMatriz = async (idAtividadeEisenhower) => {
  const response = await api.delete('/eisenhower/', idAtividadeEisenhower);
  return response.data;
};
export const adicionarAtividadeEmMatriz = async (dados) => {
  const response = await api.post('/eisenhower/',dados);
  return response.data;
};
export const atualizarAtividadeEmMatriz = async (dados) => {
  const response = await api.put('/eisenhower/', dados);
  return response.data;
};

>>>>>>> semEmail
