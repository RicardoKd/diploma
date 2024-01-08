import styled from 'styled-components';

import { SPACES } from '../../theme';

export const FormStyled = styled('form')`
  width: 80%;
  display: block;
  max-width: 350px;

  & > div {
    margin-bottom: ${SPACES.xl};
  }
`;

export const FormButtons = styled('div')`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;
