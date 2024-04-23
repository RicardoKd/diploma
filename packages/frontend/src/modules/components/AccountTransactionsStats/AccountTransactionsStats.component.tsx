import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useTheme } from '@mui/material/styles';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  Box,
  Card,
  Typography,
  CardContent,
  SelectChangeEvent,
} from '@mui/material';

import { RangeSelect } from '../../UI';
import { IIncomeSpendRangeStats, Range } from '../../types';
import { OPTIONS, RANGE_INITIAL_STATE } from '../../constants';
import { BORDER_RADIUS, CARD_WIDTH, SPACES } from '../../theme';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AccountsCardProps {
  stats: IIncomeSpendRangeStats;
}

export const AccountTransactionsStats: React.FC<AccountsCardProps> = ({
  stats,
}) => {
  const theme = useTheme();
  const [range, setRange] = React.useState<Range>(RANGE_INITIAL_STATE);

  const data = {
    labels: ['Spends', 'Incomes'],
    datasets: [
      {
        data: [stats.spend[range], stats.income[range]],
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
        width: CARD_WIDTH,
        borderRadius: BORDER_RADIUS,
        margin: `${SPACES.m} ${SPACES.xs}`,
      }}
    >
      <CardContent
        sx={{ height: 344, display: 'flex', justifyContent: 'stretch' }}
      >
        <Pie
          data={data}
          options={OPTIONS.ACCOUNT_TRANSACTION_STATS(
            theme.palette.secondary.main
          )}
        />
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          margin={`0 ${SPACES.xl}`}
          justifyContent="space-evenly"
        >
          <Typography variant="body1">Spend: {stats.spend[range]}</Typography>
          <Typography variant="body1">Income: {stats.income[range]}</Typography>
          <RangeSelect rangeValue={range} handleChange={handleRangeChange} />
        </Box>
      </CardContent>
    </Card>
  );
};
