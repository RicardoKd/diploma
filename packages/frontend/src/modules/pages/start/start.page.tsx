import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { logOut } from '../../utils';
import { WelcomePage } from '..';
import { MainStyled } from '../../UI';
import { LoginForm } from '../../components';
import { ROUTER_KEYS } from '../../constants';
import queryClient from '../../app/queryClient';

export const StartPage = () => {
  logOut();
  queryClient.clear();

  return (
    <MainStyled>
      <Routes>
        <Route element={<WelcomePage />} path={ROUTER_KEYS.START} />
        <Route element={<LoginForm />} path={ROUTER_KEYS.LOGIN} />
      </Routes>
    </MainStyled>
  );
};
