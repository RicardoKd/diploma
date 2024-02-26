import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useTheme, CircularProgress } from '@mui/material';

import { COLORS } from '../../theme';
import { FlexContainer } from '../../UI';
import { statsService } from '../../services';
import { OPTIONS, QUERY_KEYS } from '../../constants';
import {
  Header,
  BarChart,
  MonthlyIncomeSpendStats,
  AccountTransactionsStats,
} from '../../components';

export const AccountStatsPage = () => {
  const theme = useTheme();
  const accountId = useParams().accountId!;

  const { isSuccess: isCategoriesStatsSuccess, data: categoriesStats } =
    useQuery({
      keepPreviousData: true,
      refetchOnMount: 'always',
      queryKey: [QUERY_KEYS.CATEGORIES_BY_ACCOUNT_ID_STATS, accountId],
      queryFn: () => statsService.getCategoriesStatsByAccountId({ accountId }),
    });
  const {
    isSuccess: isMonthlyIncomeSpendStatsSuccess,
    data: monthlyIncomeSpendStats,
  } = useQuery({
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryKey: [QUERY_KEYS.MONTHLY_INCOME_SPEND_STATS, accountId],
    queryFn: () => statsService.getMonthlyIncomeSpendStats({ accountId }),
  });
  const {
    isSuccess: isAccountTransactionsStatsSuccess,
    data: accountTransactionsStats,
  } = useQuery({
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryKey: [QUERY_KEYS.ACCOUNT_TRANSACTIONS_STATS, accountId],
    queryFn: () => statsService.getAccountTransactionsStatsById({ accountId }),
  });

  return (
    <>
      <Header />
      <FlexContainer sx={{ flexWrap: 'wrap' }} component="main">
        {isCategoriesStatsSuccess &&
        isMonthlyIncomeSpendStatsSuccess &&
        isAccountTransactionsStatsSuccess ? (
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
            <MonthlyIncomeSpendStats stats={monthlyIncomeSpendStats} />
            <AccountTransactionsStats stats={accountTransactionsStats} />
          </>
        ) : (
          <CircularProgress />
        )}
      </FlexContainer>
    </>
  );
};
