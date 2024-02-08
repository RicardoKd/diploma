import { Pie } from 'react-chartjs-2';
import { useQuery } from 'react-query';
import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  Box,
  Card,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  FormControl,
  CardContent,
  SelectChangeEvent,
} from '@mui/material';

import { MUI, SPACES } from '../../theme';
import { AppLoader } from '../../UI';
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
  const [range, setRange] = useState<IRange>(RANGE_INITIAL_STATE);

  const { isSuccess, data: account } = useQuery<IAccountTransactionsStats>({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.ACCOUNT_TRANSACTIONS_STATS, accountId],
    queryFn: () =>
      accountService.getAccountTransactionsStatsById({ accountId }),
  });

  console.log('account :>> ', account);
  if (!isSuccess) {
    return <AppLoader />;
  }

  const data = {
    labels: ['Spend', 'Income'],
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
          <Pie data={data} />
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

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <FormControl>
            <InputLabel id="range-select-label">Range</InputLabel>
            <Select
              value={range}
              label="Range"
              size={MUI.size}
              variant={MUI.variant}
              labelId="range-select-label"
              onChange={handleRangeChange}
            >
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="quarter">Quarter</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
};
