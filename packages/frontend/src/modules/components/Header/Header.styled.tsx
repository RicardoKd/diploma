import styled from 'styled-components';

import { ADAPTIVE, SPACES } from '../../theme';

export const HeaderTop = styled('header')`
  height: 70px;
  margin: auto;
  display: flex;
  align-items: center;
  padding: 0 ${SPACES.m};
  max-width: ${ADAPTIVE.max};
  margin-bottom: ${SPACES.l};
  justify-content: space-between;
`;
