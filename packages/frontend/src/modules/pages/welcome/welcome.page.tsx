import React from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { logOut } from '../../utils';
import { SPACES } from '../../theme';
import { ROUTER_KEYS } from '../../constants';
import { AppButton, FlexContainer } from '../../UI';

export const WelcomePage = () => {
  logOut();
  const navigate = useNavigate();

  return (
    <FlexContainer
      sx={{
        flexDirection: 'column',
        height: '100vh',
        '& > *': {
          marginBottom: `${SPACES.xxl} !important`,
        },
      }}
    >
      <Typography variant="h2">Budgeting App</Typography>
      <AppButton onClick={() => navigate(ROUTER_KEYS.LOGIN)}>Login</AppButton>
    </FlexContainer>
  );
};
