import React from 'react';

import { MainStyled } from '../../UI';
import { statsService } from '../../services';
import { QUERY_KEYS } from '../../constants';
import { CategoriesStats, Header, UsersStats } from '../../components';

export const StatsDashboardPage = () => {
  return (
    <>
      <Header title="Statistics Dashboard" />
      <MainStyled>
        <CategoriesStats
          queryKey={[QUERY_KEYS.CATEGORIES_STATS]}
          queryMethod={() => statsService.getCategoriesStats()}
        />
        <UsersStats />
      </MainStyled>
    </>
  );
};
