import React from 'react';
import { useQuery } from 'react-query';

import { COLORS } from '../../theme';
import { statsService } from '../../services';
import { OPTIONS, QUERY_KEYS } from '../../constants';
import { AppLoader, FlexContainer } from '../../UI';
import {
  Header,
  BarChart,
  CategoriesStats,
  PopularCategories,
} from '../../components';

export const StatsDashboardPage = () => {
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
      <FlexContainer sx={{ flexWrap: 'wrap' }}>
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
        <PopularCategories />
      </FlexContainer>
    </>
  );
};
