import React from 'react';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { SPACES } from '../../theme';
import { RouterLink } from '../../UI';
import { HeaderTop } from './Header.styled';
import { ROUTER_KEYS } from '../../constants';

export const Header = () => {
  const location = useLocation();

  return (
    <HeaderTop>
      <Typography variant="h5" component="h1">
        {location.pathname === ROUTER_KEYS.HOME && 'Accounts'}
        {location.pathname.includes(ROUTER_KEYS.VIEW_ACCOUNT) && 'Transactions'}
      </Typography>
      <div>
        {location.pathname === ROUTER_KEYS.HOME && (
          <RouterLink
            text="Create account"
            style={{ marginRight: SPACES.m }}
            to={`${ROUTER_KEYS.CREATE_ACCOUNT}`}
          />
        )}
        {location.pathname.includes(ROUTER_KEYS.VIEW_ACCOUNT) && (
          <RouterLink
            text="Create recurring income"
            style={{ marginRight: SPACES.m }}
            to={ROUTER_KEYS.CREATE_RECCURING_INCOME}
          />
        )}
        {location.pathname.includes(ROUTER_KEYS.VIEW_ACCOUNT) && (
          <RouterLink
            text="Create recurring spend"
            style={{ marginRight: SPACES.m }}
            to={ROUTER_KEYS.CREATE_RECCURING_SPEND}
          />
        )}
        {location.pathname.includes(ROUTER_KEYS.VIEW_ACCOUNT) && (
          <RouterLink
            text="Create income"
            style={{ marginRight: SPACES.m }}
            to={ROUTER_KEYS.CREATE_INCOME}
          />
        )}
        {location.pathname.includes(ROUTER_KEYS.VIEW_ACCOUNT) && (
          <RouterLink
            text="Create spend"
            style={{ marginRight: SPACES.m }}
            to={ROUTER_KEYS.CREATE_SPEND}
          />
        )}
        <RouterLink text="My Profile" to={ROUTER_KEYS.PROFILE} />
      </div>
    </HeaderTop>
  );
};
