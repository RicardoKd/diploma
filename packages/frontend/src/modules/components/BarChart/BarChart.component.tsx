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

import { SPACES } from '../../theme';
import { Range } from '../../types';
import { RangeSelect } from '../../UI';
import { RANGE_INITIAL_STATE } from '../../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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

  const data1 = {
    labels,
    datasets: preDatasets.map((pds) => ({
      ...pds,
      data: pds.data.map((el: any) => el[range]),
    })),
  };

  const handleRangeChange = (event: SelectChangeEvent) =>
    setRange(event.target.value as Range);

  return (
    <Card sx={{ margin: SPACES.l, width: '530px' }}>
      <CardContent>
        <Box>
          <Bar options={options} data={data1} />
        </Box>
        <RangeSelect rangeValue={range} handleChange={handleRangeChange} />
      </CardContent>
    </Card>
  );
};
