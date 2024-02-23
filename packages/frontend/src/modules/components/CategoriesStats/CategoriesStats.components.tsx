import React from 'react';
import { useQuery } from 'react-query';
import { useTheme } from '@mui/material/styles';

import { BarChart } from '../';
import { COLORS } from '../../theme';
import { AppLoader } from '../../UI';
import { OPTIONS } from '../../constants';
import { IIncomeSpendCategoriesRangeStats } from '../../types';

interface CategoriesStatsProps {
  queryKey: any;
  queryMethod: () => Promise<IIncomeSpendCategoriesRangeStats>;
}

export const CategoriesStats: React.FC<CategoriesStatsProps> = ({
  queryKey,
  queryMethod,
}) => {
  const theme = useTheme();
  const { isSuccess, data: stats } = useQuery({
    queryKey,
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryFn: () => queryMethod(),
  });

  if (!isSuccess) {
    return <AppLoader />;
  }

  return (
    <>
      <BarChart
        options={OPTIONS.CATEGORIES_STATS.income(theme.palette.secondary.main)}
        labels={stats.income.map((stat) => stat.category)}
        preDatasets={[
          {
            label: 'Percentage',
            data: stats.income,
            backgroundColor: COLORS.purple,
          },
        ]}
      />
      <BarChart
        options={OPTIONS.CATEGORIES_STATS.spend(theme.palette.secondary.main)}
        labels={stats.spend.map((stat) => stat.category)}
        preDatasets={[
          {
            label: 'Percentage',
            data: stats.spend,
            backgroundColor: COLORS.purple,
          },
        ]}
      />
    </>
  );
};
