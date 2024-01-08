import { AlertColor } from '@mui/material/Alert';

export interface IAlertState {
  isOpen: boolean;
  message: string;
  severity: AlertColor;
}
