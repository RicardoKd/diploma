import React from 'react';
import { createRoot } from 'react-dom/client';
import AppContainer from './modules/app';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppContainer />
  </React.StrictMode>
);
