import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { ROUTER_KEYS } from '../constants';
import { PrivateRoute } from '../components';
import {
  HomePage,
  LoginPage,
  AccountPage,
  AccountStatsPage,
  StatsDashboardPage,
} from '../pages';

export const MainRouter = () => (
  <Routes>
    <Route element={<LoginPage />} path={ROUTER_KEYS.START} />
    <Route
      element={<PrivateRoute Component={HomePage} />}
      path={ROUTER_KEYS.HOME}
    />
    <Route
      element={<PrivateRoute Component={StatsDashboardPage} />}
      path={ROUTER_KEYS.STATS_DASHBOARD}
    />
    <Route
      element={<PrivateRoute Component={AccountPage} />}
      path={`${ROUTER_KEYS.ACCOUNT}/:accountId`}
    />
    <Route
      element={<PrivateRoute Component={AccountStatsPage} />}
      path={`${ROUTER_KEYS.ACCOUNT_STATS}/:accountId`}
    />
    <Route
      path={`${ROUTER_KEYS.HOME}/${ROUTER_KEYS.ANY}`}
      element={<Navigate to={ROUTER_KEYS.HOME} replace={true} />}
    />
    <Route
      path={ROUTER_KEYS.ANY}
      element={<Navigate to={ROUTER_KEYS.START} replace={true} />}
    />
  </Routes>
);
