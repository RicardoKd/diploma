import styled from 'styled-components';
import Button from '@mui/material/Button';

import { SPACES } from '../../theme';

export const AppButtonStyled = styled(Button)`
  border-radius: 5px !important;
  text-transform: capitalize !important;
  padding: ${SPACES.xs} ${SPACES.sm} !important;
`;
