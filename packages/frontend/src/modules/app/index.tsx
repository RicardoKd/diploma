import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { App } from './app';
import { THEME } from '../theme';
import queryClient from './queryClient';

const AppContainer = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={THEME}>
        <CssBaseline />
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default AppContainer;
