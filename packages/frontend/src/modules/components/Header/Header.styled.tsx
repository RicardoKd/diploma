import styled from 'styled-components';

import { ADAPTIVE, SPACES, COLORS } from '../../theme';

export const HeaderStyled = styled('header')`
  background-color: ${COLORS.black};

  > div {
    height: 70px;
    margin: auto;
    display: flex;
    align-items: center;
    padding: 0 ${SPACES.m};
    max-width: ${ADAPTIVE.max};
    margin-bottom: ${SPACES.l};
    justify-content: space-between;

    div > * {
      margin-left: ${SPACES.m};
    }
  }
`;
