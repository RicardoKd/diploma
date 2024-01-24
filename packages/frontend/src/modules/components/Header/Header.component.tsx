import React from 'react';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { RouterLink } from '../../UI';
import { HeaderTop } from './Header.styled';
import { ROUTER_KEYS } from '../../constants';
import {
  CreateAccountForm,
  CreateTransactionForm,
  CreateRecurringTransactionForm,
} from '../';

export const Header = () => {
  const location = useLocation();

  return (
    <HeaderTop>
      <Typography variant="h5" component="h1">
        {location.pathname === ROUTER_KEYS.HOME && 'Accounts'}
        {location.pathname.includes(ROUTER_KEYS.VIEW_ACCOUNT) && 'Transactions'}
      </Typography>
      <div>
        {location.pathname === ROUTER_KEYS.HOME && <CreateAccountForm />}
        {location.pathname.includes(ROUTER_KEYS.VIEW_ACCOUNT) && (
          <CreateRecurringTransactionForm type="income" />
        )}
        {location.pathname.includes(ROUTER_KEYS.VIEW_ACCOUNT) && (
          <CreateRecurringTransactionForm type="spend" />
        )}
        {location.pathname.includes(ROUTER_KEYS.VIEW_ACCOUNT) && (
          <CreateTransactionForm type={'income'} />
        )}
        {location.pathname.includes(ROUTER_KEYS.VIEW_ACCOUNT) && (
          <CreateTransactionForm type={'spend'} />
        )}
        <RouterLink text="My Profile" to={ROUTER_KEYS.PROFILE} />
      </div>
    </HeaderTop>
  );
};
