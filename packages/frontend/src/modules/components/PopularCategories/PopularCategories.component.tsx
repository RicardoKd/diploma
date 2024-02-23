import React from 'react';
import { Box, Card, CardContent, SelectChangeEvent } from '@mui/material';

import { RangeSelect, Table } from '../../UI';
import { BORDER_RADIUS, SPACES } from '../../theme';
import { IUserPopularCategoriesRangeStats, Range } from '../../types';
import {
  RANGE_INITIAL_STATE,
  GET_POPULAR_CATEGORIES_COLUMN_DEFINITIONS,
} from '../../constants';

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

  return (
    <Card sx={{ width: 530, margin: SPACES.m, borderRadius: BORDER_RADIUS }}>
      <CardContent>
        <Box sx={{ height: 241, overflowX: 'auto', mb: 1 }}>
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
