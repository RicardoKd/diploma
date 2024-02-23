import React from 'react';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField } from '@mui/material';

import { userService } from '../../services';
import { ROUTER_KEYS } from '../../constants';
import { LoginFormItems } from './LoginFormItems';
import { AppButton, FlexContainer, ThemeToggle } from '../../UI';
import { FormikLoginForm } from './FormikLoginForm';
import { validationSchema } from './validationSchema';
import { BORDER_RADIUS, MUI, SPACES } from '../../theme';
import { formatLabel, logOut, showError, showSuccess } from '../../utils';

export const LoginPage = () => {
  logOut();

  const navigate = useNavigate();
  const formik = useFormik({
    validationSchema,
    initialValues: new FormikLoginForm(),
    onSubmit: (values) => createMutation.mutate(values),
  });
  const createMutation = useMutation(
    userService.login.bind(userService).bind(userService),
    {
      onSuccess: (data) => {
        showSuccess('Succesfully logged in');
        navigate(ROUTER_KEYS.HOME);
        formik.resetForm();
      },
      onError: () => showError('Failed to log in'),
    }
  );

  const fields = [
    { formItem: LoginFormItems.USER },
    { formItem: LoginFormItems.PASSWORD, type: 'password' },
  ];

  return (
    <FlexContainer sx={{ height: '100vh' }}>
      <Paper
        sx={{
          height: 350,
          maxWidth: 700,
          display: 'flex',
          overflow: 'hidden',
          alignItems: 'stretch',
          justifyContent: 'stretch',
          borderRadius: BORDER_RADIUS,
        }}
      >
        <Box
          width="50%"
          display="flex"
          alignItems="center"
          bgcolor="primary.main"
          justifyContent="center"
          color="primary.contrastText"
        >
          <Typography textAlign="center" variant="h2">
            Budgeting App
          </Typography>
        </Box>
        <Box
          width="50%"
          display="flex"
          padding={SPACES.m}
          flexDirection="column"
        >
          <Box display="flex" justifyContent="end">
            <ThemeToggle />
          </Box>
          <Box
            flexGrow="1"
            display="flex"
            component="form"
            alignItems="center"
            flexDirection="column"
            justifyContent="space-around"
            onSubmit={formik.handleSubmit}
          >
            <Typography variant="h4">Log In</Typography>
            {fields.map(({ formItem, type }, i) => (
              <TextField
                key={i}
                fullWidth
                type={type}
                id={formItem}
                name={formItem}
                size={MUI.size}
                variant={MUI.variant}
                label={formatLabel(formItem)}
                onChange={formik.handleChange}
                value={formik.values[formItem]}
                error={formik.touched[formItem] && !!formik.errors[formItem]}
                helperText={
                  (formik.touched[formItem] &&
                    formik.errors[formItem]) as React.ReactNode
                }
              />
            ))}
            <AppButton text="Log in" type="submit" />
          </Box>
        </Box>
      </Paper>
    </FlexContainer>
  );
};
