import { forwardRef, useCallback } from 'react';
import { Alert, AlertColor } from '@mui/material';

import { useSnackbar, SnackbarContent, CustomContentProps } from 'notistack';

interface ReportCompleteProps extends CustomContentProps {
  severity: AlertColor;
}

export const AlertStack = forwardRef<HTMLDivElement, ReportCompleteProps>(
  ({ id, style, message, severity }, ref) => {
    const { closeSnackbar } = useSnackbar();

    const handleClose = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
      <SnackbarContent ref={ref} style={style}>
        <Alert
          severity={severity}
          onClose={handleClose}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </SnackbarContent>
    );
  }
);

AlertStack.displayName = 'AlertStack';
