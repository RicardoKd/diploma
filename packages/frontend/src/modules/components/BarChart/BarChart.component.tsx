import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, SelectChangeEvent } from '@mui/material';
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
import { RANGE_INITIAL_STATE } from '../../constants';
import { BORDER_RADIUS, CARD_WIDTH, SPACES } from '../../theme';

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
  labels,
  options,
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
    <Card
      sx={{
        width: CARD_WIDTH,
        borderRadius: BORDER_RADIUS,
        margin: `${SPACES.m} ${SPACES.xs}`,
      }}
    >
      <CardContent>
        <Bar options={options} data={data} />
        <RangeSelect rangeValue={range} handleChange={handleRangeChange} />
      </CardContent>
    </Card>
  );
};
