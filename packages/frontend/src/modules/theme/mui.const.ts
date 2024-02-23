import { createTheme } from '@mui/material';

import { COLORS } from './colors.const';

export const MUI = Object.freeze({
  variant: 'outlined',
  density: 'compact',
  margin: 'dense',
  size: 'small',
  containerWidth: 'lg',
});

export const THEME = {
  LIGHT: createTheme({
    palette: {
      mode: 'light',
      background: {
        default: COLORS.greyishwhite,
      },
      primary: {
        main: COLORS.blue,
        contrastText: COLORS.white,
      },
      secondary: {
        main: COLORS.black,
        contrastText: COLORS.yellow,
      },
    },
  }),
  DARK: createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: COLORS.blue,
        contrastText: COLORS.white,
      },
      secondary: {
        main: COLORS.white,
        contrastText: COLORS.purple,
      },
    },
  }),
};
