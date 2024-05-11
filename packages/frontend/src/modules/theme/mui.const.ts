import { createTheme } from '@mui/material';

import { COLORS } from './colors.const';
import { BORDER_RADIUS, SPACES } from './spaces.const';

const MUI = Object.freeze({ size: 'small', variant: 'outlined' });

const CARD_WIDTH = 560;

export const STATS_CARD_STYLES = {
  minWidth: CARD_WIDTH,
  borderRadius: BORDER_RADIUS,
  margin: `${SPACES.m} ${SPACES.xs}`,
  width: { xs: '100%', md: '80%', lg: CARD_WIDTH },
};

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
