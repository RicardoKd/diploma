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

import { Range } from '../../types';
import { COLORS, SPACES } from '../../theme';
import { statsService } from '../../services';
import { AppLoader, RangeSelect } from '../../UI';
import { OPTIONS, QUERY_KEYS, RANGE_INITIAL_STATE } from '../../constants';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AccountsCardProps {
  accountId: string;
}

export const AccountTransactionsStats: React.FC<AccountsCardProps> = ({
  accountId,
}) => {
  const [range, setRange] = React.useState<Range>(RANGE_INITIAL_STATE);

  const { isSuccess, data: account } = useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT_TRANSACTIONS_STATS, accountId],
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryFn: () => statsService.getAccountTransactionsStatsById({ accountId }),
  });

  if (!isSuccess) {
    return <AppLoader />;
  }

  const data = {
    labels: ['Spends', 'Incomes'],
    datasets: [
      {
        data: [account.spend[range], account.income[range]],
        backgroundColor: [COLORS.red, COLORS.success],
      },
    ],
  };

  const handleRangeChange = (event: SelectChangeEvent) =>
    setRange(event.target.value as Range);

  return (
    <Card sx={{ maxWidth: 400, minWidth: 300, margin: SPACES.l }}>
      <CardContent>
        <Box>
          <Pie data={data} options={OPTIONS.ACCOUNT_TRANSACTION_STATS} />
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
