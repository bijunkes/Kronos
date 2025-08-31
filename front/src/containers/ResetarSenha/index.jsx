import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { redefinirSenha } from '../../services/api.js';
import ModalSenha from '../ModalSenha/index.jsx';

function ResetarSenhaPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');

  // se abrir sem token, manda para login sem renderizar modal
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  const handleClose = () => navigate('/login', { replace: true });

  const handleSubmit = async (novaSenha) => {
    try {
      await redefinirSenha({ token, novaSenha });
      navigate('/login', { replace: true });
    } catch {
    }
  };

  if (!token) return null;

  return <ModalSenha onClose={handleClose} onSubmit={handleSubmit} />;
}

export default ResetarSenhaPage;
