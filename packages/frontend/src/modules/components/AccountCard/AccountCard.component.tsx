import { Pie } from 'react-chartjs-2';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
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
  CardActions,
} from '@mui/material';

import { COLORS, MUI } from '../../theme';
import { AppButton, RouterLink } from '../../UI';
import { IAccount, IRange, ITransaction } from '../../types';
import { QUERY_KEYS, RANGE_INITIAL_STATE, ROUTER_KEYS } from '../../constants';
import { useMutation } from 'react-query';
import { accountService } from '../../services';
import { showError, showSuccess } from '../../utils';
import queryClient from '../../app/queryClient';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AccountsCardProps {
  account: IAccount;
}

export const AccountCard: React.FC<AccountsCardProps> = ({ account }) => {
  // const [range, setRange] = useState<IRange>(RANGE_INITIAL_STATE);

  const { id, title, income, spend } = account;
  // const rangedSpend = spend[range] ? spend[range] : 0;
  // const rangedIncome = income[range] ? income[range] : 0;

  // const data = {
  //   labels: ['Spend', 'Income'],
  //   datasets: [
  //     {
  //       data: [rangedSpend, rangedIncome],
  //       backgroundColor: ['#FF6384', '#36A2EB'],
  //     },
  //   ],
  // };

  // const handleRangeChange = (event: SelectChangeEvent) =>
  //   setRange(event.target.value as IRange);

  const onChangeSuccess = () => {
    showSuccess(`Account "${title}" deleted`);
    queryClient.refetchQueries(QUERY_KEYS.ACCOUNTS);
  };

  const deleteMutation = useMutation(
    accountService.deleteById.bind(accountService),
    {
      onSuccess: () => onChangeSuccess(),
      onError: () => showError('Failed to delete account'),
    }
  );

  return (
    <Card
      sx={{
        maxWidth: 400,
        minWidth: 300,
        margin: '20px',
        background: COLORS.black,
        color: COLORS.white,
        padding: '5px',
      }}
    >
      <CardContent>
        {/* <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Pie data={data} />
        </Box> */}
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Typography variant="body1">Spend:</Typography>
          <Typography variant="body1">{spend['month'] || 0}</Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={1}
        >
          <Typography variant="body1">Income:</Typography>
          <Typography variant="body1">{income['month'] || 0}</Typography>
        </Box>
      </CardContent>
      <CardActions>
        <RouterLink
          text="View"
          onClick={() => queryClient.setQueryData(QUERY_KEYS.CURRENT_ACCOUNT, id)}
          to={`${ROUTER_KEYS.HOME}${ROUTER_KEYS.VIEW_ACCOUNT}/${id}`}
        />
        <RouterLink
          text="Statistics"
          to={`${ROUTER_KEYS.HOME}${ROUTER_KEYS.ACCOUNT_STATS}/${id}`}
        />
        <AppButton onClick={() => deleteMutation.mutate({ id })}>
          <DeleteIcon />
        </AppButton>
        {/* <FormControl>
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
        </FormControl> */}
      </CardActions>
    </Card>
  );
};
