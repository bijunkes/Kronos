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

  // ícone salvo no servidor
  const [icon, setIcon] = useState(null);
  // pré-visualização local (ainda não salva)
  const [tempIconUrl, setTempIconUrl] = useState(null);
  const [tempIconFile, setTempIconFile] = useState(null);

  const [uploading, setUploading] = useState(false); // usado apenas no "Salvar" (upload real)
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

        // sincroniza o menu
        window.dispatchEvent(new CustomEvent('user:icon', { detail: { iconUrl: p.icon || null } }));
        if (p.icon) localStorage.setItem('user_icon_url', p.icon);
        else localStorage.removeItem('user_icon_url');
      } catch (e) {
        showOkToast(e?.message || 'Erro ao carregar perfil', 'error');
      } finally {
        setCarregando(false);
      }
    })();

    // limpeza do objectURL ao desmontar
    return () => {
      if (tempIconUrl) URL.revokeObjectURL(tempIconUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // avatar só clica quando editando (abre o input file)
  const onAvatarClick = () => {
    if (!editando || uploading) return;
    fileRef.current?.click();
  };

  // PRÉ-VISUALIZAÇÃO local, sem salvar no servidor
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

    // limpa URL anterior, se existir
    if (tempIconUrl) URL.revokeObjectURL(tempIconUrl);

    const url = URL.createObjectURL(file);
    setTempIconUrl(url);
    setTempIconFile(file);
   

    // não enviamos nada agora; upload só acontecerá no onSalvar
    e.target.value = '';
  };

  // ===== Handlers =====
  function onEditar() {
    setEditando(true);
    setSenha('');
    setMostraSenha(false);
    setTimeout(() => nomeRef.current?.focus(), 0);
  }

  function onCancelar() {
    // restaura campos
    if (orig) {
      setNome(orig.nome || '');
      setUsername(orig.username || '');
      setEmail(orig.email || '');
      setIcon(orig.icon || null);
    }
    // descarta pré-visualização
    if (tempIconUrl) URL.revokeObjectURL(tempIconUrl);
    setTempIconUrl(null);
    setTempIconFile(null);

    setSenha('');
    setMostraSenha(false);
    setEditando(false);
  }

  async function onSalvar(e) {
    e?.preventDefault?.();

    const mudouNome  = orig && nome !== orig.nome;
    const mudouEmail = orig && email !== orig.email;
    const temSenha   = !!(senha && String(senha).trim());
    const mudouIcon  = !!tempIconFile; // somente se o usuário escolheu uma nova imagem

    const payload = {};
    if (mudouNome)  payload.nome  = nome;
    if (mudouEmail) payload.email = email;
    if (temSenha)   payload.senha = String(senha).trim();

    // Se nada mudou (nem imagem), não faz nada
    if (!mudouIcon && Object.keys(payload).length === 0) {
      showOkToast('Nada para atualizar.', 'success');
      setEditando(false);
      setSenha('');
      setMostraSenha(false);
      return;
    }

    try {
      const tid = toast.loading('Salvando...', { position: 'top-center' });

      // 1) atualiza campos de texto, se houver
      if (Object.keys(payload).length > 0) {
        await atualizarPerfil(payload);
      }

      // 2) se tiver imagem pendente, envia agora
      if (mudouIcon) {
        setUploading(true);
        const { iconUrl } = await enviarIcone(tempIconFile);
        setIcon(iconUrl || null);
        setOrig((o) => ({ ...(o || {}), icon: iconUrl || null }));

        // atualiza menu e persiste
        window.dispatchEvent(new CustomEvent('user:icon', { detail: { iconUrl: iconUrl || null } }));
        if (iconUrl) localStorage.setItem('user_icon_url', iconUrl);
        else localStorage.removeItem('user_icon_url');

        // limpa preview local
        if (tempIconUrl) URL.revokeObjectURL(tempIconUrl);
        setTempIconUrl(null);
        setTempIconFile(null);
      }

      toast.dismiss(tid);
      showOkToast('Perfil atualizado com sucesso!', 'success');

      // atualiza orig com os dados salvos
      setOrig({ nome, username, email, icon: mudouIcon ? (icon || null) : (orig?.icon || null) });

      setEditando(false);
      setSenha('');
      setMostraSenha(false);
    } catch (err) {
      toast.dismiss();
      showOkToast(
        err?.response?.data?.error || err?.message || 'Não foi possível atualizar o perfil.',
        'error'
      );
    } finally {
      setUploading(false);
    }
  }

  async function onExcluir() {
    const ok = window.confirm('Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.');
    if (!ok) return;

    try {
      const tid = toast.loading('Excluindo conta...', { position: 'top-center' });
      await excluirConta();
      toast.dismiss(tid);
      localStorage.removeItem('token');
      localStorage.removeItem('user_icon_url');
      navigate('/cadastro');
    } catch (err) {
      toast.dismiss();
      showOkToast(
        err?.response?.data?.error || err?.message || 'Não foi possível excluir a conta.',
        'error'
      );
    }
  }

  // ===== UI =====
  const avatarSrc = tempIconUrl || icon || defaultUserImage; // mostra preview se existir

  return (
    <Container>
      <Card>
        <Header>
          <Avatar
            onClick={onAvatarClick}
            title={editando ? (uploading ? 'Enviando...' : 'Clique para escolher uma foto') : ''}
            style={{ cursor: editando && !uploading ? 'pointer' : 'default', position: 'relative' }}
          >
            <img
              src={avatarSrc}
              alt="Foto do usuário"
              style={{ opacity: uploading ? 0.6 : 1, transition: 'opacity .2s' }}
            />
            {editando && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,.25)',
                  borderRadius: '50%',
                }}
              />
            )}
          </Avatar>

          <HeaderText>
            <h2>Meu Perfil</h2>
            <p>Gerencie suas informações</p>

            {/* input oculto para upload */}
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
            onSubmit={(e) => e.preventDefault()}
            style={{ opacity: editando ? 1 : 0.6, transition: 'opacity .2s' }}
          >
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
                  <Button id="salvar" type="button" onClick={onSalvar} disabled={uploading}>
                    {uploading ? 'Salvando…' : 'Salvar'}
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
