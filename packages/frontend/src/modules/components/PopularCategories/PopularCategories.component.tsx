import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Card, CardContent, SelectChangeEvent } from '@mui/material';

import { RangeSelect, Table } from '../../UI';
import { BORDER_RADIUS, SPACES } from '../../theme';
import { RANGE_INITIAL_STATE } from '../../constants';
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
    income: income[range],
    spend: spend[range] || 'NO_DATA',
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
    <Card sx={{ width: 530, margin: SPACES.m, borderRadius: BORDER_RADIUS }}>
      <CardContent>
        <Box sx={{ height: 241, overflowX: 'auto', mb: 1 }}>
          <Table rows={rows} columns={columns} isLoading={false} />
        </Box>
        <RangeSelect rangeValue={range} handleChange={handleRangeChange} />
      </CardContent>
    </Card>
  );
};
