import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Card,
  Typography,
  CardContent,
  SelectChangeEvent,
} from '@mui/material';

import { RangeSelect, Table } from '../../UI';
import { NA, RANGE_INITIAL_STATE } from '../../constants';
import { BORDER_RADIUS, CARD_WIDTH, SPACES } from '../../theme';
import { IUserPopularCategoriesRangeStats, Range } from '../../types';

interface PopularCategoriesProps {
  stats: IUserPopularCategoriesRangeStats[];
}

export const PopularCategories: React.FC<PopularCategoriesProps> = ({
  stats,
}) => {
  const [range, setRange] = React.useState<Range>(RANGE_INITIAL_STATE);

  const handleRangeChange = (event: SelectChangeEvent) =>
    setRange(event.target.value as Range);

  const rows = stats.map(({ username, income, spend }, id) => ({
    id,
    username,
    income: income[range] || NA,
    spend: spend[range] || NA,
  }));

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      field: 'username',
      headerName: 'User',
    },
    {
      flex: 0.5,
      field: 'income',
      headerName: 'Income category',
    },
    {
      flex: 0.5,
      field: 'spend',
      headerName: 'Spend category',
    },
  ];

  return (
    <Card
      sx={{
        width: CARD_WIDTH,
        borderRadius: BORDER_RADIUS,
        margin: `${SPACES.m} ${SPACES.xs}`,
      }}
    >
      <CardContent>
        <Typography
          component="p"
          sx={{
            fontSize: '12px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '6px',
          }}
        >
          Most popular categories by user
        </Typography>
        <Box sx={{ height: 232, overflowX: 'auto', mb: 1 }}>
          <Table rows={rows} columns={columns} isLoading={false} />
        </Box>
        <RangeSelect rangeValue={range} handleChange={handleRangeChange} />
      </CardContent>
    </Card>
  );
};
