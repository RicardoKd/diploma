import { IAlertState } from "../types";
import { QUERY_KEYS } from "../constants";
import queryClient from "../app/queryClient";

export const showError = (errorMessage: string) => {
  queryClient.setQueryData<IAlertState>(QUERY_KEYS.ALERT_STACK, {
    isOpen: true,
    severity: 'error',
    message: errorMessage,
  });
}
