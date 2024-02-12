import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useQuery } from 'react-query';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  Box,
  Card,
  Typography,
  CardContent,
  SelectChangeEvent,
} from '@mui/material';

import { AppLoader, RangeSelect } from '../../UI';
import { SPACES } from '../../theme';
import { accountService } from '../../services';
import { IAccountTransactionsStats, IRange } from '../../types';
import { QUERY_KEYS, RANGE_INITIAL_STATE } from '../../constants';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AccountsCardProps {
  accountId: string;
}

export const AccountTransactionsStats: React.FC<AccountsCardProps> = ({
  accountId,
}) => {
  const [range, setRange] = React.useState<IRange>(RANGE_INITIAL_STATE);

  const { isSuccess, data: account } = useQuery<IAccountTransactionsStats>({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.ACCOUNT_TRANSACTIONS_STATS, accountId],
    queryFn: () =>
      accountService.getAccountTransactionsStatsById({ accountId }),
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
        text: 'Spends to incomes ratio',
      },
    },
  };

  const data = {
    labels: ['Spends', 'Incomes'],
    datasets: [
      {
        data: [account.spend[range], account.income[range]],
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const handleRangeChange = (event: SelectChangeEvent) =>
    setRange(event.target.value as IRange);

  return (
    <Card sx={{ maxWidth: 400, minWidth: 300, margin: SPACES.l }}>
      <CardContent>
        <Box>
          <Pie data={data} options={options} />
        </Box>

        <Box
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
          mb={1}
        >
          <Typography variant="body1">Spend: {account.spend[range]}</Typography>
          <Typography variant="body1">
            Income: {account.income[range]}
          </Typography>
        </Box>
        <RangeSelect rangeValue={range} handleChange={handleRangeChange} />
      </CardContent>
    </Card>
  );
};
