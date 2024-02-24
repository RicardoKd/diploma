import { AlertColor } from '@mui/material';

declare module '*.jpg' {
  export default '' as string;
}
declare module '*.png' {
  export default '' as string;
}
declare module '*.svg' {
  export default '' as string;
}

declare module 'notistack' {
  interface VariantOverrides {
    default: {
      severity: AlertColor;
    };
    success: {
      severity: AlertColor;
    };
    error: {
      severity: AlertColor;
    };
    warning: {
      severity: AlertColor;
    };
    info: {
      severity: AlertColor;
    };
  }
}
