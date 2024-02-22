import React from 'react';
import { useQuery } from 'react-query';
import { Box, Card, CardContent, SelectChangeEvent } from '@mui/material';

import { Range } from '../../types';
import { statsService } from '../../services';
import { BORDER_RADIUS, SPACES } from '../../theme';
import { AppLoader, RangeSelect, Table } from '../../UI';
import {
  QUERY_KEYS,
  RANGE_INITIAL_STATE,
  GET_POPULAR_CATEGORIES_COLUMN_DEFINITIONS,
} from '../../constants';

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

  return (
    <Card sx={{ width: 530, margin: SPACES.m, borderRadius: BORDER_RADIUS }}>
      <CardContent>
        <Box sx={{ height: 249, overflowX: 'auto' }}>
          <Table
            rows={rows}
            isLoading={false}
            columns={GET_POPULAR_CATEGORIES_COLUMN_DEFINITIONS()}
          />
        </Box>
        <RangeSelect rangeValue={range} handleChange={handleRangeChange} />
      </CardContent>
    </Card>
  );
};
