import { Range } from '../types';

export * from './charts.const';
export * from './app-keys.const';

export const SERVER_URL = 'http://localhost:4200';

export const NEW_PASSWORD_ERROR_MESSAGE =
  // eslint-disable-next-line max-len
  'Password must contain: at least one lowercase letter, uppercase letter, one digit, one special character (!@#$%^&*) and should be at least 8 characters long. Also make sure the passwords coinside';

export const QUERY_CLIENT_CONFIG = Object.freeze({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      refetchOnMount: false,
      keepPreviousData: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

export const RANGE_INITIAL_STATE: Range = 'month';

export const TIME_GAP_TYPES_OPTIONS = [
  { label: 'Day', value: 1 },
  { label: 'Week', value: 2 },
  { label: 'Month', value: 3 },
  { label: 'Year', value: 4 },
];

export const SNACKBAR_CONF = Object.freeze({
  maxSnack: 3,
  autoHideDuration: 5000
})
