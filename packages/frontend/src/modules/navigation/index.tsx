import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ROUTER_KEYS } from '../constants';
import {
  HomePage,
  LoginPage,
  WelcomePage,
  ProfilePage,
  AccountPage,
  AccountStatsPage,
} from '../pages';

export const MainRouter = () => (
  <Routes>
    <Route element={<WelcomePage />} path={ROUTER_KEYS.START} />
    <Route element={<LoginPage />} path={ROUTER_KEYS.LOGIN} />
    <Route element={<HomePage />} path={ROUTER_KEYS.HOME} />
    <Route element={<ProfilePage />} path={ROUTER_KEYS.PROFILE} />
    <Route
      element={<AccountPage />}
      path={`${ROUTER_KEYS.ACCOUNT}/:accountId`}
    />
    <Route
      element={<AccountStatsPage />}
      path={`${ROUTER_KEYS.ACCOUNT_STATS}/:accountId`}
    />
    <Route
      path={`${ROUTER_KEYS.HOME}${ROUTER_KEYS.ANY}`}
      element={<Navigate to={ROUTER_KEYS.HOME} replace={true} />}
    />
    <Route
      path={ROUTER_KEYS.ANY}
      element={<Navigate to={ROUTER_KEYS.START} replace={true} />}
    />
  </Routes>
);
