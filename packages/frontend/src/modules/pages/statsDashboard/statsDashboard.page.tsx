import React from 'react';
import { useQuery } from 'react-query';
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

import { COLORS } from '../../theme';
import { FlexContainer } from '../../UI';
import { statsService } from '../../services';
import { OPTIONS, QUERY_KEYS } from '../../constants';
import { Header, BarChart, PopularCategories } from '../../components';

export const StatsDashboardPage = () => {
  const theme = useTheme();

  const { isSuccess: isUserStatsSuccess, data: userStats } = useQuery({
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryKey: [QUERY_KEYS.USER_STATS],
    queryFn: () => statsService.getUsersRangedTransactionsStats(),
  });
  const { isSuccess: isCategoriesStatsSuccess, data: categoriesStats } =
    useQuery({
      keepPreviousData: true,
      refetchOnMount: 'always',
      queryKey: [QUERY_KEYS.CATEGORIES_STATS],
      queryFn: () => statsService.getCategoriesStats(),
    });
  const { isSuccess: isPopularCategoriesStats, data: popularCategoriesStats } =
    useQuery({
      keepPreviousData: true,
      refetchOnMount: 'always',
      queryKey: [QUERY_KEYS.POPULAR_CATEGORIES],
      queryFn: () => statsService.getPopularCategoriesStats(),
    });

  return (
    <>
      <Header title="Statistics Dashboard" />
      <FlexContainer sx={{ flexWrap: 'wrap' }} component="main">
        {isUserStatsSuccess &&
        isCategoriesStatsSuccess &&
        isPopularCategoriesStats ? (
          <>
            <BarChart
              options={OPTIONS.CATEGORIES_STATS.income(
                theme.palette.secondary.main
              )}
              labels={categoriesStats.income.map((stat) => stat.category)}
              preDatasets={[
                {
                  label: 'Percentage',
                  data: categoriesStats.income,
                  backgroundColor: COLORS.purple,
                },
              ]}
            />
            <BarChart
              options={OPTIONS.CATEGORIES_STATS.spend(
                theme.palette.secondary.main
              )}
              labels={categoriesStats.spend.map((stat) => stat.category)}
              preDatasets={[
                {
                  label: 'Percentage',
                  data: categoriesStats.spend,
                  backgroundColor: COLORS.purple,
                },
              ]}
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
            <PopularCategories stats={popularCategoriesStats} />
          </>
        ) : (
          <CircularProgress />
        )}
      </FlexContainer>
    </>
  );
};
