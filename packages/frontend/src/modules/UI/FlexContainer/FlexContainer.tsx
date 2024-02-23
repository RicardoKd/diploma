import Container, { ContainerProps } from '@mui/material/Container';

export const FlexContainer: React.FC<ContainerProps> = ({
  sx,
  children,
  ...props
}) => (
  <Container
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
