import styled from 'styled-components';

import { SPACES } from '../../theme';

export const LoginStyled = styled('div')`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  & > * {
    margin-bottom: ${SPACES.xxl} !important;
  }
`;
