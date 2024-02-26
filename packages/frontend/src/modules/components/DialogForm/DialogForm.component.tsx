import React from 'react';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { FormikProps, FormikValues, useFormik } from 'formik';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  Dialog,
  Tooltip,
  MenuItem,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { AppButton } from '../../UI';
import { IFormField } from '../../types';
import { formatLabel, useAppSnackbar } from '../../utils';

interface FormProps {
  isOpen: boolean;
  formName: string;
  errorMessage: string;
  fields: IFormField[];
  successMessage: string;
  serviceMethodArgs?: {};
  handleClose: () => void;
  initialValues: FormikValues;
  validationSchema: Yup.Schema;
  errorCallback?: (error: any) => void;
  successCallback?: (data: unknown) => void;
  serviceMethod(data: FormikValues): Promise<unknown>;
}

export const DialogForm: React.FC<FormProps> = ({
  fields,
  isOpen,
  formName,
  handleClose,
  initialValues,
  serviceMethod,
  errorCallback,
  successCallback,
  validationSchema,
  serviceMethodArgs,
  successMessage = 'Success',
  errorMessage = 'Unknown error occurred',
}) => {
  const { showError, showSuccess } = useAppSnackbar();

  let formik: FormikProps<typeof initialValues>;

  const createMutation = useMutation(serviceMethod, {
    onSuccess: (data) => {
      showSuccess(successMessage);

      if (successCallback) {
        successCallback(data);
      }

      handleClose();
      formik.resetForm();
    },
    onError: (error: any) => {
      showError(errorMessage);

      if (errorCallback) {
        errorCallback(error);
      }
    },
  });

  formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) =>
      createMutation.mutate({ ...values, ...serviceMethodArgs }),
  });

  const onClose = () => {
    handleClose();
    formik.resetForm();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        component: 'form',
        onSubmit: formik.handleSubmit,
      }}
    >
      <DialogTitle>{formName}</DialogTitle>

      <DialogContent sx={{ width: '600px' }}>
        {fields.map(({ formItem, type, options, tooltipText }, i) => (
          <Box key={i} display="flex" alignItems="center">
            <TextField
              // key={i}
              type={type}
              id={formItem}
              name={formItem}
              select={!!options}
              label={formatLabel(formItem)}
              onChange={formik.handleChange}
              value={formik.values[formItem]}
              InputLabelProps={type === 'date' ? { shrink: true } : {}}
              error={formik.touched[formItem] && !!formik.errors[formItem]}
              helperText={
                (formik.touched[formItem] &&
                  formik.errors[formItem]) as React.ReactNode
              }
            >
              {options &&
                options.map(({ label, value }, key) => (
                  <MenuItem value={value} key={key}>
                    {label}
                  </MenuItem>
                ))}
            </TextField>
            {tooltipText ? (
              <Tooltip title={tooltipText} arrow>
                <HelpOutlineIcon />
              </Tooltip>
            ) : null}
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <AppButton onClick={onClose}>Cancel</AppButton>
        <AppButton type="submit">Submit</AppButton>
      </DialogActions>
    </Dialog>
  );
};
