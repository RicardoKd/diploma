import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { COLORS, MUI, SPACES } from '../../theme';

interface AppButtonProps extends ButtonProps {
  text?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  text,
  children,
  ...props
}) => (
  <Button
    sx={{
      color: COLORS.white,
      borderRadius: '5px',
      bgcolor: COLORS.black,
      borderColor: COLORS.white,
      textTransform: 'capitalize',
      padding: `${SPACES.xs} ${SPACES.sm}`,
      ':hover': {
        color: COLORS.black,
        bgcolor: COLORS.white,
      },
    }}
    variant={MUI.variant}
    {...props}
  >
    {text || children}
  </Button>
);
