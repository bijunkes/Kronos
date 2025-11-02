import axios from 'axios';
import { showOkToast } from '../components/showToast.jsx';


const API_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:3000'
).replace(/\/+$/, '');


const api = axios.create({ baseURL: API_URL });


if (!globalThis.__API_INTERCEPTORS__) globalThis.__API_INTERCEPTORS__ = { req: null, res: null };
if (globalThis.__API_INTERCEPTORS__.req !== null) api.interceptors.request.eject(globalThis.__API_INTERCEPTORS__.req);
if (globalThis.__API_INTERCEPTORS__.res !== null) api.interceptors.response.eject(globalThis.__API_INTERCEPTORS__.res);


globalThis.__API_INTERCEPTORS__.req = api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


globalThis.__API_INTERCEPTORS__.res = api.interceptors.response.use(
  (response) => {
    if (!response.config?.__successSilent && response?.data?.message) {
      showOkToast(response.data.message, 'success', { id: `s:${response.config?.url}` });
    }
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';
    const method = (error?.config?.method || 'get').toLowerCase();
    const isAuthFlow = /\/usuarios\/(login|cadastro|senha\/reset(?:-solicitar)?|verificar-email|usuario-existe)\b/.test(url)
                    || /\/(login|cadastro)\b/.test(url);


    const skip401 = !!error?.config?.__skip401 || isAuthFlow;


    if (status === 401) {
      if (skip401) {
        return Promise.reject(error);
      }
      try { localStorage.removeItem('token'); } catch {}
      showOkToast('Sua sessão expirou. Faça login novamente.', 'error', { id: 'auth:401' });
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
      return Promise.reject(error);
    }


    if (error.config?.__silent) return Promise.reject(error);


    const msg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error.message ||
      'Ocorreu um erro.';
    showOkToast(msg, 'error', {
      id: `e:${status || 'x'}:${url}`,
    });


    return Promise.reject(error);
  }
);


export const usuarioExiste = async (email) => {
  const { data } = await api.get('/usuario-existe', {
    params: { email },
    __successSilent: true,
  });
  return { exists: data?.exists ?? data?.existe ?? false };
};




export const solicitarResetSenha = async (email) =>
  (await api.post('/senha/reset-solicitar', { email })).data;


export const redefinirSenha = async ({ token, novaSenha }) =>
  (await api.post('/senha/reset', { token, novaSenha }, { withCredentials: true })).data;



export const loginUsuario = async (dados) =>
  (await api.post('/login', dados, { __silent: true, __skip401: true })).data;


export const login = async (dados) =>
  (await api.post('/login', dados, { __skip401: true} )).data;


export const cadastrarUsuario = async (dados) =>
  (await api.post('/cadastro', dados, {__skip401: true})).data;


export const getPerfil = async () =>
  (await api.get('/me', { __successSilent: true })).data;


export const atualizarPerfil = async (dados, opts = {}) => {
  const cfg = opts.silentSuccess ? {__successSilent: true} : {};
   return (await api.put('/me', dados, cfg)).data;

}


export const excluirConta = async () =>
  (await api.delete('/usuarios/me')).data;




export const criarAtividade = async (dados) =>
  (await api.post('/atividades', dados)).data;


export const listarAtividades = async () =>
  (await api.get('/atividades', { __successSilent: true })).data;


export const listarAtividadesPorLista = async (idLista) =>
  (await api.get(`/atividades/lista/${idLista}`, { __successSilent: true })).data;


export const atualizarAtividade = async (id, dados) =>
  (await api.put(`/atividades/${id}`, dados)).data;


export const deletarAtividade = async (id) =>
  (await api.delete(`/atividades/${id}`)).data;


export const garantirListaAtividades = async () =>
  (await api.get('/listas/atividades', { __successSilent: true })).data;


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




export const listarAtividadesSessao = async (idSessao) => {
  const res = await api.get(`/pomodoro/${idSessao}/atividades`);
  return res.data;
};




export const atualizarIdEisenAtividade = async (id, dados) => {
  const response = await api.put(`/atividades/eisenhower/${id}`, dados);
  return response.data;
};

export const atualizarIdKanbanAtividade = async (id, dados) => {
  const response = await api.put(`/atividades/kanban/${id}`, dados);
  return response.data;
};


export const listarAtividadesEmMatriz = async () => {
    const response = await api.get('/eisenhower/idAtividadeEisenhower');
    return response.data;
};
export const deletarAtividadeDeMatriz = async (idAtividadeEisenhower) => {
  const response = await api.delete(`/eisenhower/${idAtividadeEisenhower}`);
  return response.data;
};
export const adicionarAtividadeEmMatriz = async (dados) => {
  const response = await api.post('/eisenhower/',dados);
  return response.data;
};
export const atualizarAtividadeEmMatriz = async (id, classificacao, dataAlteracao) => {
  const response = await api.put(`/eisenhower/${id}/${classificacao}/${dataAlteracao}`);
  return response.data;
};

export const contaEmMatrizPorClassificacao = async (classificacao, dataAlteracao) => {
  const response = await api.get(`/eisenhower/contagem/${classificacao}/${dataAlteracao}`);
  return response.data;
};

export const listarAtividadesEmKanban = async () => {
    const response = await api.get('/kanban/idAtividadeKanban');
    return response.data;
};
export const deletarAtividadeDeKanban = async (idAtividadeKanban) => {
  const response = await api.delete(`/kanban/${idAtividadeKanban}`);
  return response.data;
};
export const adicionarAtividadeEmKanban = async (dados) => {
  const response = await api.post('/kanban/',dados);
  return response.data;
};
export const atualizarAtividadeEmKanban = async (id, classificacao, dataAlteracao) => {
  const response = await api.put(`/kanban/${id}/${classificacao}/${dataAlteracao}`);
  return response.data;
};

export const enviarIcone = async (file) => {
  const fd = new FormData();
  fd.append('icon', file);
  return (await api.put('/usuarios/me/icon', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })).data;
};

export const removerIcone = async () =>
  (await api.delete('/usuarios/me/icon')).data;


export default api;



