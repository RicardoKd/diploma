import { Pie } from 'react-chartjs-2';
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
  SelectChangeEvent
} from '@mui/material';

import { MUI } from '../../theme';
import { RouterLink } from '../../UI';
import { IAccount, IRange } from '../../types';
import { RANGE_INITIAL_STATE, ROUTER_KEYS } from '../../constants';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AccountsCardProps {
  account: IAccount;
}

export const AccountCard: React.FC<AccountsCardProps> = ({ account }) => {
  const [range, setRange] = useState<IRange>(RANGE_INITIAL_STATE);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { _id, title, income, spend } = account;
  const rangedSpend = spend[range] ? spend[range] : 0;
  const rangedIncome = income[range] ? income[range] : 0;

  const data = {
    labels: ['Spend', 'Income'],
    datasets: [
      {
        data: [rangedSpend, rangedIncome],
        backgroundColor: ['#FF6384', '#36A2EB']
      }
    ]
  };

  const handleRangeChange = (event: SelectChangeEvent) => setRange(event.target.value as IRange);

  return (
    <Card sx={{ maxWidth: 400, height: 500, margin: '20px' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Pie data={data} />
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="body1" color="textSecondary">
            Spend:
          </Typography>
          <Typography variant="body1">{rangedSpend}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Typography variant="body1" color="textSecondary">
            Income:
          </Typography>
          <Typography variant="body1">{rangedIncome}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <RouterLink text="View" to={`${ROUTER_KEYS.HOME}${ROUTER_KEYS.VIEW_ACCOUNT}/${_id}`} />
          <RouterLink
            text="Statistics"
            to={`${ROUTER_KEYS.HOME}${ROUTER_KEYS.ACCOUNT_STATS}/${_id}`}
          />
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
