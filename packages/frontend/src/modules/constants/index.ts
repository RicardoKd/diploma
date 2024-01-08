import { IAlertState, IRange } from '../types';

export * from './app-keys.const';

export const SERVER_URL = 'http://localhost:4200';

export const NEW_PASSWORD_ERROR_MESSAGE =
  // eslint-disable-next-line max-len
  'Password must contain: at least one lowercase letter, uppercase letter, one digit, one special character (!@#$%^&*) and should be at least 8 characters long. Also make sure the passwords coinside';

export const QUERY_CLIENT_CONFIG = {
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      refetchOnMount: false,
      keepPreviousData: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false
    }
  }
};

export const RANGE_INITIAL_STATE: IRange = 'month';

export const ALERT_INITIAL_STATE: IAlertState = Object.freeze({
  message: '',
  isOpen: false,
  severity: 'error'
});
