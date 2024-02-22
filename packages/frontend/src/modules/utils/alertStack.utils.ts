import { IAlertState } from '../types';
import { QUERY_KEYS } from '../constants';
import queryClient from '../app/queryClient';

export const showError = (message: string) => {
  queryClient.setQueryData<IAlertState>(QUERY_KEYS.ALERT_STACK, {
    isOpen: true,
    message: message,
    severity: 'error',
  });
};

export const showSuccess = (message: string) => {
  queryClient.setQueryData<IAlertState>(QUERY_KEYS.ALERT_STACK, {
    isOpen: true,
    message: message,
    severity: 'success',
  });
};
