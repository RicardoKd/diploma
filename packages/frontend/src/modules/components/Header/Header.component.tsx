import React from 'react';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { COLORS } from '../../theme';
import { getRole } from '../../utils';
import { RouterLink } from '../../UI';
import { CreateAccountForm } from '../';
import { ROUTER_KEYS } from '../../constants';
import { HeaderStyled } from './Header.styled';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const role = getRole();
  const location = useLocation();

  return (
    <HeaderStyled>
      <div>
        <Typography variant="h5" component="h1" sx={{ color: COLORS.white }}>
          {title}
        </Typography>
        <div>
          {location.pathname === ROUTER_KEYS.HOME && (
            <>
              <CreateAccountForm />
              {role?.includes('parent') && (
                <RouterLink
                  text="Statistics Dashboard"
                  to={ROUTER_KEYS.USER_STATS}
                />
              )}
            </>
          )}
          <RouterLink text="My Profile" to={ROUTER_KEYS.PROFILE} />
        </div>
      </div>
    </HeaderStyled>
  );
};
