import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools';

import '../../style.css';
import { App } from './app';
import * as theme from '../theme';
import * as Styled from './app.styled';
import queryClient from './queryClient';

const AppContainer = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Styled.GlobalStyles />
      <QueryClientProvider client={queryClient}>
        <App />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default AppContainer;
