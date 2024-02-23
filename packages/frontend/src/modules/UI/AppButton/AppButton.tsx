import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';

import { BORDER_RADIUS, SPACES } from '../../theme';

export const AppButton: React.FC<ButtonProps> = ({
  sx,
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
    {...props}
  >
    {children}
  </Button>
);
