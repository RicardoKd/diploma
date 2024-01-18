import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ROUTER_KEYS } from '../constants';
import {
  HomePage,
  StartPage,
  ProfilePage,
  CreateChildPage,
  CreateParentPage,
  CreateAccountPage,
  CreateTransactionPage,
  CreateRecurringTransactionPage
} from '../pages';

export const MainRouter = () => (
  <Routes>
    <Route element={<StartPage />} path={ROUTER_KEYS.ANY} />
    <Route element={<HomePage />} path={`${ROUTER_KEYS.HOME}${ROUTER_KEYS.ANY}`} />
    <Route element={<ProfilePage />} path={`${ROUTER_KEYS.PROFILE}${ROUTER_KEYS.ANY}`} />
    <Route element={<CreateChildPage />} path={`${ROUTER_KEYS.CREATE_CHILD}${ROUTER_KEYS.ANY}`} />
    <Route element={<CreateParentPage />} path={`${ROUTER_KEYS.CREATE_PARENT}${ROUTER_KEYS.ANY}`} />
    <Route
      element={<CreateTransactionPage type="spend" />}
      path={`${ROUTER_KEYS.CREATE_SPEND}${ROUTER_KEYS.ANY}`}
    />
    <Route
      element={<CreateTransactionPage type="income" />}
      path={`${ROUTER_KEYS.CREATE_INCOME}${ROUTER_KEYS.ANY}`}
    />
    <Route
      element={<CreateAccountPage />}
      path={`${ROUTER_KEYS.CREATE_ACCOUNT}${ROUTER_KEYS.ANY}`}
    />
    <Route
      element={<CreateRecurringTransactionPage type="spend" />}
      path={`${ROUTER_KEYS.CREATE_RECCURING_SPEND}${ROUTER_KEYS.ANY}`}
    />
    <Route
      element={<CreateRecurringTransactionPage type="income" />}
      path={`${ROUTER_KEYS.CREATE_RECCURING_INCOME}${ROUTER_KEYS.ANY}`}
    />
  </Routes>
);