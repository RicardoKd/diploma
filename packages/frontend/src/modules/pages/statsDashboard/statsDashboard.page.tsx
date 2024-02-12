import React from 'react';

import { MainStyled } from '../../UI';
import { Header, UsersStats } from '../../components';

export const StatsDashboardPage = () => {
  return (
    <>
      <Header title="Statistics Dashboard" />
      <MainStyled>
        <UsersStats />
      </MainStyled>
    </>
  );
};
