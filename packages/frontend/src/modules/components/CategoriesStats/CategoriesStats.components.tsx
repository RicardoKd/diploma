import { Bar } from 'react-chartjs-2';
import { useQuery } from 'react-query';
import React, { useState } from 'react';
import { Box, Card, CardContent, SelectChangeEvent } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { COLORS, SPACES } from '../../theme';
import { statsService } from '../../services';
import { AppLoader, RangeSelect } from '../../UI';
import { IAccountStatsRange, IRange } from '../../types';
import { OPTIONS, QUERY_KEYS, RANGE_INITIAL_STATE } from '../../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend
);

interface CategoriesStatsProps {
  accountId: string;
}

export const CategoriesStats: React.FC<CategoriesStatsProps> = ({
  accountId,
}) => {
  const [spendRange, setSpendRange] = useState<IRange>(RANGE_INITIAL_STATE);
  const [incomeRange, setIncomeRange] = useState<IRange>(RANGE_INITIAL_STATE);

  const { isSuccess: incomeIsSuccess, data: incomeStats } =
    useQuery<IAccountStatsRange>({
      queryKey: [QUERY_KEYS.INCOME_STATS, accountId],
      keepPreviousData: true,
      refetchOnMount: 'always',
      queryFn: () =>
        statsService.getCategoryStats({
          accountId,
          type: 'income',
        }),
    });

  const { isSuccess: spendIsSuccess, data: spendStats } =
    useQuery<IAccountStatsRange>({
      queryKey: [QUERY_KEYS.SPEND_STATS, accountId],
      keepPreviousData: true,
      refetchOnMount: 'always',
      queryFn: () =>
        statsService.getCategoryStats({
          accountId,
          type: 'spend',
        }),
    });

  if (!incomeIsSuccess || !spendIsSuccess) {
    return <AppLoader />;
  }

  const data = {
    income: {
      labels: incomeStats[incomeRange].map((stat) => stat.category),
      datasets: [
        {
          backgroundColor: COLORS.purple,
          data: incomeStats[incomeRange].map((stat) => stat.percentage),
        },
      ],
    },
    spend: {
      labels: spendStats[spendRange].map((stat) => stat.category),
      datasets: [
        {
          backgroundColor: COLORS.purple,
          data: spendStats[spendRange].map((stat) => stat.percentage),
        },
      ],
    },
  };

  const handleIncomeRangeChange = (event: SelectChangeEvent) =>
    setIncomeRange(event.target.value as IRange);

  const handleSpendRangeChange = (event: SelectChangeEvent) =>
    setSpendRange(event.target.value as IRange);

  return (
    <div>
      <Card sx={{ margin: SPACES.l, width: '500px', display: 'inline-block' }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Bar options={OPTIONS.CATEGORIES_STATS.income} data={data.income} />
          </Box>
          <RangeSelect
            rangeValue={incomeRange}
            handleChange={handleIncomeRangeChange}
          />
        </CardContent>
      </Card>
      <Card sx={{ margin: SPACES.l, width: '500px', display: 'inline-block' }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Bar options={OPTIONS.CATEGORIES_STATS.spend} data={data.spend} />
          </Box>
          <RangeSelect
            rangeValue={spendRange}
            handleChange={handleSpendRangeChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
