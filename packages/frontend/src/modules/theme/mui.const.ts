import { createTheme } from '@mui/material';

import { COLORS } from './colors.const';

export const MUI = Object.freeze({
  variant: 'outlined',
  density: 'compact',
  margin: 'dense',
  size: 'small',
  containerWidth: 'lg',
});

export const THEME = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: COLORS.greyishwhite,
    },
    primary: {
      main: COLORS.blue,
      contrastText: COLORS.lightPurple,
    },
    secondary: {
      main: COLORS.lightPurple,
      contrastText: COLORS.lightPurple,
    },
  },
  typography: {
    fontWeightBold: 700,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});
