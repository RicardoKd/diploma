import React from 'react';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { THEME } from '../theme';
import queryClient from './queryClient';
import { MainRouter } from '../navigation';
import { ColorModeContext } from '../contexts';
import { getIsDarkMode, setIsDarkMode } from '../utils';

export const App = () => {
  const [isDark, setMode] = React.useState<boolean>(getIsDarkMode());

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          setIsDarkMode(!prevMode);

          return !prevMode;
        });
      },
    }),
    []
  );

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={isDark ? THEME.DARK : THEME.LIGHT}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
              <MainRouter />
            </SnackbarProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </ColorModeContext.Provider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
