import React from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ROUTER_KEYS } from '../../constants';
import { getRole, logOut } from '../../utils';
import { AppButton, MainStyled, RouterLink } from '../../UI';
import { AddChildForm, AddParentForm } from '../../components';
import { ProfileStyled, ButtonContainer } from './profile.styled';

export const ProfilePage = () => {
  const role = getRole();
  const navigate = useNavigate();

  return (
    <MainStyled>
      <ProfileStyled>
        <Typography variant="h2">Profile</Typography>

        <ButtonContainer>
          {(role === 'parent' || role === 'super_parent') && <AddChildForm />}
          {role === 'super_parent' && <AddParentForm />}
          <RouterLink to={ROUTER_KEYS.START} text="Log out" onClick={logOut} />
          <AppButton onClick={() => navigate(-1)} text="Back" />
        </ButtonContainer>
      </ProfileStyled>
    </MainStyled>
  );
};
