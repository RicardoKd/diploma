import React from 'react';
import { Line } from 'react-chartjs-2';
import { useQuery } from 'react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Card, CardContent } from '@mui/material';

import { AppLoader } from '../../UI';
import { COLORS, SPACES } from '../../theme';
import { statsService } from '../../services';
import { OPTIONS, QUERY_KEYS } from '../../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyIncomeSpendStatsProps {
  accountId: string;
}

export const MonthlyIncomeSpendStats: React.FC<
  MonthlyIncomeSpendStatsProps
> = ({ accountId }) => {
  const { isSuccess, data: stats } = useQuery({
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryKey: [QUERY_KEYS.MONTHLY_INCOME_SPEND_STATS, accountId],
    queryFn: () => statsService.getMonthlyIncomeSpendStats({ accountId }),
  });

  if (!isSuccess) {
    return <AppLoader />;
  }

  const data = {
    labels: stats.map((st) => st.month_year),
    datasets: [
      {
        label: 'Incomes',
        data: stats.map((st) => st.income),
        backgroundColor: COLORS.success,
      },
      {
        label: 'Spends',
        data: stats.map((st) => st.spend),
        backgroundColor: COLORS.red,
      },
    ],
  };

  return (
    <Card sx={{ width: 630, margin: SPACES.l }}>
      <CardContent>
        <Box>
          <Line options={OPTIONS.MONTHLY_INCOME_SPEND_STATS} data={data} />
        </Box>
      </CardContent>
    </Card>
  );
};
