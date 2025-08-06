import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '../Menu';

function Padrao() {
  return (
    <div style={{display: 'flex'}}>
      <Menu />
      <div style={{flex: 1, padding: '2rem', overflowY: 'auto'}}>
        <Outlet />
      </div>
    </div>
  );
}

export default Padrao;