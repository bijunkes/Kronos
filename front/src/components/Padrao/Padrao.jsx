import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '../Menu';
import { Background } from './styles';

function Padrao() {
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