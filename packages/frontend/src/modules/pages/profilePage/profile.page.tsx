import React from 'react';
import { Typography } from '@mui/material';

import { getRole, logOut } from '../../utils';
import { ROUTER_KEYS } from '../../constants';
import { MainStyled, RouterLink } from '../../UI';
import { ProfileStyled, ButtonContainer } from './profile.styled';

export const ProfilePage = () => {
  const role = getRole();

  return (
    <MainStyled>
      <ProfileStyled>
        <Typography variant="h2">Profile</Typography>

        <ButtonContainer>
          {(role === 'parent' || role === 'super_parent') && (
            <RouterLink to={ROUTER_KEYS.CREATE_CHILD} text="Add child" />
          )}
          {role === 'super_parent' && (
            <RouterLink to={ROUTER_KEYS.CREATE_PARENT} text="Add 2nd parent" />
          )}
          <RouterLink to={ROUTER_KEYS.START} text="Log out" onClick={logOut} />
          <RouterLink to={ROUTER_KEYS.HOME} text="Back" />
        </ButtonContainer>
      </ProfileStyled>
    </MainStyled>
  );
};
