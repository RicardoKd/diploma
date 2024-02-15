import React from 'react';
import { useQuery } from 'react-query';

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
    <div>
      <BarChart
        options={OPTIONS.CATEGORIES_STATS.income}
        labels={stats.income.map((stat) => stat.category)}
        preDatasets={[
          {
            backgroundColor: COLORS.purple,
            data: stats.income,
          },
        ]}
      />
      <BarChart
        options={OPTIONS.CATEGORIES_STATS.spend}
        labels={stats.spend.map((stat) => stat.category)}
        preDatasets={[
          {
            backgroundColor: COLORS.purple,
            data: stats.spend,
          },
        ]}
      />
    </div>
  );
};
