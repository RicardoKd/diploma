import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useQuery } from 'react-query';
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

import { SPACES } from '../../theme';
import { statsService } from '../../services';
import { IRange, IUserStats } from '../../types';
import { AppLoader, RangeSelect } from '../../UI';
import { QUERY_KEYS, RANGE_INITIAL_STATE } from '../../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const UsersStats = () => {
  const [range, setRange] = React.useState<IRange>(RANGE_INITIAL_STATE);

  const { isSuccess, data: stats } = useQuery<IUserStats[]>({
    queryKey: [QUERY_KEYS.USER_STATS],
    queryFn: () => statsService.getUsersStats(),
  });

  if (!isSuccess) {
    return <AppLoader />;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Incomes and spends by user',
      },
    },
  };

  const data = {
    labels: stats.map((stat) => stat.username),
    datasets: [
      {
        label: 'Incomes',
        data: stats.map((stat) => stat.income[range]),
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Spends',
        data: stats.map((stat) => stat.spend[range]),
        backgroundColor: '#FF6384',
      },
    ],
  };

  const handleRangeChange = (event: SelectChangeEvent) =>
    setRange(event.target.value as IRange);

  return (
    <Card sx={{ margin: SPACES.l, width: '500px', display: 'inline-block' }}>
      <CardContent>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Bar options={options} data={data} />
        </Box>
        <RangeSelect rangeValue={range} handleChange={handleRangeChange} />
      </CardContent>
    </Card>
  );
};
