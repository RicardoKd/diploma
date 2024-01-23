import React from 'react';
import { Typography } from '@mui/material';

import { RouterLink } from '../../UI';
import { ROUTER_KEYS } from '../../constants';
import { WelcomeStyled } from './welcome.page.styled';

export const WelcomePage = () => (
  <WelcomeStyled>
    <Typography variant="h2">Budgeting App</Typography>
    <RouterLink to={ROUTER_KEYS.LOGIN} text="Login" />
  </WelcomeStyled>
);
