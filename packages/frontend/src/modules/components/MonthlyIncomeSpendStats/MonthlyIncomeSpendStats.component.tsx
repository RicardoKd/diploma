import React from 'react';
import { Line } from 'react-chartjs-2';
import { useQuery } from 'react-query';
import { useTheme } from '@mui/material/styles';
import { Box, Card, CardContent } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

import { AppLoader } from '../../UI';
import { statsService } from '../../services';
import { BORDER_RADIUS, SPACES } from '../../theme';
import { OPTIONS, QUERY_KEYS } from '../../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

interface MonthlyIncomeSpendStatsProps {
  accountId: string;
}

export const MonthlyIncomeSpendStats: React.FC<
  MonthlyIncomeSpendStatsProps
> = ({ accountId }) => {
  const theme = useTheme();
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
        borderColor: theme.palette.success.main,
        backgroundColor: theme.palette.success.main,
      },
      {
        label: 'Spends',
        data: stats.map((st) => st.spend),
        borderColor: theme.palette.error.main,
        backgroundColor: theme.palette.error.main,
      },
    ],
  };

  return (
    <Card sx={{ width: 630, margin: SPACES.l, borderRadius: BORDER_RADIUS }}>
      <CardContent>
        <Box>
          <Line
            data={data}
            options={OPTIONS.MONTHLY_INCOME_SPEND_STATS(
              theme.palette.secondary.main
            )}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
