import styled from 'styled-components';

import { SPACES } from '../../theme';

export const ProfileStyled = styled('div')`
  width: 80%;
  display: flex;
  align-items: center;
  flex-direction: column;
  max-width: 300px;

  & > * {
    margin-bottom: ${SPACES.xxl} !important;
  }
`;

export const ButtonContainer = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;

  & > * {
    margin-bottom: ${SPACES.xxl};
  }
`;
