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
import { AppLoader, RangeSelect } from '../../UI';
import { ICategoriesStats, IRange } from '../../types';
import { OPTIONS, RANGE_INITIAL_STATE } from '../../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend
);

interface CategoriesStatsProps {
  queryKey: any;
  queryMethod: () => Promise<ICategoriesStats>;
}

export const CategoriesStats: React.FC<CategoriesStatsProps> = ({
  queryKey,
  queryMethod,
}) => {
  const [spendRange, setSpendRange] = useState<IRange>(RANGE_INITIAL_STATE);
  const [incomeRange, setIncomeRange] = useState<IRange>(RANGE_INITIAL_STATE);

  const { isSuccess: incomeIsSuccess, data: stats } =
    useQuery<ICategoriesStats>({
      queryKey,
      keepPreviousData: true,
      refetchOnMount: 'always',
      queryFn: () => queryMethod(),
    });

  if (!incomeIsSuccess) {
    return <AppLoader />;
  }

  const data = {
    income: {
      labels: stats.income.map((stat) => stat.category),
      datasets: [
        {
          backgroundColor: COLORS.purple,
          data: stats.income.map((stat) => stat[incomeRange]),
        },
      ],
    },
    spend: {
      labels: stats.spend.map((stat) => stat.category),
      datasets: [
        {
          backgroundColor: COLORS.purple,
          data: stats.spend.map((stat) => stat[spendRange]),
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
