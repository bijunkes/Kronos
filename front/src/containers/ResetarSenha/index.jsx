import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ModalSenha from '../ModalSenha/index.jsx';
import { redefinirSenha } from '../../services/api.js';
import { showOkToast } from '../../components/showToast.jsx';

function ResetarSenhaPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const busyRef = useRef(false);

  // se abrir sem token, manda para login sem renderizar modal
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  const handleClose = () => navigate('/login', { replace: true });

  const handleSubmit = async (novaSenha) => {
    if (busyRef.current) return;
    busyRef.current = true;

    try {
      await redefinirSenha({ token, novaSenha });
      navigate('/login', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        'Não foi possível redefinir a senha. Tente novamente.';
      showOkToast(msg, 'error');
    } finally {
      busyRef.current = false;
    }
  };

  if (!token) return null;

  return <ModalSenha onClose={handleClose} onSubmit={handleSubmit} />;
}

export default ResetarSenhaPage;
