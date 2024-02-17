import React from 'react';
import { useQuery } from 'react-query';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Card, CardContent, SelectChangeEvent } from '@mui/material';

import { Range } from '../../types';
import { SPACES } from '../../theme';
import { statsService } from '../../services';
import { AppLoader, RangeSelect, Table } from '../../UI';
import { QUERY_KEYS, RANGE_INITIAL_STATE } from '../../constants';

export const PopularCategories = () => {
  const [range, setRange] = React.useState<Range>(RANGE_INITIAL_STATE);

  const { isSuccess, data: stats } = useQuery({
    keepPreviousData: true,
    refetchOnMount: 'always',
    queryKey: [QUERY_KEYS.POPULAR_CATEGORIES],
    queryFn: () => statsService.getPopularCategoriesStats(),
  });

  if (!isSuccess) {
    return <AppLoader />;
  }

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
    <Card sx={{ width: 530, margin: SPACES.l }}>
      <CardContent>
        <Box sx={{ height: 249 }}>
          <Table rows={rows} isLoading={false} columns={columns} />
        </Box>
        <RangeSelect rangeValue={range} handleChange={handleRangeChange} />
      </CardContent>
    </Card>
  );
};
