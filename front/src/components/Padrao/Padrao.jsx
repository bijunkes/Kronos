import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Menu from '../Menu';
import { Background } from './styles';

function Padrao() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const primeiroCarregamento = !sessionStorage.getItem('jaCarregado');

    if (primeiroCarregamento) {
      sessionStorage.setItem('jaCarregado', 'true');
      if (location.pathname !== '/home') {
        navigate('/home', { replace: true });
      }
    }
  }, [navigate, location.pathname]);

  return (
    <>
      {/* Menu fixo no canto esquerdo */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '34vh',
          zIndex: 10,
        }}
      >
        <Menu />
      </div>

      {/* Conteúdo com margem para não ficar embaixo do menu */}
      <div
        style={{
          marginLeft: '34vh',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <Background>
          <Outlet />
        </Background>
      </div>
    </>
  );
}

export default Padrao;
