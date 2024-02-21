import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Card, CardContent, SelectChangeEvent } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Range } from '../../types';
import { RangeSelect } from '../../UI';
import { BORDER_RADIUS, SPACES } from '../../theme';
import { RANGE_INITIAL_STATE } from '../../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

interface BarChartProps {
  options: any;
  labels: string[];
  preDatasets: any[];
}

export const BarChart: React.FC<BarChartProps> = ({
  options,
  labels,
  preDatasets,
}) => {
  const [range, setRange] = React.useState<Range>(RANGE_INITIAL_STATE);

  const data = {
    labels,
    datasets: preDatasets.map((pds) => ({
      ...pds,
      data: pds.data.map((el: any) => el[range]),
    })),
  };

  const handleRangeChange = (event: SelectChangeEvent) =>
    setRange(event.target.value as Range);

  return (
    <Card sx={{ margin: SPACES.m, width: 530, borderRadius: BORDER_RADIUS }}>
      <CardContent>
        <Box>
          <Bar options={options} data={data} />
        </Box>
        <RangeSelect rangeValue={range} handleChange={handleRangeChange} />
      </CardContent>
    </Card>
  );
};
