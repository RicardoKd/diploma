import styled from 'styled-components';
import { ADAPTIVE } from '../../theme';

export const MainStyled = styled('main')`
  margin: auto;
  display: flex;
  min-height: 100vh;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  max-width: ${ADAPTIVE.max};
`;
