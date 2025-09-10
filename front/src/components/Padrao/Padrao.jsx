import React , {useEffect} from 'react';
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
        navigate('/home', {replace: true});
      }
    }
  }, [navigate, location.pathname]);

  return (
    <div style={{display: 'flex', height: '100vh'}}>
      <Menu />
      <Background>
        <Outlet />
      </Background>
    </div>
  );
}

export default Padrao;