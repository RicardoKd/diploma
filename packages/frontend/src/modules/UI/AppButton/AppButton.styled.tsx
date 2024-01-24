import styled from 'styled-components';
import Button from '@mui/material/Button';

import { COLORS, SPACES } from '../../theme';

export const AppButtonStyled = styled(Button)`
  color: ${COLORS.white} !important;
  border-radius: 5px !important;
  border-color: ${COLORS.white} !important;
  text-transform: capitalize !important;
  padding: ${SPACES.xs} ${SPACES.sm} !important;
`;
