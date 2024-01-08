import React from 'react';

import { AlertStack } from '../UI';
import { MainRouter } from '../navigation';

export const App = () => (
  <>
    <MainRouter />
    <AlertStack />
  </>
);
