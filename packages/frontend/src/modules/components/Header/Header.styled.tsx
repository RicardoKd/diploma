import styled from 'styled-components';

import { ADAPTIVE, SPACES, COLORS } from '../../theme';

export const HeaderStyled = styled('header')`
  background-color: ${COLORS.black};
  margin-bottom: ${SPACES.l};

  > div {
    height: 70px;
    margin: auto;
    display: flex;
    align-items: center;
    padding: 0 ${SPACES.m};
    max-width: ${ADAPTIVE.max};
    justify-content: space-between;

    div > * {
      margin-left: ${SPACES.m};
    }
  }
`;
