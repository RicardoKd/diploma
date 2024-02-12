import styled from 'styled-components';

import { SPACES } from '../../theme';

export const WelcomeStyled = styled('div')`
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  & > * {
    margin-bottom: ${SPACES.xxl} !important;
  }
`;
