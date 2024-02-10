import { Bar } from 'react-chartjs-2';
import { useQuery } from 'react-query';
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Box,
  Card,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CardContent,
  SelectChangeEvent,
} from '@mui/material';

import { MUI, SPACES } from '../../theme';
import { AppLoader, MainStyled } from '../../UI';
import { transactionService } from '../../services';
import { IAccountStatsRange, IRange } from '../../types';
import { QUERY_KEYS, RANGE_INITIAL_STATE } from '../../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CategoriesStatsProps {
  accountId: string;
}

export const CategoriesStats: React.FC<CategoriesStatsProps> = ({
  accountId,
}) => {
  const [spendRange, setSpendRange] = useState<IRange>(RANGE_INITIAL_STATE);
  const [incomeRange, setIncomeRange] = useState<IRange>(RANGE_INITIAL_STATE);

  const { isSuccess: incomeIsSuccess, data: incomeStats } =
    useQuery<IAccountStatsRange>({
      queryKey: [QUERY_KEYS.INCOME_STATS, accountId],
      queryFn: () =>
        transactionService.getCategoryStats({
          accountId,
          type: 'income',
        }),
    });

  const { isSuccess: spendIsSuccess, data: spendStats } =
    useQuery<IAccountStatsRange>({
      queryKey: [QUERY_KEYS.SPEND_STATS, accountId],
      queryFn: () =>
        transactionService.getCategoryStats({
          accountId,
          type: 'spend',
        }),
    });

  if (!incomeIsSuccess || !spendIsSuccess) {
    return (
      <MainStyled>
        <AppLoader />
      </MainStyled>
    );
  }

  const data = {
    income: {
      labels: incomeStats[incomeRange].map((stat) => stat.category),
      datasets: [
        {
          backgroundColor: '#36A2EB',
          data: incomeStats[incomeRange].map((stat) => stat.percentage),
        },
      ],
    },
    spend: {
      labels: spendStats[spendRange].map((stat) => stat.category),
      datasets: [
        {
          backgroundColor: '#36A2EB',
          data: spendStats[spendRange].map((stat) => stat.percentage),
        },
      ],
    },
  };

  const options = {
    income: {
      plugins: {
        title: {
          display: true,
          text: 'Income categories statistics',
        },
        legend: {
          display: false,
        },
      },
    },
    spend: {
      plugins: {
        title: {
          display: true,
          text: 'Spend categories statistics',
        },
        legend: {
          display: false,
        },
      },
    },
  };

  const handleIncomeRangeChange = (event: SelectChangeEvent) =>
    setIncomeRange(event.target.value as IRange);

  const handleSpendRangeChange = (event: SelectChangeEvent) =>
    setSpendRange(event.target.value as IRange);

  return (
    <div>
      <Card sx={{ margin: SPACES.l, width: '500px', display: 'inline-block' }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Bar options={options.income} data={data.income} />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            <FormControl>
              <InputLabel id="range-select-label">Range</InputLabel>
              <Select
                value={incomeRange}
                label="Range"
                size={MUI.size}
                variant={MUI.variant}
                labelId="range-select-label"
                onChange={handleIncomeRangeChange}
              >
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="quarter">Quarter</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ margin: SPACES.l, width: '500px', display: 'inline-block' }}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Bar options={options.spend} data={data.spend} />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            <FormControl>
              <InputLabel id="range-select2-label">Range</InputLabel>
              <Select
                value={spendRange}
                label="Range"
                size={MUI.size}
                variant={MUI.variant}
                labelId="range-select2-label"
                onChange={handleSpendRangeChange}
              >
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="quarter">Quarter</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};
