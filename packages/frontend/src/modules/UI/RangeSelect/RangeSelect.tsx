import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';

import { Range } from '../../types';

interface RangeSelectProps {
  rangeValue: Range;
  handleChange: (event: SelectChangeEvent) => void;
}

export const RangeSelect: React.FC<RangeSelectProps> = ({
  rangeValue,
  handleChange,
}) => {
  return (
    <Box
      mt={1}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <FormControl>
        <InputLabel id="range-select2-label">Range</InputLabel>
        <Select
          label="Range"
          value={rangeValue}
          onChange={handleChange}
          labelId="range-select2-label"
        >
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="quarter">Quarter</MenuItem>
          <MenuItem value="year">Year</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
