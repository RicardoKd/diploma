import React from 'react';
import { Alert, Snackbar, Stack } from '@mui/material';

import { useQuery } from 'react-query';
import { MUI, SPACES } from '../../theme';
import { IAlertState } from '../../types';
import queryClient from '../../app/queryClient';
import { ALERT_INITIAL_STATE, QUERY_KEYS } from '../../constants';

export const AlertStack = () => {
  const { isSuccess, data: state } = useQuery<IAlertState>({
    queryKey: [QUERY_KEYS.ALERT_STACK],
    initialData: ALERT_INITIAL_STATE,
  });

  if (!isSuccess) {
    throw new Error('AlertStack is not initialized');
  }

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason !== 'clickaway') {
      queryClient.setQueryData<IAlertState>(QUERY_KEYS.ALERT_STACK, {
        ...state,
        isOpen: false,
      });
    }
  };

  return (
    <Stack spacing={SPACES.xl} sx={{ width: '100%' }}>
      <Snackbar
        open={state.isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          variant={MUI.variant}
          severity={state.severity}
          sx={{ width: '100%' }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
