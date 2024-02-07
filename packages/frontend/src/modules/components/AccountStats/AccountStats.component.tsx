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
  CardActions,
  SelectChangeEvent,
} from '@mui/material';

import { IRange } from '../../types';
import { AppLoader } from '../../UI';
import { COLORS, MUI } from '../../theme';
import { accountService } from '../../services';
import { QUERY_KEYS, RANGE_INITIAL_STATE } from '../../constants';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface IAccountStats {
  id: string;
  income: {
    year: number;
    quarter: number;
    month: number;
  };
  spend: {
    year: number;
    quarter: number;
    month: number;
  };
}

interface AccountsCardProps {
  accountId: string;
}

export const AccountStats: React.FC<AccountsCardProps> = ({ accountId }) => {
  const [range, setRange] = useState<IRange>(RANGE_INITIAL_STATE);

  const { isSuccess, data: account } = useQuery<IAccountStats>({
    keepPreviousData: true,
    queryKey: [QUERY_KEYS.ACCOUNT_TRANSACTIONS_STATS],
    queryFn: () => accountService.getAccountTransactionsStatsById({ accountId }),
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
    <Card
      sx={{
        maxWidth: 400,
        minWidth: 300,
        margin: '20px',
        padding: '5px',
        color: COLORS.white,
        background: COLORS.black,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Pie data={data} />
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography variant="body1">Spend:</Typography>
          <Typography variant="body1">{account.spend[range]}</Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={1}
        >
          <Typography variant="body1">Income:</Typography>
          <Typography variant="body1">{account.income[range]}</Typography>
        </Box>
      </CardContent>

      <CardActions>
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
      </CardActions>
    </Card>
  );
};
