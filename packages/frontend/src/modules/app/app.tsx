import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { THEME } from '../theme';
import { AlertStack } from '../UI';
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
            <MainRouter />
            <AlertStack />
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </ColorModeContext.Provider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
