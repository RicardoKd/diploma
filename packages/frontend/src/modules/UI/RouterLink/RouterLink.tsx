import { Link } from 'react-router-dom';
import { ButtonProps } from '@mui/material/Button';

import React from 'react';
import { AppButton } from '../AppButton/AppButton';

interface AppButtonProps extends ButtonProps {
  text: string;
  to: string;
}

export const RouterLink: React.FC<AppButtonProps> = ({ text, to, ...props }) => (
  <Link to={to}>
    <AppButton text={text} {...props} />
  </Link>
);
