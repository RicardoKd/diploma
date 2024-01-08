import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { logOut } from '../utils';
import { MainStyled } from '../UI';
import { ROUTER_KEYS } from '../constants';
import { WelcomePage } from './welcome/welcome.page';
import { LoginForm } from '../components/LoginForm/LoginForm';
import queryClient from '../app/queryClient';

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
