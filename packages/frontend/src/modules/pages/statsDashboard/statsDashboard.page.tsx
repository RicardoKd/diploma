import React from 'react';
import { useQuery } from 'react-query';

import { COLORS } from '../../theme';
import { IUserStats } from '../../types';
import { statsService } from '../../services';
import { AppLoader, MainStyled } from '../../UI';
import { OPTIONS, QUERY_KEYS } from '../../constants';
import { BarChart, CategoriesStats, Header } from '../../components';

export const StatsDashboardPage = () => {
  const { isSuccess, data: userStats } = useQuery<IUserStats[]>({
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryKey: [QUERY_KEYS.USER_STATS],
    queryFn: () => statsService.getUsersStats(),
  });

  if (!isSuccess) {
    return <AppLoader />;
  }
  return (
    <>
      <Header title="Statistics Dashboard" />
      <MainStyled>
        <CategoriesStats
          queryKey={[QUERY_KEYS.CATEGORIES_STATS]}
          queryMethod={() => statsService.getCategoriesStats()}
        />
        <BarChart
          options={OPTIONS.USERS_STATS}
          labels={userStats.map((stat) => stat.username)}
          preDatasets={[
            {
              label: 'Incomes',
              data: userStats.map((stat) => stat.income),
              backgroundColor: COLORS.success,
            },
            {
              label: 'Spends',
              data: userStats.map((stat) => stat.spend),
              backgroundColor: COLORS.red,
            },
          ]}
        />
      </MainStyled>
    </>
  );
};
