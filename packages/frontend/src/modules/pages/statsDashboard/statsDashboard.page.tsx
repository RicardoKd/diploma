import React from 'react';
import { useQuery } from 'react-query';
import { useTheme } from '@mui/material/styles';

import { statsService } from '../../services';
import { AppLoader, FlexContainer } from '../../UI';
import { OPTIONS, QUERY_KEYS } from '../../constants';
import {
  Header,
  BarChart,
  CategoriesStats,
  PopularCategories,
} from '../../components';

export const StatsDashboardPage = () => {
  const theme = useTheme();
  const { isSuccess, data: userStats } = useQuery({
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryKey: [QUERY_KEYS.USER_STATS],
    queryFn: () => statsService.getUsersRangedTransactionsStats(),
  });

  if (!isSuccess) {
    return <AppLoader />;
  }

  return (
    <>
      <Header title="Statistics Dashboard" />
      <FlexContainer sx={{ flexWrap: 'wrap' }} component='main'>
        <CategoriesStats
          queryKey={[QUERY_KEYS.CATEGORIES_STATS]}
          queryMethod={() => statsService.getCategoriesStats()}
        />
        <BarChart
          options={OPTIONS.USERS_STATS(theme.palette.secondary.main)}
          labels={userStats.map((stat) => stat.username)}
          preDatasets={[
            {
              label: 'Incomes',
              data: userStats.map((stat) => stat.income),
              backgroundColor: theme.palette.success.light,
            },
            {
              label: 'Spends',
              data: userStats.map((stat) => stat.spend),
              backgroundColor: theme.palette.error.light,
            },
          ]}
        />
        <PopularCategories />
      </FlexContainer>
    </>
  );
};
