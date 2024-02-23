import { createTheme } from '@mui/material';

import { COLORS } from './colors.const';

const MUI = Object.freeze({
  size: 'small',
  variant: 'outlined',
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
    components: {
      MuiButton: {
        defaultProps: {
          variant: MUI.variant,
        },
      },
      MuiAlert: {
        defaultProps: {
          variant: MUI.variant,
        },
      },
      MuiTextField: {
        defaultProps: {
          size: MUI.size,
          fullWidth: true,
          margin: 'dense',
        },
      },
      MuiSelect: {
        defaultProps: {
          size: MUI.size,
          variant: MUI.variant,
        },
      },
      MuiContainer: {
        defaultProps: {
          maxWidth: 'lg',
        },
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
    components: {
      MuiButton: {
        defaultProps: {
          variant: MUI.variant,
        },
      },
      MuiAlert: {
        defaultProps: {
          variant: MUI.variant,
        },
      },
      MuiTextField: {
        defaultProps: {
          size: MUI.size,
          fullWidth: true,
          margin: 'dense',
        },
      },
      MuiSelect: {
        defaultProps: {
          size: MUI.size,
          variant: MUI.variant,
        },
      },
      MuiContainer: {
        defaultProps: {
          maxWidth: 'lg',
        },
      },
    },
  }),
};
