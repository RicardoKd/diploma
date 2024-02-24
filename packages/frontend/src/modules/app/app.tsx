import React from 'react';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { THEME } from '../theme';
import { AlertStack } from '../UI';
import queryClient from './queryClient';
import { MainRouter } from '../navigation';
import { SNACKBAR_CONF } from '../constants';
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
            <SnackbarProvider
            
            Components={{
              error: AlertStack,
              success: AlertStack
            }}
            
              maxSnack={SNACKBAR_CONF.maxSnack}
              autoHideDuration={SNACKBAR_CONF.autoHideDuration}
            >
              <MainRouter />
            </SnackbarProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </ColorModeContext.Provider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
