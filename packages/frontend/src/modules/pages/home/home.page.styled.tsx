import styled from 'styled-components';

import { ADAPTIVE } from '../../theme';

export const AccountCardsContainer = styled('div')`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  max-width: ${ADAPTIVE.max};
`;
