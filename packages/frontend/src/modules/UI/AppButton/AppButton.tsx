import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

import { BORDER_RADIUS, MUI, SPACES } from '../../theme';

interface AppButtonProps extends ButtonProps {
  text?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  sx,
  text,
  children,
  ...props
}) => (
  <Button
    sx={{
      fontWeight: 600,
      borderRadius: BORDER_RADIUS,
      textTransform: 'capitalize',
      padding: `${SPACES.xs} ${SPACES.sm}`,
      ':hover': {
        borderWidth: '2px',
        padding: '4.6px 11px',
      },
      ...sx,
    }}
    variant={MUI.variant}
    {...props}
  >
    {text || children}
  </Button>
);
