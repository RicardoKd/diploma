import React from 'react';
import { Typography } from '@mui/material';

import { logOut } from '../../utils';
import { ROUTER_KEYS } from '../../constants';
import { MainStyled, RouterLink } from '../../UI';
import { WelcomeStyled } from './welcome.page.styled';

export const WelcomePage = () => {
  logOut();

  return (
    <MainStyled>
      <WelcomeStyled>
        <Typography variant="h2">Budgeting App</Typography>
        <RouterLink to={ROUTER_KEYS.LOGIN} text="Login" />
      </WelcomeStyled>
    </MainStyled>
  );
};
