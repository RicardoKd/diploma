import Container, { ContainerProps } from '@mui/material/Container';

import { MUI } from '../../theme';

export const FlexContainer: React.FC<ContainerProps> = ({
  sx,
  children,
  ...props
}) => (
  <Container
    maxWidth={MUI.containerWidth}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...sx,
    }}
    {...props}
  >
    {children}
  </Container>
);
