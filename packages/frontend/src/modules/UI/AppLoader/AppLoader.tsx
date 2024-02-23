import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export const AppLoader = () => (
  <Box
    sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress />
  </Box>
);
