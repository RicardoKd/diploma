import React from 'react';
import { ButtonProps } from '@mui/material/Button';
import { AppButtonStyled } from './AppButton.styled';
import { MUI } from '../../theme';

interface AppButtonProps extends ButtonProps {
  text: string;
}

export const AppButton: React.FC<AppButtonProps> = ({ text, ...props }) => (
  <AppButtonStyled variant={MUI.variant} {...props}>
    {text}
  </AppButtonStyled>
);
