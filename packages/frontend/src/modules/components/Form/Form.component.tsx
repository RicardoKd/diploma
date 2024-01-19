import React from 'react';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { FormikProps, FormikValues, useFormik } from 'formik';
import { MenuItem, TextField, Typography } from '@mui/material';

import { AppButton } from '../../UI';
import { MUI, SPACES } from '../../theme';
import { showError, showSuccess } from '../../utils';
import { FormStyled, FormButtons } from './Form.styled';

interface FormProps {
  formName: string;
  errorMessage: string;
  serviceMethodArgs?: {};
  successMessage: string;
  initialValues: FormikValues;
  validationSchema: Yup.Schema;
  errorCallback?: (error: any) => void;
  successCallback?: (data: unknown) => void;
  fields: {
    type?: string;
    formItem: string;
    options?: { label: string; value: string }[];
  }[];
  serviceMethod(data: FormikValues): Promise<unknown>;
}

export const Form: React.FC<FormProps> = ({
  fields,
  formName,
  initialValues,
  serviceMethod,
  errorCallback,
  successCallback,
  validationSchema,
  serviceMethodArgs,
  successMessage = 'Success',
  errorMessage = 'Unknown error occurred',
}) => {
  const navigate = useNavigate();

  let formik: FormikProps<typeof initialValues>;

  const createMutation = useMutation(serviceMethod, {
    onSuccess: (data) => {
      showSuccess(successMessage);

      if (successCallback) {
        successCallback(data);
      }

      formik.resetForm();
    },
    onError: (error: any) => {
      showError(`${errorMessage}: ${error.message}`);

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

  return (
    <>
      <Typography variant="h4" component="div" sx={{ marginBottom: SPACES.l }}>
        {formName}
      </Typography>
      <FormStyled onSubmit={formik.handleSubmit}>
        {fields.map(({ formItem, type, options }, i) => (
          <div key={i}>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {formItem.replaceAll('_', ' ')}
            </Typography>
            <TextField
              fullWidth
              type={type}
              id={formItem}
              name={formItem}
              size={MUI.size}
              select={!!options}
              variant={MUI.variant}
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
          </div>
        ))}

        <FormButtons>
          <AppButton text="Back" onClick={() => navigate(-1)} />
          <AppButton text="Submit" type="submit" />
        </FormButtons>
      </FormStyled>
    </>
  );
};
