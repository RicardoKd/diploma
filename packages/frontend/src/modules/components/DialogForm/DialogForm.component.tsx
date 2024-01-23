import React from 'react';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { FormikProps, FormikValues, useFormik } from 'formik';
import {
  Dialog,
  MenuItem,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { MUI } from '../../theme';
import { AppButton } from '../../UI';
import { showError, showSuccess } from '../../utils';

interface FormProps {
  isOpen: boolean;
  formName: string;
  errorMessage: string;
  serviceMethodArgs?: {};
  successMessage: string;
  initialValues: FormikValues;
  validationSchema: Yup.Schema;
  errorCallback?: (error: any) => void;
  successCallback?: (data: unknown) => void;
  handleClose: () => void;
  fields: {
    type?: string;
    formItem: string;
    options?: { label: string; value: string }[];
  }[];
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

  const formatLabel = (label: string): string => {
    let formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
    formattedLabel = formattedLabel.replaceAll('_', ' ');

    return formattedLabel;
  };

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
      <DialogContent>
        {fields.map(({ formItem, type, options }, i) => (
          <TextField
            InputLabelProps={type === 'date' ? { shrink: true } : {}}
            key={i}
            fullWidth
            type={type}
            id={formItem}
            name={formItem}
            size={MUI.size}
            margin={MUI.margin}
            select={!!options}
            variant={MUI.variant}
            label={formatLabel(formItem)}
            onChange={formik.handleChange}
            value={formik.values[formItem]}
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
        ))}
      </DialogContent>
      <DialogActions>
        <AppButton onClick={onClose} text="Cancel" />
        <AppButton text="Submit" type="submit" />
      </DialogActions>
    </Dialog>
  );
};
