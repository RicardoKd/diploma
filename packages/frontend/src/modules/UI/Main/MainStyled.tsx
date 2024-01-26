import styled from 'styled-components';
import { ADAPTIVE, SPACES } from '../../theme';

export const MainStyled = styled('main')`
  margin: auto;
  display: flex;
  min-height: 100vh;
  align-items: center;
  padding: 0 ${SPACES.m};
  flex-direction: column;
  justify-content: center;
  max-width: ${ADAPTIVE.max};
`;
