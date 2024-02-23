import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useQuery } from 'react-query';
import { useTheme } from '@mui/material/styles';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  Box,
  Card,
  Typography,
  CardContent,
  SelectChangeEvent,
} from '@mui/material';

import { Range } from '../../types';
import { statsService } from '../../services';
import { AppLoader, RangeSelect } from '../../UI';
import { BORDER_RADIUS, SPACES } from '../../theme';
import { OPTIONS, QUERY_KEYS, RANGE_INITIAL_STATE } from '../../constants';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AccountsCardProps {
  accountId: string;
}

export const AccountTransactionsStats: React.FC<AccountsCardProps> = ({
  accountId,
}) => {
  const theme = useTheme();
  const [range, setRange] = React.useState<Range>(RANGE_INITIAL_STATE);
  const { isSuccess, data: account } = useQuery({
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryKey: [QUERY_KEYS.ACCOUNT_TRANSACTIONS_STATS, accountId],
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
        backgroundColor: [
          theme.palette.error.light,
          theme.palette.success.light,
        ],
      },
    ],
  };

  const handleRangeChange = (event: SelectChangeEvent) =>
    setRange(event.target.value as Range);

  return (
    <Card
      sx={{
        maxWidth: 400,
        minWidth: 300,
        margin: SPACES.l,
        borderRadius: BORDER_RADIUS,
      }}
    >
      <CardContent>
        <Box>
          <Pie
            data={data}
            options={OPTIONS.ACCOUNT_TRANSACTION_STATS(
              theme.palette.secondary.main
            )}
          />
        </Box>

        <Box
          mb={1}
          display="flex"
          alignItems="center"
          justifyContent="space-evenly"
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
