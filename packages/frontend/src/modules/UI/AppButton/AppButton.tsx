import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { COLORS, MUI, SPACES } from '../../theme';

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
      color: COLORS.white,
      borderRadius: '5px',
      borderColor: COLORS.white,
      textTransform: 'capitalize',
      padding: `${SPACES.xs} ${SPACES.sm}`,
      ':hover': {
        bgcolor: COLORS.lightPurple, 
        borderColor: COLORS.lightPurple,
      },
      ...sx,
    }}
    variant={MUI.variant}
    {...props}
  >
    {text || children}
  </Button>
);
