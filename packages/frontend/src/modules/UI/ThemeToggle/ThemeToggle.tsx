import React from 'react';
import {
  useTheme,
  IconButton,
  ExtendButtonBase,
  IconButtonTypeMap,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { ColorModeContext } from '../../contexts';

export const ThemeToggle = () => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  return (
    <IconButton
      edge="end"
      color="inherit"
      aria-label="mode"
      onClick={colorMode.toggleColorMode}
    >
      {theme.palette.mode === 'dark' ? (
        <Brightness7Icon />
      ) : (
        <Brightness4Icon />
      )}
    </IconButton>
  );
};
