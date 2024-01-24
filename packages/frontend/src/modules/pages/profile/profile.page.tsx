import React from 'react';
import { Typography } from '@mui/material';

import { ROUTER_KEYS } from '../../constants';
import { getRole, logOut } from '../../utils';
import { MainStyled, RouterLink } from '../../UI';
import { AddChildForm, AddParentForm } from '../../components';
import { ProfileStyled, ButtonContainer } from './profile.styled';

export const ProfilePage = () => {
  const role = getRole();

  return (
    <MainStyled>
      <ProfileStyled>
        <Typography variant="h2">Profile</Typography>

        <ButtonContainer>
          {(role === 'parent' || role === 'super_parent') && <AddChildForm />}
          {role === 'super_parent' && <AddParentForm />}
          <RouterLink to={ROUTER_KEYS.START} text="Log out" onClick={logOut} />
          <RouterLink to={ROUTER_KEYS.HOME} text="Back" />
        </ButtonContainer>
      </ProfileStyled>
    </MainStyled>
  );
};
