import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ROUTER_KEYS } from '../constants';
import { HomePage, StartPage, ProfilePage } from '../pages';

export const MainRouter = () => (
  <Routes>
    <Route element={<StartPage />} path={ROUTER_KEYS.ANY} />
    <Route
      element={<HomePage />}
      path={`${ROUTER_KEYS.HOME}${ROUTER_KEYS.ANY}`}
    />
    <Route
      element={<ProfilePage />}
      path={`${ROUTER_KEYS.PROFILE}${ROUTER_KEYS.ANY}`}
    />
  </Routes>
);
