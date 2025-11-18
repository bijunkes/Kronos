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

import {
  getPerfil,
  atualizarPerfil,
  excluirConta,
  enviarIcone
} from '../../services/api.js';
import { showOkToast, showConfirmToast } from '../../components/showToast.jsx';

function Usuario() {
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [mostraSenha, setMostraSenha] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [icon, setIcon] = useState(null);
  const [tempIconUrl, setTempIconUrl] = useState(null);
  const [tempIconFile, setTempIconFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [orig, setOrig] = useState(null);

  const nomeRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const p = await getPerfil();
        setNome(p.nome || '');
        setUsername(p.username || '');
        setEmail(p.email || '');
        setIcon(p.icon || null);
        setOrig({
          nome: p.nome || '',
          username: p.username || '',
          email: p.email || '',
          icon: p.icon || null
        });

        window.dispatchEvent(new CustomEvent('user:icon', { detail: { iconUrl: p.icon || null } }));
        if (p.icon) localStorage.setItem('user_icon_url', p.icon);
        else localStorage.removeItem('user_icon_url');

        localStorage.setItem('user_nome', p.nome || '');
        window.dispatchEvent(
          new CustomEvent('user:profile', {
            detail: { nome: p.nome || '', username: p.username || '', email: p.email || '', icon: p.icon || null }
          })
        );
      } catch (e) {
        console.error('Erro ao carregar perfil', e);
      } finally {
        setCarregando(false);
      }
    })();

    return () => {
      if (tempIconUrl) URL.revokeObjectURL(tempIconUrl);
    };
  }, []);

  const onAvatarClick = () => {
    if (!editando || uploading) return;
    fileRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/^image\/(png|jpeg|jpg|webp)$/.test(file.type)) {
      showOkToast('Use PNG, JPG ou WEBP.', 'error');
      e.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showOkToast('Imagem até 2MB.', 'error');
      e.target.value = '';
      return;
    }

    if (tempIconUrl) URL.revokeObjectURL(tempIconUrl);

    const url = URL.createObjectURL(file);
    setTempIconUrl(url);
    setTempIconFile(file);

    e.target.value = '';
  };

  function onEditar() {
    setEditando(true);
    setSenha('');
    setMostraSenha(false);
    setTimeout(() => nomeRef.current?.focus(), 0);
  }

  function onCancelar() {
    if (orig) {
      setNome(orig.nome || '');
      setUsername(orig.username || '');
      setEmail(orig.email || '');
      setIcon(orig.icon || null);
    }
    if (tempIconUrl) URL.revokeObjectURL(tempIconUrl);
    setTempIconUrl(null);
    setTempIconFile(null);

    setSenha('');
    setMostraSenha(false);
    setEditando(false);
  }

  async function onSalvar(e) {
  e?.preventDefault?.();
  setSaving(true);

  const mudouNome  = orig && nome !== orig.nome;
  const mudouEmail = orig && email !== orig.email;
  const temSenha   = !!(senha && String(senha).trim());
  const mudouIcon  = !!tempIconFile;

  const payload = {};
  if (mudouNome)  payload.nome  = nome;
  if (mudouEmail) payload.email = email;
  if (temSenha)   payload.senha = String(senha).trim();

  if (!mudouIcon && Object.keys(payload).length === 0) {
    setEditando(false);
    setSenha('');
    setMostraSenha(false);
    setSaving(false);
    return;
  }

  try {
    if (Object.keys(payload).length > 0) {
      const resp = await atualizarPerfil(payload, { silentSuccess: true });
      if (resp?.message) showOkToast(resp.message, 'success');
    }

    let newIcon = orig?.icon || null;

    if (mudouIcon) {
      setUploading(true);

      const resp = await enviarIcone(tempIconFile);
      const iconUrl =
        resp?.iconUrl ?? resp?.icon ?? resp?.url ?? null;

      newIcon = iconUrl; 
     
      setIcon(newIcon);
      setOrig((o) => ({ ...(o || {}), icon: newIcon }));

      if (newIcon) localStorage.setItem('user_icon_url', newIcon);
      else localStorage.removeItem('user_icon_url');
      window.dispatchEvent(new CustomEvent('user:icon', { detail: { iconUrl: newIcon } }));
      window.dispatchEvent(new CustomEvent('user:profile', { detail: { icon: newIcon } }));

      if (tempIconUrl) URL.revokeObjectURL(tempIconUrl);
      setTempIconUrl(null);
      setTempIconFile(null);
    } else {     
      newIcon = icon ?? orig?.icon ?? null;
    }

    setOrig({ nome, username, email, icon: newIcon });

    localStorage.setItem('user_nome', nome || '');
    window.dispatchEvent(
      new CustomEvent('user:profile', {
        detail: { nome, username, email, icon: newIcon }
      })
    );

    setEditando(false);
    setSenha('');
    setMostraSenha(false);
  } catch (err) {
    console.error('Falha ao salvar perfil', err);
  } finally {
    setUploading(false);
    setSaving(false);
  }
}


  async function onExcluir() {
    const ok = await showConfirmToast(
      'Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.',
      { confirmLabel: 'Excluir', cancelLabel: 'Cancelar' }
    );
    if (!ok) return;

    try {
      await excluirConta();
      localStorage.removeItem('token');
      localStorage.removeItem('user_icon_url');
      localStorage.removeItem('user_nome');
      navigate('/cadastro');
    } catch (err) {
      console.error('Erro ao excluir conta', err);
    }
  }

  const avatarSrc = tempIconUrl || icon || defaultUserImage;

  return (
    <Container>
      <Card>
        <Header>
          <Avatar
            $editando={editando}
            onClick={onAvatarClick}
            title={editando ? (uploading ? 'Enviando...' : 'Clique para escolher uma foto') : ''}
          >
            <img
              src={avatarSrc}
              alt="Foto do usuário"
            />
          </Avatar>
          <HeaderText>
            <h2>Meu Perfil</h2>
            <p>Gerencie suas informações</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              onChange={onFileChange}
            />
          </HeaderText>
        </Header>

        {carregando ? (
          <Loading>Carregando…</Loading>
        ) : (
          <Form
            onSubmit={(e) => e.preventDefault()}>
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
                readOnly
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
                  <Button id="salvar" type="button" onClick={onSalvar} disabled={saving || uploading}>
                    {saving ? 'Salvando…' : 'Salvar'}
                  </Button>
                  <Button id="cancelar" type="button" onClick={onCancelar} disabled={uploading}>
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
