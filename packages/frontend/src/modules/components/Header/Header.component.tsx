import React from 'react';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { COLORS } from '../../theme';
import { RouterLink } from '../../UI';
import { CreateAccountForm } from '../';
import { HeaderTop } from './Header.styled';
import { ROUTER_KEYS } from '../../constants';

export const Header = () => {
  const location = useLocation();

  return (
    <HeaderTop>
      <Typography variant="h5" component="h1" sx={{ color: COLORS.white }}>
        {location.pathname === ROUTER_KEYS.HOME && 'Accounts'}
        {location.pathname.includes(ROUTER_KEYS.VIEW_ACCOUNT) &&
          'Account Details'}
      </Typography>
      <div>
        {location.pathname === ROUTER_KEYS.HOME && <CreateAccountForm />}
        <RouterLink text="My Profile" to={ROUTER_KEYS.PROFILE} />
      </div>
    </HeaderTop>
  );
};
