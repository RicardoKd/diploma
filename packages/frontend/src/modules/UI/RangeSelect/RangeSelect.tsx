import React from 'react';

import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';

import { MUI } from '../../theme';
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
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mt={1}
    >
      <FormControl>
        <InputLabel id="range-select2-label">Range</InputLabel>
        <Select
          value={rangeValue}
          label="Range"
          size={MUI.size}
          variant={MUI.variant}
          labelId="range-select2-label"
          onChange={handleChange}
        >
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="quarter">Quarter</MenuItem>
          <MenuItem value="year">Year</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
