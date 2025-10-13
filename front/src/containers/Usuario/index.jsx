import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  Header,
  Avatar,
  HeaderText,
  Form,
  Field,
  Label,
  Input,
  InputWithIcon,
  EyeIcon,
  ButtonRow,
  Button,
  Loading,
} from './style';


import olhoAberto from '../../assets/olhoAberto.png';
import olhoFechado from '../../assets/olhoFechado.png';
import defaultUserImage from '../../assets/defaultUserImage.jpg';


import { getPerfil, atualizarPerfil, excluirConta } from '../../services/api.js';
import { showOkToast } from '../../components/showToast.jsx';
import toast from 'react-hot-toast';


function Usuario() {
  const navigate = useNavigate();


  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [mostraSenha, setMostraSenha] = useState(false);


  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [orig, setOrig] = useState(null);


  const nomeRef = useRef(null);


  useEffect(() => {
    (async () => {
      try {
        const p = await getPerfil();
        setNome(p.nome || '');
        setUsername(p.username || '');
        setEmail(p.email || '');
        setOrig({ nome: p.nome || '', username: p.username || '', email: p.email || '' });
      } catch (e) {
        showOkToast(e?.message || 'Erro ao carregar perfil', 'error');
      } finally {
        setCarregando(false);
      }
    })();
  }, []);


  function onEditar() {
    setEditando(true);
    setSenha('');
    setMostraSenha(false);
    setTimeout(() => nomeRef.current?.focus(), 0);
  }


  function onCancelar() {
    if (orig) {
      setNome(orig.nome);
      setUsername(orig.username);
      setEmail(orig.email);
    }
    setSenha('');
    setMostraSenha(false);
    setEditando(false);
  }


  async function onSalvar(e) {
  e.preventDefault();


const payload = {};
  const mudouNome   = orig && nome !== orig.nome;
  const mudouEmail  = orig && email !== orig.email;
  const mudouUser   = orig && username !== orig.username;
  const temSenha    = !!(senha && String(senha).trim());


  if (mudouNome)  payload.nome = nome;
  if (mudouEmail) payload.email = email;
  if (mudouUser)  payload.username = username;
  if (temSenha)   payload.senha = String(senha).trim();


  if (Object.keys(payload).length === 0) {
    showOkToast('Nada para atualizar.', 'success');
    setEditando(false);
    setSenha('');
    setMostraSenha(false);
    return;
  }


  try {
    const tid = toast.loading('Salvando...', { position: 'top-center' });
    const resp = await atualizarPerfil(payload);
    toast.dismiss(tid);


    if (mudouEmail || resp?.pendingEmail) {
      showOkToast('Uma mensagem de confirmação foi enviada ao seu novo e-mail.', 'success');
    } else {
      showOkToast(resp?.message || 'Perfil atualizado com sucesso!', 'success');
    }


    const u = resp?.user || { nome, username, email };
    setOrig({ nome: u.nome, username: u.username, email: u.email });
    setNome(u.nome);
    setUsername(u.username);
    setEmail(u.email);


    setEditando(false);
    setSenha('');
    setMostraSenha(false);
  } catch (err) {
    toast.dismiss();
    showOkToast(
      err?.response?.data?.error || err?.message || 'Não foi possível atualizar o perfil.',
      'error'
    );
  }
}


  function confirmToast(
    message,
    { confirmText = 'Excluir conta', cancelText = 'Cancelar', width = 520 } = {}
  ) {
    return new Promise((resolve) => {
      let settled = false;


      const id = toast(
        (t) => (
          <div
            style={{
              width: '100%',
              color: '#000',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, whiteSpace: 'pre-line', color: '#000' }}>{message}</p>


            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginTop: 16,
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  settled = true;
                  resolve(true);
                  toast.dismiss(t.id);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: '1px solid #137511',
                  background: '#167f14',
                  color: '#ffffff',
                  cursor: 'pointer',
                  minWidth: 160,
                }}
              >
                {confirmText}
              </button>


              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  settled = true;
                  resolve(false);
                  toast.dismiss(t.id);
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: '1px solid #681212',
                  background: '#7c1414',
                  color: '#ffffff',
                  cursor: 'pointer',
                  minWidth: 160,
                }}
              >
                {cancelText}
              </button>
            </div>
          </div>
        ),
        {
          position: 'top-center',
          duration: Infinity,
          style: { background: '#fff', color: '#000', width, minWidth: width, maxWidth: 'none' },
          onClose: () => { if (!settled) resolve(false); },
        }
      );
    });
  }


  async function onExcluir() {
    const confirma = await confirmToast(
      'Tem certeza que deseja excluir sua conta?\nEssa ação não pode ser desfeita.',
      { confirmText: 'Excluir conta', cancelText: 'Cancelar' }
    );
    if (!confirma) return;


    try {
      const tid = toast.loading('Excluindo conta...', { position: 'top-center' });
      await excluirConta();
      toast.dismiss(tid);
      localStorage.removeItem('token');
      navigate('/cadastro');
    } catch (err) {
      showOkToast(
        err?.response?.data?.error || err?.message || 'Não foi possível excluir a conta.',
        'error'
      );
    }
  }


  return (
    <Container>
      <Card>
        <Header>
          <Avatar>
            <img src={defaultUserImage} alt="Foto do usuário" />
          </Avatar>


          <HeaderText>
            <h2>Meu Perfil</h2>
            <p>Gerencie suas informações</p>
          </HeaderText>
        </Header>


        {carregando ? (
          <Loading>Carregando…</Loading>
        ) : (
          <Form onSubmit={(e) => e.preventDefault()}>
            <Field>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                ref={nomeRef}
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                readOnly={!editando}
              />
            </Field>


            <Field>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="@usuario"
                value={username}
                readOnly // imutável no backend
              />
            </Field>


            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!editando}
              />
            </Field>


            <Field>
              <Label htmlFor="senha">Senha</Label>
              <InputWithIcon>
                <Input
                  id="senha"
                  type={mostraSenha ? 'text' : 'password'}
                  placeholder="Nova senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  readOnly={!editando}
                />
                <EyeIcon
                  src={mostraSenha ? olhoAberto : olhoFechado}
                  alt={mostraSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  onClick={() => editando && setMostraSenha((v) => !v)}
                  $disabled={!editando}
                />
              </InputWithIcon>
            </Field>


            <ButtonRow>
              {!editando ? (
                <>
                  <Button id="editar" type="button" onClick={onEditar}>
                    Editar conta
                  </Button>
                  <Button id="excluir" type="button" onClick={onExcluir}>
                    Excluir conta
                  </Button>
                </>
              ) : (
                <>
                  <Button id="salvar" type="button" onClick={onSalvar}>
                    Salvar
                  </Button>
                  <Button id="cancelar" type="button" onClick={onCancelar}>
                    Cancelar
                  </Button>
                </>
              )}
            </ButtonRow>
          </Form>
        )}
      </Card>
    </Container>
  );
}


export default Usuario;



