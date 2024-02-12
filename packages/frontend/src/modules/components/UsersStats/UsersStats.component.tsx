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

import { COLORS, SPACES } from '../../theme';
import { statsService } from '../../services';
import { IRange, IUserStats } from '../../types';
import { AppLoader, RangeSelect } from '../../UI';
import { OPTIONS, QUERY_KEYS, RANGE_INITIAL_STATE } from '../../constants';

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
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryFn: () => statsService.getUsersStats(),
  });

  if (!isSuccess) {
    return <AppLoader />;
  }

  const data = {
    labels: stats.map((stat) => stat.username),
    datasets: [
      {
        label: 'Incomes',
        data: stats.map((stat) => stat.income[range]),
        backgroundColor: COLORS.success,
      },
      {
        label: 'Spends',
        data: stats.map((stat) => stat.spend[range]),
        backgroundColor: COLORS.red,
      },
    ],
  };

  // const data = React.useMemo(() => ({
  //   labels: stats.map((stat) => stat.username),
  //   datasets: [
  //     {
  //       label: 'Incomes',
  //       data: stats.map((stat) => stat.income[range]),
  //       backgroundColor: '#36A2EB',
  //     },
  //     {
  //       label: 'Spends',
  //       data: stats.map((stat) => stat.spend[range]),
  //       backgroundColor: '#FF6384',
  //     },
  //   ],
  // }), [stats, range]);

  const handleRangeChange = (event: SelectChangeEvent) =>
    setRange(event.target.value as IRange);

  return (
    <Card sx={{ margin: SPACES.l, width: '500px', display: 'inline-block' }}>
      <CardContent>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Bar options={OPTIONS.USERS_STATS} data={data} />
        </Box>
        <RangeSelect rangeValue={range} handleChange={handleRangeChange} />
      </CardContent>
    </Card>
  );
};
