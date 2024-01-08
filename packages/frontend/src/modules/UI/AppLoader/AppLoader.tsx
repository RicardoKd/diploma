import React from 'react';
import { AppLoaderStyled, AppLoaderWrapper } from './AppLoader.styled';

export const AppLoader: React.FC = () => (
  <AppLoaderWrapper>
    <AppLoaderStyled>
      <div />
      <div />
    </AppLoaderStyled>
  </AppLoaderWrapper>
);
