import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '../Menu';
import Main from '../Main';

function Padrao() {
  return (
    <div style={{display: 'flex'}}>
      <Menu />
      <Main>
        <Outlet />
      </Main>
    </div>
  );
}

export default Padrao;