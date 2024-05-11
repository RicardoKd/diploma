import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent } from '@mui/material';
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

import { OPTIONS } from '../../constants';
import { STATS_CARD_STYLES } from '../../theme';
import { IMonthlyIncomeSpendStats } from '../../types';

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
  stats: IMonthlyIncomeSpendStats[];
}

export const MonthlyIncomeSpendStats: React.FC<
  MonthlyIncomeSpendStatsProps
> = ({ stats }) => {
  const theme = useTheme();

  const data = {
    labels: stats.map((st) => st.month_year),
    datasets: [
      {
        label: 'Incomes',
        data: stats.map((st) => st.income),
        borderColor: theme.palette.success.light,
        backgroundColor: theme.palette.success.main,
      },
      {
        label: 'Spends',
        data: stats.map((st) => st.spend),
        borderColor: theme.palette.error.light,
        backgroundColor: theme.palette.error.main,
      },
    ],
  };

  return (
    <Card sx={{ height: { lg: 344 }, ...STATS_CARD_STYLES }}>
      <CardContent>
        <Line
          data={data}
          options={OPTIONS.MONTHLY_INCOME_SPEND_STATS(
            theme.palette.secondary.main
          )}
        />
      </CardContent>
    </Card>
  );
};
