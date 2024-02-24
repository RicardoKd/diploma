import { useSnackbar } from 'notistack';

export const useAppSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();

  return {
    showError: (message: string) => {
      enqueueSnackbar(message, { variant: 'error', SnackbarProps: {} });
    },
    showSuccess: (message: string) => {
      enqueueSnackbar(message, { variant: 'success' });
    },
  };
};
